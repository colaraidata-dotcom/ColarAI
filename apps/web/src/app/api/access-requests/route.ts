import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient, getAuthenticatedUser, unauthorized } from '@/lib/supabase/server';
import { sendAccessRequestNotification } from '@/lib/email';
import { randomBytes } from 'crypto';

// Parent fetches their pending (and recent) access requests
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('access_requests')
    .select('id, domain, reason, status, created_at, profile_id, profiles(display_name, avatar_emoji)')
    .eq('account_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

const MAX_DOMAIN_LEN = 253;
const MAX_REASON_LEN = 500;

// Device sends an access request (child requesting approval for a blocked domain)
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ error: 'Missing device token' }, { status: 401 });
  }

  const supabase = createServiceClient();

  const { data: device } = await supabase
    .from('devices')
    .select('id, account_id, profile_id')
    .eq('device_token', token)
    .single();

  if (!device) {
    return NextResponse.json({ error: 'Invalid device token' }, { status: 401 });
  }

  const body = await request.json();
  const { domain, reason } = body;

  if (!domain || typeof domain !== 'string') {
    return NextResponse.json({ error: 'Missing domain' }, { status: 400 });
  }

  if (domain.length > MAX_DOMAIN_LEN) {
    return NextResponse.json({ error: 'Domain too long' }, { status: 400 });
  }

  if (reason && (typeof reason !== 'string' || reason.length > MAX_REASON_LEN)) {
    return NextResponse.json({ error: 'Reason too long' }, { status: 400 });
  }

  const id = `req_${randomBytes(8).toString('hex')}`;
  const { error } = await supabase.from('access_requests').insert({
    id,
    device_id: device.id,
    profile_id: device.profile_id,
    account_id: device.account_id,
    domain: domain.trim().toLowerCase(),
    reason: reason?.trim() ?? null,
    status: 'pending',
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const notifResult = await supabase.from('notifications').insert({
    id: `notif_${randomBytes(8).toString('hex')}`,
    account_id: device.account_id,
    type: 'access_request',
    title: 'Access Request',
    body: `A device is requesting access to ${domain.trim().toLowerCase()}.`,
    is_read: false,
    related_id: id,
  });

  if (notifResult.error) {
    console.error('Failed to create notification:', notifResult.error.message);
  }

  // Send email notification to the account owner (fire-and-forget)
  if (process.env.RESEND_API_KEY) {
    const { data: authUser } = await supabase.auth.admin.getUserById(device.account_id);
    const email = authUser?.user?.email;
    if (email) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://guardian.io';
      sendAccessRequestNotification({
        to: email,
        profileName: 'A profile on your account',
        domain: domain.trim().toLowerCase(),
        reason: reason?.trim() ?? null,
        approveUrl: `${appUrl}/notifications`,
        denyUrl: `${appUrl}/notifications`,
      }).catch((err) => console.error('Email send failed:', err));
    }
  }

  return NextResponse.json({ id, status: 'pending' });
}

// Parent approves or denies — requires authenticated user session
export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { id, status } = body;

  if (!id || typeof id !== 'string' || !['approved', 'denied'].includes(status)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  // Fetch the request first so we have domain + profile_id for override insertion
  const { data: req, error: fetchErr } = await supabase
    .from('access_requests')
    .select('domain, profile_id')
    .eq('id', id)
    .eq('account_id', user.id)
    .single();

  if (fetchErr || !req) {
    return NextResponse.json({ error: 'Request not found' }, { status: 404 });
  }

  const { error: updateErr } = await supabase
    .from('access_requests')
    .update({ status, responded_at: new Date().toISOString() })
    .eq('id', id)
    .eq('account_id', user.id);

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  // When approved, add a site_overrides allow entry so the DNS Worker permits the domain
  if (status === 'approved' && req.profile_id) {
    const overrideId = `ovr_${randomBytes(8).toString('hex')}`;
    await supabase.from('site_overrides').upsert(
      { id: overrideId, profile_id: req.profile_id, domain: req.domain, action: 'allow' },
      { onConflict: 'profile_id,domain' }
    );
    // DNS cache TTL is 60s — the allow will take effect automatically on next cache refresh
  }

  return NextResponse.json({ ok: true });
}
