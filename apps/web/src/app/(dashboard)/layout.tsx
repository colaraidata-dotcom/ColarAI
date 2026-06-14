import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { Sidebar } from './Sidebar';
import { NotificationListener } from '@/components/NotificationListener';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  let displayName = 'Demo User';
  let userEmail = '';
  let tier = 'free';
  let userId = '';

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      userId = user.id;
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
    <div className="flex h-screen bg-[#F5F8FF] overflow-hidden">
      <Sidebar user={{ name: displayName, email: userEmail, tier }} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
      {userId && <NotificationListener userId={userId} />}
    </div>
  );
}
