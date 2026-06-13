import { Users, Smartphone, XCircle, Clock, Bell, CheckCircle2, AlertTriangle, Plus } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getDashboardStats, getPendingAccessRequests, getRecentNotifications } from '@/lib/db/dashboard';
import { getProfiles } from '@/lib/db/profiles';

const NOTIF_COLORS: Record<string, string> = {
  access_request: '#F59E0B',
  weekly_report: '#0EA5E9',
  device_added: '#22C55E',
  limit_reached: '#22D3EE',
  tamper_attempt: '#EF4444',
};

const NOTIF_ICONS: Record<string, typeof Bell> = {
  access_request: Bell,
  tamper_attempt: AlertTriangle,
};

function timeAgo(iso: string) {
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (secs < 60) return 'Just now';
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

export default async function DashboardPage() {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  // Fetch all data in parallel, fail gracefully
  const [stats, profiles, pendingRequests, recentNotifications] = await Promise.all([
    getDashboardStats().catch(() => ({ activeProfiles: 0, connectedDevices: 0, blockedToday: 0, totalRequestsToday: 0 })),
    getProfiles().catch(() => []),
    getPendingAccessRequests().catch(() => []),
    getRecentNotifications(4).catch(() => []),
  ]);

  const statCards = [
    { label: 'Active Profiles', value: String(stats.activeProfiles), icon: Users, color: '#0EA5E9' },
    { label: 'Connected Devices', value: String(stats.connectedDevices), icon: Smartphone, color: '#22C55E' },
    { label: 'Blocked Today', value: String(stats.blockedToday), icon: XCircle, color: '#EF4444' },
    { label: 'Requests Today', value: String(stats.totalRequestsToday), icon: Clock, color: '#F59E0B' },
  ];

  const PROFILE_TYPE_LABELS: Record<string, string> = {
    child: 'Child',
    teen: 'Teen',
    adult_self: 'Self-Control',
    adult_unrestricted: 'Unrestricted',
  };

  return (
    <div className="p-8 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F1F5F9]">Dashboard</h1>
          <p className="text-[#94A3B8] text-sm mt-0.5">{today}</p>
        </div>
        {pendingRequests.length > 0 && (
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-[#EF4444]" />
            <Badge variant="danger">{pendingRequests.length} pending request{pendingRequests.length > 1 ? 's' : ''}</Badge>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#94A3B8]">{s.label}</p>
                <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: s.color + '20' }}>
                  <Icon className="h-4 w-4" style={{ color: s.color }} />
                </div>
              </div>
              <p className="text-3xl font-bold text-[#F1F5F9]">{s.value}</p>
            </Card>
          );
        })}
      </div>

      {/* Pending requests */}
      {pendingRequests.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-[#F1F5F9] mb-4">Pending Access Requests</h2>
          <div className="flex flex-col gap-3">
            {pendingRequests.map((req: any) => (
              <div
                key={req.id}
                className="flex items-center justify-between rounded-xl border border-[#F59E0B]/20 bg-[#F59E0B]/5 px-5 py-4"
              >
                <div>
                  <p className="text-sm font-medium text-[#F1F5F9]">
                    {req.profiles?.display_name ?? 'Unknown profile'} — {req.domain}
                  </p>
                  <p className="text-xs text-[#94A3B8]">{req.reason ?? 'No reason given'} · {timeAgo(req.created_at)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="danger" size="sm">Deny</Button>
                  <Button size="sm">Approve</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Profiles */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#F1F5F9]">Profiles</h2>
          <Link href="/profiles">
            <Button variant="secondary" size="sm">
              <Plus className="h-3.5 w-3.5" />
              New Profile
            </Button>
          </Link>
        </div>

        {profiles.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-12 text-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-[#0EA5E9]/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-[#0EA5E9]" />
            </div>
            <p className="font-medium text-[#F1F5F9]">No profiles yet</p>
            <p className="text-sm text-[#64748B]">Create a profile for each person to enforce their rules.</p>
            <Link href="/profiles">
              <Button size="sm" className="mt-2">Create first profile</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {profiles.map((profile: any) => {
              const devices = profile.devices ?? [];
              const onlineCount = devices.filter((d: any) => d.is_online).length;
              return (
                <Link key={profile.id} href={`/profiles/${profile.id}`}>
                  <Card className="flex items-start justify-between gap-4 hover:border-[#0EA5E9]/30 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-12 w-12 rounded-2xl flex items-center justify-center text-lg font-bold text-white"
                        style={{ background: profile.avatar_color + 'CC' }}
                      >
                        {profile.display_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-[#F1F5F9]">{profile.display_name}</p>
                        <p className="text-sm text-[#94A3B8]">{PROFILE_TYPE_LABELS[profile.type] ?? profile.type}</p>
                        <p className="text-xs text-[#64748B] mt-0.5">
                          <Smartphone className="h-3 w-3 inline mr-1" />
                          {devices.length} device{devices.length !== 1 ? 's' : ''} ({onlineCount} online)
                        </p>
                      </div>
                    </div>
                    <Badge variant={profile.is_active ? 'success' : 'muted'}>
                      {profile.is_active ? <><CheckCircle2 className="h-3 w-3" />Active</> : 'Inactive'}
                    </Badge>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent notifications */}
      <div>
        <h2 className="text-lg font-semibold text-[#F1F5F9] mb-4">Recent Notifications</h2>
        {recentNotifications.length === 0 ? (
          <Card className="py-8 text-center text-sm text-[#64748B]">No notifications yet.</Card>
        ) : (
          <Card className="flex flex-col gap-0 p-0 overflow-hidden">
            {recentNotifications.map((notif: any, i: number) => {
              const color = NOTIF_COLORS[notif.type] ?? '#94A3B8';
              const Icon = NOTIF_ICONS[notif.type] ?? Bell;
              return (
                <div
                  key={notif.id}
                  className={`flex items-start gap-4 px-5 py-4 ${
                    i < recentNotifications.length - 1 ? 'border-b border-[#1A1A2E]' : ''
                  } ${!notif.is_read ? 'bg-[#111120]' : ''}`}
                >
                  <div className="shrink-0 mt-0.5">
                    <div className="h-7 w-7 rounded-full flex items-center justify-center" style={{ background: color + '20' }}>
                      <Icon className="h-3.5 w-3.5" style={{ color }} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${!notif.is_read ? 'text-[#F1F5F9]' : 'text-[#CBD5E1]'}`}>
                      {notif.title}
                    </p>
                    <p className="text-xs text-[#94A3B8] mt-0.5">{notif.body}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-[#475569]">{timeAgo(notif.created_at)}</span>
                    {!notif.is_read && <div className="h-2 w-2 rounded-full bg-[#0EA5E9]" />}
                  </div>
                </div>
              );
            })}
          </Card>
        )}
      </div>
    </div>
  );
}
