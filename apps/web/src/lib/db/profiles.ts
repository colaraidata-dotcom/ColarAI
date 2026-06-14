import { createClient } from '@/lib/supabase/server';
import type { ProfileType, RuleAction } from '@/lib/supabase/types';

export interface ProfileDetail {
  id: string;
  account_id: string;
  display_name: string;
  type: ProfileType;
  avatar_emoji: string;
  avatar_color: string;
  is_active: boolean;
  is_paused: boolean;
  pause_until: string | null;
  override_delay_minutes: number;
  daily_limit_minutes: number | null;
  created_at: string;
  updated_at: string;
  content_rules: Array<{ id: string; profile_id: string; category: string; action: RuleAction; daily_limit_minutes: number | null; created_at: string }>;
  schedules: Array<{ id: string; profile_id: string; label: string; start_time: string; end_time: string; days: string[]; action: 'block_all' | 'allow_all'; is_active: boolean; created_at: string }>;
  site_overrides: Array<{ id: string; profile_id: string; domain: string; action: RuleAction; created_at: string }>;
  devices: Array<{ id: string; display_name: string; platform: string; is_online: boolean; last_seen_at: string | null }>;
}

export async function getProfiles() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      devices(id, is_online)
    `)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getProfile(id: string): Promise<ProfileDetail> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id, account_id, display_name, type, avatar_emoji, avatar_color,
      is_active, is_paused, pause_until, override_delay_minutes, daily_limit_minutes,
      created_at, updated_at,
      content_rules(id, profile_id, category, action, daily_limit_minutes, created_at),
      schedules(id, profile_id, label, start_time, end_time, days, action, is_active, created_at),
      site_overrides(id, profile_id, domain, action, created_at),
      devices(id, display_name, platform, is_online, last_seen_at)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as unknown as ProfileDetail;
}

export async function createProfile(input: {
  display_name: string;
  type: ProfileType;
  avatar_color: string;
  daily_limit_minutes?: number | null;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const id = `prof_${Date.now()}`;
  const { data, error } = await supabase
    .from('profiles')
    .insert({ id, account_id: user.id, is_active: true, ...input })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfileRule(
  profileId: string,
  ruleId: string,
  action: RuleAction,
  dailyLimitMinutes?: number | null,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('content_rules')
    .update({ action, daily_limit_minutes: dailyLimitMinutes ?? null })
    .eq('id', ruleId)
    .eq('profile_id', profileId);

  if (error) throw error;
}
