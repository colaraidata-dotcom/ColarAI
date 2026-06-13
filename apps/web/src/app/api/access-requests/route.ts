import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { randomBytes } from 'crypto';

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
    body: `A device is requesting access to a blocked site.`,
    is_read: false,
    related_id: id,
  });

  if (notifResult.error) {
    console.error('Failed to create notification:', notifResult.error.message);
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

  // RLS + explicit account_id filter ensure only the owning user can update
  const { error } = await supabase
    .from('access_requests')
    .update({ status, responded_at: new Date().toISOString() })
    .eq('id', id)
    .eq('account_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
