import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// DB row tipi (snake_case) — profiles tablosundan dönen gerçek yapı
export interface DbProfile {
  id: string;
  account_id: string;
  display_name: string;
  type: 'child' | 'teen' | 'adult_self' | 'adult_unrestricted';
  avatar_emoji: string;
  avatar_color: string;
  is_active: boolean;
  is_paused: boolean;
  pause_until: string | null;
  daily_limit_minutes: number | null;
  created_at: string;
  updated_at: string;
  // join ile gelen cihaz özeti
  devices?: Array<{ id: string; is_online: boolean }>;
}

interface ProfilesState {
  profiles: DbProfile[];
  isLoading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
}

export const useProfilesStore = create<ProfilesState>((set) => ({
  profiles: [],
  isLoading: false,
  error: null,

  fetch: async () => {
    if (!isSupabaseConfigured()) {
      set({ isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });
    const { data, error } = await supabase
      .from('profiles')
      .select('*, devices(id, is_online)')
      .order('created_at', { ascending: true });

    if (error) {
      set({ error: error.message, isLoading: false });
      return;
    }

    set({ profiles: (data as DbProfile[]) ?? [], isLoading: false });
  },
}));
