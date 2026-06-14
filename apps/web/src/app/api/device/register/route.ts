import { NextRequest, NextResponse } from 'next/server';
import { createClient, getAuthenticatedUser, unauthorized } from '@/lib/supabase/server';
import { randomBytes } from 'crypto';

const VALID_PLATFORMS = ['ios', 'android', 'macos', 'windows'] as const;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { display_name, platform, profile_id } = body;

  if (!display_name || typeof display_name !== 'string' || display_name.trim().length === 0) {
    return NextResponse.json({ error: 'Missing display_name' }, { status: 400 });
  }

  if (display_name.length > 100) {
    return NextResponse.json({ error: 'display_name too long' }, { status: 400 });
  }

  if (!VALID_PLATFORMS.includes(platform)) {
    return NextResponse.json({ error: 'Invalid platform' }, { status: 400 });
  }

  // Verify profile belongs to this user before assigning
  if (profile_id) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', profile_id)
      .eq('account_id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Invalid profile_id' }, { status: 400 });
    }
  }

  const device_token = randomBytes(32).toString('hex');
  const id = `dev_${randomBytes(8).toString('hex')}`;

  const { data, error } = await supabase.from('devices').insert({
    id,
    account_id: user.id,
    display_name: display_name.trim(),
    platform,
    profile_id: profile_id ?? null,
    device_token,
    is_online: false,
  }).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const notifResult = await supabase.from('notifications').insert({
    id: `notif_${randomBytes(8).toString('hex')}`,
    account_id: user.id,
    type: 'device_added',
    title: 'New Device Added',
    body: `${display_name.trim()} (${platform}) has been registered to your account.`,
    is_read: false,
    related_id: id,
  });

  if (notifResult.error) {
    console.error('Failed to create notification:', notifResult.error.message);
  }

  return NextResponse.json({
    device_id: data.id,
    device_token,
    dns_server: process.env.DNS_RESOLVER_URL ?? 'https://dns.guardian.io',
    profile_id: data.profile_id,
  });
}
