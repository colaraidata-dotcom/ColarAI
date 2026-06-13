import { Shield, CheckCircle2, XCircle, Clock, Smartphone } from 'lucide-react';

const profiles = [
  { name: 'Emma', emoji: '🧒', color: '#3B82F6', type: 'Child', devices: 2, blocked: 8 },
  { name: 'Liam', emoji: '🧑', color: '#8B5CF6', type: 'Teen', devices: 2, blocked: 3 },
  { name: 'John (Work)', emoji: '🧑‍💼', color: '#22C55E', type: 'Self-Control', devices: 1, blocked: 12 },
];

const recentEvents = [
  { emoji: '🧒', name: 'Emma', action: 'blocked', site: 'tiktok.com', time: '9m ago' },
  { emoji: '🧑', name: 'Liam', action: 'blocked', site: 'instagram.com', time: '23m ago' },
  { emoji: '🧑‍💼', name: 'John', action: 'blocked', site: 'twitter.com', time: '1h ago' },
  { emoji: '🧒', name: 'Emma', action: 'allowed', site: 'khanacademy.org', time: '2h ago' },
];

export function DashboardPreviewMini() {
  return (
    <div className="rounded-2xl border border-[#1A1A2E] bg-[#0D0D1A] overflow-hidden shadow-2xl shadow-black/40">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1A1A2E] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-[#0EA5E9] flex items-center justify-center">
            <Shield className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-[#F1F5F9]">Guardian</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#22C55E]" />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 border-b border-[#1A1A2E]">
        {[
          { label: 'Profiles', value: '4' },
          { label: 'Devices', value: '6' },
          { label: 'Blocked today', value: '23' },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col items-center py-3 px-2 border-r border-[#1A1A2E] last:border-r-0">
            <span className="text-lg font-bold text-[#F1F5F9]">{stat.value}</span>
            <span className="text-xs text-[#64748B]">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Profile cards */}
      <div className="p-4 flex flex-col gap-3">
        <p className="text-xs font-medium text-[#64748B] uppercase tracking-wider">Profiles</p>
        {profiles.map((p) => (
          <div
            key={p.name}
            className="flex items-center justify-between rounded-xl border border-[#1A1A2E] bg-[#111120] px-3 py-2.5"
          >
            <div className="flex items-center gap-3">
              <div
                className="h-8 w-8 rounded-full flex items-center justify-center text-base"
                style={{ background: p.color + '22', border: `1.5px solid ${p.color}44` }}
              >
                {p.emoji}
              </div>
              <div>
                <p className="text-sm font-medium text-[#F1F5F9]">{p.name}</p>
                <p className="text-xs text-[#64748B]">{p.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#94A3B8]">
              <div className="flex items-center gap-1">
                <Smartphone className="h-3 w-3" />
                {p.devices}
              </div>
              <div className="flex items-center gap-1 text-[#EF4444]">
                <XCircle className="h-3 w-3" />
                {p.blocked}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent events */}
      <div className="border-t border-[#1A1A2E] p-4 flex flex-col gap-2">
        <p className="text-xs font-medium text-[#64748B] uppercase tracking-wider">Recent Activity</p>
        {recentEvents.map((e, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#CBD5E1]">
              <span>{e.emoji}</span>
              <span className="text-[#94A3B8]">{e.name}</span>
              {e.action === 'blocked' ? (
                <XCircle className="h-3 w-3 text-[#EF4444]" />
              ) : (
                <CheckCircle2 className="h-3 w-3 text-[#22C55E]" />
              )}
              <span className="font-mono">{e.site}</span>
            </div>
            <div className="flex items-center gap-1 text-[#64748B]">
              <Clock className="h-3 w-3" />
              {e.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
