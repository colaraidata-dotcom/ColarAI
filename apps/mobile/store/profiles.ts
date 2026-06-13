import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockProfiles } from '@guardian/shared/mock';
import type { Profile } from '@guardian/shared/types';

interface ProfilesState {
  profiles: Profile[];
  isLoading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
}

export const useProfilesStore = create<ProfilesState>((set) => ({
  profiles: mockProfiles,
  isLoading: false,
  error: null,

  fetch: async () => {
    if (!isSupabaseConfigured()) {
      set({ profiles: mockProfiles, isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      set({ error: error.message, isLoading: false });
      return;
    }

    set({ profiles: (data as Profile[]) ?? [], isLoading: false });
  },
}));
