import { NextResponse } from 'next/server';
import { createClient, getAuthenticatedUser, unauthorized } from '@/lib/supabase/server';

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) return unauthorized();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('notifications')
    .select('id, type, title, body, is_read, related_id, created_at')
    .eq('account_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
