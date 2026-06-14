import { createClient } from '@/lib/supabase/server';

export async function getNotifications(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('notifications')
    .select('id, type, title, body, is_read, related_id, created_at')
    .eq('account_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;
  return data ?? [];
}

export async function markAllRead(userId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('account_id', userId)
    .eq('is_read', false);

  if (error) throw error;
}

export async function respondToAccessRequest(id: string, status: 'approved' | 'denied') {
  const supabase = await createClient();
  const { error } = await supabase
    .from('access_requests')
    .update({ status, responded_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
}
