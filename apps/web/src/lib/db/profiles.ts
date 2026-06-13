import { createClient } from '@/lib/supabase/server';
import type { ProfileType, RuleAction } from '@/lib/supabase/types';

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

export async function getProfile(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      content_rules(*),
      schedules(*),
      site_overrides(*),
      devices(*)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
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
