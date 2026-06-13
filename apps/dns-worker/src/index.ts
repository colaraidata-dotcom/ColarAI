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

async function getDeviceProfile(env: Env, deviceToken: string) {
  const cacheKey = `device:${deviceToken}`;
  const cached = await env.DNS_CACHE.get(cacheKey, 'json') as {
    device_id: string;
    profile_id: string | null;
    rules: Array<{ category: string; action: string }>;
    overrides: Array<{ domain: string; action: string }>;
  } | null;
  if (cached) return cached;

  const resp = await fetch(
    `${env.SUPABASE_URL}/rest/v1/devices?device_token=eq.${encodeURIComponent(deviceToken)}&select=id,profile_id,profiles(content_rules(*),site_overrides(*))`,
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

  const result = {
    device_id: device.id as string,
    profile_id: device.profile_id as string | null,
    rules: (profile?.content_rules ?? []) as Array<{ category: string; action: string }>,
    overrides: (profile?.site_overrides ?? []) as Array<{ domain: string; action: string }>,
  };

  // Cache profile for 60 seconds
  await env.DNS_CACHE.put(cacheKey, JSON.stringify(result), { expirationTtl: 60 });
  return result;
}

function shouldBlock(domain: string, rules: Array<{ category: string; action: string }>, overrides: Array<{ domain: string; action: string }>): { block: boolean; category: string | null } {
  // Check site overrides first (highest priority)
  const override = overrides.find((o) => domain === o.domain || domain.endsWith(`.${o.domain}`));
  if (override) {
    return { block: override.action === 'block', category: null };
  }

  // Check category rules
  const category = categorizeDomain(domain);
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

    const { block, category } = shouldBlock(domain, deviceProfile.rules, deviceProfile.overrides);

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

    const upstream = await resolveUpstream(dnsBody);
    return new Response(upstream, { headers: { 'Content-Type': 'application/dns-message' } });
  },
} satisfies ExportedHandler<Env>;
