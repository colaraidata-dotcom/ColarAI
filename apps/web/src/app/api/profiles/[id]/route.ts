import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/types';

type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { display_name, avatar_emoji, avatar_color, is_active, override_delay_minutes } = body;

  const updates: ProfileUpdate = {};
  if (display_name !== undefined) {
    if (typeof display_name !== 'string' || !display_name.trim() || display_name.length > 50) {
      return NextResponse.json({ error: 'Invalid display_name' }, { status: 400 });
    }
    updates.display_name = display_name.trim();
  }
  if (avatar_emoji !== undefined) updates.avatar_emoji = String(avatar_emoji);
  if (avatar_color !== undefined) updates.avatar_color = String(avatar_color);
  if (is_active !== undefined) updates.is_active = Boolean(is_active);
  if (override_delay_minutes !== undefined) {
    const delay = Number(override_delay_minutes);
    if (!Number.isInteger(delay) || delay < 0 || delay > 60) {
      return NextResponse.json({ error: 'override_delay_minutes must be 0–60' }, { status: 400 });
    }
    updates.override_delay_minutes = delay;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
  }

  // RLS ensures user can only update their own profiles
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .eq('account_id', user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  return NextResponse.json(data);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id)
    .eq('account_id', user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
