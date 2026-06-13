import { createClient } from '@/lib/supabase/server';

export async function getNotifications() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function markAllRead() {
  const supabase = await createClient();
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
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
