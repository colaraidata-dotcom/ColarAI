import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { Sidebar } from './Sidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  let displayName = 'Demo User';
  let userEmail = '';
  let tier = 'free';

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      displayName = user.email ?? 'User';
      userEmail = user.email ?? '';
      const { data: settings } = await supabase
        .from('account_settings')
        .select('display_name, subscription_tier')
        .eq('id', user.id)
        .single();
      if (settings?.display_name) displayName = settings.display_name;
      if (settings?.subscription_tier) tier = settings.subscription_tier;
    }
  }

  return (
    <div className="flex h-screen bg-[#08080F] overflow-hidden">
      <Sidebar user={{ name: displayName, email: userEmail, tier }} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
