import { NextRequest, NextResponse } from 'next/server';
import { createClient, getAuthenticatedUser, unauthorized } from '@/lib/supabase/server';

// POST /api/profiles/[id]/pause
// Body: { pause_minutes?: number }  — omit to pause indefinitely, 0 to unpause
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const pause_minutes: number | undefined = body.pause_minutes;

  // unpause
  if (pause_minutes === 0) {
    const { error } = await supabase
      .from('profiles')
      .update({ is_paused: false, pause_until: null })
      .eq('id', id)
      .eq('account_id', user.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ is_paused: false, pause_until: null });
  }

  // pause
  const pause_until = pause_minutes
    ? new Date(Date.now() + pause_minutes * 60_000).toISOString()
    : null;

  const { data, error } = await supabase
    .from('profiles')
    .update({ is_paused: true, pause_until })
    .eq('id', id)
    .eq('account_id', user.id)
    .select('is_paused, pause_until')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  return NextResponse.json(data);
}
