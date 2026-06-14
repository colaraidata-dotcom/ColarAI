import { NextRequest, NextResponse } from 'next/server';
import { createClient, getAuthenticatedUser, unauthorized } from '@/lib/supabase/server';
import { randomBytes } from 'crypto';

const VALID_TYPES = ['child', 'teen', 'self_control', 'unrestricted'] as const;

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('profiles')
    .select('*, devices(id, display_name, platform, is_online)')
    .eq('account_id', user.id)
    .order('created_at', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { display_name, type, avatar_emoji, avatar_color } = body;

  if (!display_name || typeof display_name !== 'string' || !display_name.trim()) {
    return NextResponse.json({ error: 'display_name required' }, { status: 400 });
  }
  if (display_name.length > 50) {
    return NextResponse.json({ error: 'display_name too long' }, { status: 400 });
  }
  if (!VALID_TYPES.includes(type)) {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  const id = `prof_${randomBytes(8).toString('hex')}`;

  const { data, error } = await supabase.from('profiles').insert({
    id,
    account_id: user.id,
    display_name: display_name.trim(),
    type,
    avatar_emoji: avatar_emoji ?? '👤',
    avatar_color: avatar_color ?? '#0EA5E9',
    is_active: true,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
