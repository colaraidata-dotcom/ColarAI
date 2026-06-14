import { NextRequest, NextResponse } from 'next/server';
import { createClient, getAuthenticatedUser, unauthorized } from '@/lib/supabase/server';
import { randomBytes } from 'crypto';

// POST /api/profiles/[id]/pending-override
// Creates a delayed rule change for adult_self profiles
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  // Verify profile ownership + get delay setting
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, type, override_delay_minutes')
    .eq('id', id)
    .eq('account_id', user.id)
    .single();

  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  if (profile.type !== 'adult_self') {
    return NextResponse.json({ error: 'Pending overrides only apply to adult_self profiles' }, { status: 400 });
  }

  const body = await request.json();
  const { category, new_action, new_daily_limit_minutes } = body;

  if (!category || !new_action) {
    return NextResponse.json({ error: 'Missing category or new_action' }, { status: 400 });
  }
  if (!['allow', 'block', 'limit'].includes(new_action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  const delayMs = (profile.override_delay_minutes ?? 0) * 60_000;
  const apply_at = new Date(Date.now() + delayMs).toISOString();

  const overrideId = `po_${randomBytes(8).toString('hex')}`;
  const { data, error } = await supabase
    .from('pending_overrides')
    .insert({
      id: overrideId,
      profile_id: id,
      category,
      new_action,
      new_daily_limit_minutes: new_daily_limit_minutes ?? null,
      apply_at,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ...data, delay_minutes: profile.override_delay_minutes }, { status: 201 });
}
