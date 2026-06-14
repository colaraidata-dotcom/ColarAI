import { NextRequest, NextResponse } from 'next/server';
import { createClient, getAuthenticatedUser, unauthorized } from '@/lib/supabase/server';
import { randomBytes } from 'crypto';

// POST /api/profiles/[id]/schedules — create a schedule (e.g. from template)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  // Verify profile ownership
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', id)
    .eq('account_id', user.id)
    .single();
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  const body = await request.json();
  const { label, start_time, end_time, days, action } = body;

  if (!label || !start_time || !end_time || !Array.isArray(days) || !action) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  if (!['block_all', 'allow_all'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  const scheduleId = `sch_${randomBytes(8).toString('hex')}`;
  const { data, error } = await supabase
    .from('schedules')
    .insert({ id: scheduleId, profile_id: id, label, start_time, end_time, days, action })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// DELETE /api/profiles/[id]/schedules?scheduleId=xxx
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const scheduleId = new URL(request.url).searchParams.get('scheduleId');
  if (!scheduleId) return NextResponse.json({ error: 'scheduleId required' }, { status: 400 });

  const { error } = await supabase
    .from('schedules')
    .delete()
    .eq('id', scheduleId)
    .eq('profile_id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
