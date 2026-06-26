/**
 * Guardian DNS Worker — Cloudflare Worker
 *
 * Receives DNS-over-HTTPS (DoH) queries from Guardian device apps.
 * 1. Authenticates device via device_token header
 * 2. Looks up profile rules for that device
 * 3. Checks domain against content rules (category-based) and site overrides
 * 4. Returns NXDOMAIN (block) or real DNS response (allow)
 * 5. Logs the decision to Supabase
 *
 * DoH endpoint: POST /dns-query  (application/dns-message)
 * Device auth:  Authorization: Bearer <device_token>
 */

interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
  DNS_CACHE: KVNamespace;
  AI: Ai;
}

// Content categories mapped to common domain patterns (simplified)
// In production, use a real DNS categorization API (e.g. Cloudflare Gateway, iboss)
const CATEGORY_PATTERNS: Record<string, RegExp[]> = {
  social_media: [/instagram\.com$/, /tiktok\.com$/, /twitter\.com$/, /x\.com$/, /facebook\.com$/, /snapchat\.com$/],
  adult_content: [/pornhub\.com$/, /xvideos\.com$/, /xhamster\.com$/],
  gaming: [/steam\.com$/, /roblox\.com$/, /epicgames\.com$/, /battlenet\.com$/],
  gambling: [/betway\.com$/, /bet365\.com$/, /draftkings\.com$/],
  education: [/khanacademy\.org$/, /coursera\.org$/, /duolingo\.com$/],
  streaming: [/netflix\.com$/, /youtube\.com$/, /twitch\.tv$/, /spotify\.com$/],
  news: [/bbc\.com$/, /cnn\.com$/, /reuters\.com$/],
  shopping: [/amazon\.com$/, /ebay\.com$/, /etsy\.com$/],
};

function categorizeDomain(domain: string): string | null {
  for (const [category, patterns] of Object.entries(CATEGORY_PATTERNS)) {
    if (patterns.some((p) => p.test(domain))) return category;
  }
  return null;
}

const VALID_CATEGORIES = new Set(Object.keys(CATEGORY_PATTERNS));

// L2: shared, persistent category cache in Supabase. Returns { hit } so a
// negative cache (category = null) is distinguishable from a row-not-found miss.
async function getDomainCategoryFromDb(env: Env, domain: string): Promise<{ hit: boolean; category: string | null }> {
  try {
    const resp = await fetch(
      `${env.SUPABASE_URL}/rest/v1/domain_categories?domain=eq.${encodeURIComponent(domain)}&select=category`,
      {
        headers: {
          'apikey': env.SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        },
      }
    );
    const rows = (await resp.json()) as Array<{ category: string | null }>;
    if (!rows?.length) return { hit: false, category: null };
    return { hit: true, category: rows[0].category };
  } catch {
    return { hit: false, category: null };
  }
}

async function putDomainCategoryToDb(env: Env, domain: string, category: string | null): Promise<void> {
  try {
    await fetch(`${env.SUPABASE_URL}/rest/v1/domain_categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': env.SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        'Prefer': 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify({ domain, category, source: 'ai', updated_at: new Date().toISOString() }),
    });
  } catch {
    // Best-effort persistence; failure just means the next miss re-classifies.
  }
}

// Cache-first cascade: KV (L1, per-edge) → Supabase (L2, shared/persistent) → AI (L3).
// Each domain is classified at most once; every later lookup reads from cache.
async function resolveDomainCategory(env: Env, domain: string): Promise<string | null> {
  const cacheKey = `ai_cat:${domain}`;

  // L1 — KV edge cache
  const cached = await env.DNS_CACHE.get(cacheKey);
  if (cached !== null) return cached === '' ? null : cached;

  // L2 — shared persistent DB cache (warms KV on hit)
  const db = await getDomainCategoryFromDb(env, domain);
  if (db.hit) {
    await env.DNS_CACHE.put(cacheKey, db.category ?? '', { expirationTtl: 86400 });
    return db.category;
  }

  // L3 — AI classification for the long tail (only if AI is bound)
  if (!env.AI) return null;
  try {
    const resp = await (env.AI as any).run('@cf/meta/llama-3-8b-instruct', {
      messages: [
        {
          role: 'system',
          content: `You are a domain content classifier. Classify the given domain into exactly one of these categories: ${[...VALID_CATEGORIES].join(', ')}. If none fit, respond with "unknown". Respond with only the category name, no explanation.`,
        },
        { role: 'user', content: domain },
      ],
      max_tokens: 10,
    });
    const text = (resp as { response?: string })?.response?.trim().toLowerCase() ?? '';
    const category = VALID_CATEGORIES.has(text) ? text : null;
    // Write back to both cache layers so this AI call is never repeated.
    await env.DNS_CACHE.put(cacheKey, category ?? '', { expirationTtl: 86400 });
    await putDomainCategoryToDb(env, domain, category);
    return category;
  } catch {
    return null;
  }
}

function extractDomainFromDnsQuery(body: ArrayBuffer): string | null {
  try {
    const view = new DataView(body);
    let offset = 12; // skip DNS header (12 bytes)
    const labels: string[] = [];

    while (offset < view.byteLength) {
      const len = view.getUint8(offset);
      if (len === 0) break;
      offset++;
      const label = new TextDecoder().decode(new Uint8Array(body, offset, len));
      labels.push(label);
      offset += len;
    }
    return labels.join('.').toLowerCase() || null;
  } catch {
    return null;
  }
}

function buildNxDomainResponse(queryId: number): Uint8Array {
  // DNS NXDOMAIN response (RCODE=3)
  return new Uint8Array([
    (queryId >> 8) & 0xff, queryId & 0xff, // ID
    0x81, 0x83, // Flags: QR=1, AA=0, RCODE=3 (NXDOMAIN)
    0x00, 0x01, // QDCOUNT=1
    0x00, 0x00, // ANCOUNT=0
    0x00, 0x00, // NSCOUNT=0
    0x00, 0x00, // ARCOUNT=0
  ]);
}

async function resolveUpstream(dnsBody: ArrayBuffer): Promise<ArrayBuffer> {
  const resp = await fetch('https://1.1.1.1/dns-query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/dns-message', 'Accept': 'application/dns-message' },
    body: dnsBody,
  });
  return resp.arrayBuffer();
}

async function logDecision(env: Env, opts: {
  device_id: string;
  profile_id: string | null;
  domain: string;
  action: 'allowed' | 'blocked';
  category: string | null;
}) {
  const domainHash = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(opts.domain)
  ).then((buf) => Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join(''));

  await fetch(`${env.SUPABASE_URL}/rest/v1/access_logs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': env.SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({
      device_id: opts.device_id,
      profile_id: opts.profile_id,
      domain_hash: domainHash,
      action: opts.action,
      category: opts.category,
      created_at: new Date().toISOString(),
    }),
  });
}

interface Schedule {
  start_time: string; // "HH:MM"
  end_time: string;   // "HH:MM"
  days: string[];     // ["mon","tue",...]
  action: 'block_all' | 'allow_all';
  is_active: boolean;
}

interface DeviceProfile {
  device_id: string;
  profile_id: string | null;
  daily_limit_minutes: number | null;
  is_paused: boolean;
  pause_until: string | null;
  rules: Array<{ category: string; action: string }>;
  overrides: Array<{ domain: string; action: string }>;
  schedules: Schedule[];
}

async function getDeviceProfile(env: Env, deviceToken: string): Promise<DeviceProfile | null> {
  const cacheKey = `device:${deviceToken}`;
  const cached = await env.DNS_CACHE.get(cacheKey, 'json') as DeviceProfile | null;
  if (cached) return cached;

  const resp = await fetch(
    `${env.SUPABASE_URL}/rest/v1/devices?device_token=eq.${encodeURIComponent(deviceToken)}&select=id,profile_id,profiles(daily_limit_minutes,content_rules(*),site_overrides(*),schedules(*))`,
    {
      headers: {
        'apikey': env.SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
      },
    }
  );

  const rows: any[] = await resp.json();
  if (!rows?.length) return null;

  const device = rows[0];
  const profile = device.profiles;

  const result: DeviceProfile = {
    device_id: device.id as string,
    profile_id: device.profile_id as string | null,
    daily_limit_minutes: profile?.daily_limit_minutes ?? null,
    is_paused: profile?.is_paused ?? false,
    pause_until: profile?.pause_until ?? null,
    rules: (profile?.content_rules ?? []) as Array<{ category: string; action: string }>,
    overrides: (profile?.site_overrides ?? []) as Array<{ domain: string; action: string }>,
    schedules: (profile?.schedules ?? []) as Schedule[],
  };

  // Cache profile for 60 seconds
  await env.DNS_CACHE.put(cacheKey, JSON.stringify(result), { expirationTtl: 60 });
  return result;
}

const DAY_NAMES = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

function getActiveScheduleAction(schedules: Schedule[], now: Date): 'block_all' | 'allow_all' | null {
  const dayName = DAY_NAMES[now.getUTCDay()];
  const hhmm = `${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}`;

  for (const s of schedules) {
    if (!s.is_active) continue;
    if (!s.days.includes(dayName)) continue;
    // Handle overnight windows (e.g. 22:00–06:00)
    const inWindow = s.start_time <= s.end_time
      ? hhmm >= s.start_time && hhmm < s.end_time
      : hhmm >= s.start_time || hhmm < s.end_time;
    if (inWindow) return s.action;
  }
  return null;
}

async function isDailyLimitExceeded(env: Env, profileId: string, limitMinutes: number): Promise<boolean> {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const key = `daily:${profileId}:${today}`;
  const raw = await env.DNS_CACHE.get(key);
  const count = raw ? parseInt(raw, 10) : 0;
  // 1 DNS query ≈ 3 seconds of activity → limit_minutes * 20 queries ≈ limit_minutes of browsing
  return count >= limitMinutes * 20;
}

async function incrementDailyUsage(env: Env, profileId: string): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  const key = `daily:${profileId}:${today}`;
  const raw = await env.DNS_CACHE.get(key);
  const count = (raw ? parseInt(raw, 10) : 0) + 1;
  // TTL of 2 days so stale keys auto-expire
  await env.DNS_CACHE.put(key, String(count), { expirationTtl: 172800 });
}

async function shouldBlock(
  env: Env,
  domain: string,
  rules: Array<{ category: string; action: string }>,
  overrides: Array<{ domain: string; action: string }>
): Promise<{ block: boolean; category: string | null }> {
  // Check site overrides first (highest priority)
  const override = overrides.find((o) => domain === o.domain || domain.endsWith(`.${o.domain}`));
  if (override) {
    return { block: override.action === 'block', category: null };
  }

  // Pattern-based categorization first (fast, no API cost)
  let category = categorizeDomain(domain);

  // If uncategorized, fall through the cache-first cascade (KV → DB → AI)
  if (!category && rules.length > 0) {
    category = await resolveDomainCategory(env, domain);
  }

  if (category) {
    const rule = rules.find((r) => r.category === category);
    if (rule?.action === 'block') {
      return { block: true, category };
    }
  }

  return { block: false, category };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const contentType = request.headers.get('Content-Type');
    if (contentType !== 'application/dns-message') {
      return new Response('Expected application/dns-message', { status: 415 });
    }

    const deviceToken = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!deviceToken) {
      return new Response('Missing Authorization', { status: 401 });
    }

    const dnsBody = await request.arrayBuffer();
    const queryId = new DataView(dnsBody).getUint16(0);
    const domain = extractDomainFromDnsQuery(dnsBody);

    if (!domain) {
      const upstream = await resolveUpstream(dnsBody);
      return new Response(upstream, { headers: { 'Content-Type': 'application/dns-message' } });
    }

    // Auth + rule lookup (cached per device token for 60s)
    const deviceProfile = await getDeviceProfile(env, deviceToken);

    if (!deviceProfile) {
      // Unknown device — pass through but don't log
      const upstream = await resolveUpstream(dnsBody);
      return new Response(upstream, { headers: { 'Content-Type': 'application/dns-message' } });
    }

    const now = new Date();

    // Pause Internet — highest priority check
    const pauseActive = deviceProfile.is_paused &&
      (!deviceProfile.pause_until || new Date(deviceProfile.pause_until) > now);
    if (pauseActive) {
      void logDecision(env, { device_id: deviceProfile.device_id, profile_id: deviceProfile.profile_id, domain, action: 'blocked', category: 'paused' });
      return new Response(buildNxDomainResponse(queryId), { headers: { 'Content-Type': 'application/dns-message' } });
    }

    // Schedule enforcement — check time-based rules first
    const scheduleAction = getActiveScheduleAction(deviceProfile.schedules, now);
    if (scheduleAction === 'block_all') {
      void logDecision(env, { device_id: deviceProfile.device_id, profile_id: deviceProfile.profile_id, domain, action: 'blocked', category: 'schedule' });
      return new Response(buildNxDomainResponse(queryId), { headers: { 'Content-Type': 'application/dns-message' } });
    }

    // Daily limit enforcement
    if (deviceProfile.profile_id && deviceProfile.daily_limit_minutes) {
      const exceeded = await isDailyLimitExceeded(env, deviceProfile.profile_id, deviceProfile.daily_limit_minutes);
      if (exceeded) {
        void logDecision(env, { device_id: deviceProfile.device_id, profile_id: deviceProfile.profile_id, domain, action: 'blocked', category: 'daily_limit' });
        return new Response(buildNxDomainResponse(queryId), { headers: { 'Content-Type': 'application/dns-message' } });
      }
    }

    // schedule allow_all overrides category rules (but site overrides still win)
    const forceAllow = scheduleAction === 'allow_all';
    const { block, category } = forceAllow
      ? { block: false, category: null }
      : await shouldBlock(env, domain, deviceProfile.rules, deviceProfile.overrides);

    // Log asynchronously (don't block the DNS response)
    void logDecision(env, {
      device_id: deviceProfile.device_id,
      profile_id: deviceProfile.profile_id,
      domain,
      action: block ? 'blocked' : 'allowed',
      category,
    });

    if (block) {
      return new Response(buildNxDomainResponse(queryId), {
        headers: { 'Content-Type': 'application/dns-message' },
      });
    }

    // Increment daily usage counter for allowed queries
    if (deviceProfile.profile_id) {
      void incrementDailyUsage(env, deviceProfile.profile_id);
    }

    const upstream = await resolveUpstream(dnsBody);
    return new Response(upstream, { headers: { 'Content-Type': 'application/dns-message' } });
  },
} satisfies ExportedHandler<Env>;
