import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ error: 'Missing device token' }, { status: 401 });
  }

  const supabase = createServiceClient();

  const { data: device, error } = await supabase
    .from('devices')
    .select('id, account_id, profile_id, is_online')
    .eq('device_token', token)
    .single();

  if (error || !device) {
    return NextResponse.json({ error: 'Invalid device token' }, { status: 401 });
  }

  await supabase
    .from('devices')
    .update({ is_online: true, last_seen_at: new Date().toISOString() })
    .eq('id', device.id);

  return NextResponse.json({
    ok: true,
    profile_id: device.profile_id,
    timestamp: new Date().toISOString(),
  });
}
