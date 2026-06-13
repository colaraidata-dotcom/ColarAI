'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Shield, LayoutDashboard, Users, BarChart3, Bell, Settings, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/profiles', icon: Users, label: 'Profiles' },
  { href: '/reports', icon: BarChart3, label: 'Reports' },
  { href: '/notifications', icon: Bell, label: 'Notifications' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

const TIER_LABELS: Record<string, string> = {
  free: 'Free',
  basic: 'Basic',
  family: 'Family',
};

interface Props {
  user: { name: string; email: string; tier: string };
}

export function Sidebar({ user }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/sign-in');
    router.refresh();
  }

  return (
    <aside className="w-64 shrink-0 flex flex-col border-r border-[#1A1A2E] bg-[#0D0D1A]">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-[#1A1A2E]">
        <div className="h-8 w-8 rounded-lg bg-[#0EA5E9] flex items-center justify-center">
          <Shield className="h-4 w-4 text-white" />
        </div>
        <span className="font-semibold text-[#F1F5F9]">Guardian</span>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'bg-[#0EA5E9]/15 text-[#F1F5F9] font-medium'
                  : 'text-[#94A3B8] hover:bg-[#111120] hover:text-[#F1F5F9]'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-[#0EA5E9]' : ''}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[#1A1A2E]">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 mb-1">
          <div className="h-8 w-8 rounded-full bg-[#0EA5E9]/20 flex items-center justify-center text-sm font-medium text-[#0EA5E9]">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#F1F5F9] truncate">{user.name}</p>
            <p className="text-xs text-[#64748B] truncate">
              {TIER_LABELS[user.tier] ?? 'Free'} Plan
            </p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-[#64748B] hover:text-[#F1F5F9] hover:bg-[#111120] transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
