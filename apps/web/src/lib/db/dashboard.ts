import { createClient } from '@/lib/supabase/server';

export async function getDashboardStats() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [profilesRes, devicesRes, blockedTodayRes, avgTimeRes] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('account_id', user.id).eq('is_active', true),
    supabase.from('devices').select('id', { count: 'exact', head: true }).eq('account_id', user.id),
    supabase.from('access_logs')
      .select('id', { count: 'exact', head: true })
      .eq('action', 'blocked')
      .gte('created_at', today.toISOString()),
    supabase.from('access_logs')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', today.toISOString()),
  ]);

  return {
    activeProfiles: profilesRes.count ?? 0,
    connectedDevices: devicesRes.count ?? 0,
    blockedToday: blockedTodayRes.count ?? 0,
    totalRequestsToday: avgTimeRes.count ?? 0,
  };
}

export async function getRecentNotifications(limit = 5) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('notifications')
    .select('id, type, title, body, is_read, related_id, created_at')
    .eq('account_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

export async function getPendingAccessRequests() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('access_requests')
    .select(`*, devices(display_name, platform), profiles(display_name)`)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}
