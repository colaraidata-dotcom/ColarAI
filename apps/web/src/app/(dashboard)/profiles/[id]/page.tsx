import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Smartphone, Clock, Globe, Shield } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  mockProfiles, mockRules, mockSiteOverrides, mockSchedules, mockDevices,
} from '@guardian/shared/mock';
import { PROFILE_TYPE_META, CATEGORIES, CATEGORY_MAP } from '@guardian/shared/constants';

const ACTION_CONFIG = {
  allow: { label: 'Allowed', variant: 'success' as const },
  block: { label: 'Blocked', variant: 'danger' as const },
  limit: { label: 'Limited', variant: 'warning' as const },
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default async function ProfileDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = mockProfiles.find((p) => p.id === id);
  if (!profile) notFound();

  const meta = PROFILE_TYPE_META[profile.type];
  const rules = mockRules[profile.id] ?? [];
  const overrides = mockSiteOverrides[profile.id] ?? [];
  const schedules = mockSchedules[profile.id] ?? [];
  const devices = mockDevices.filter((d) => d.profileId === profile.id);

  const ruleMap = Object.fromEntries(rules.map((r) => [r.category, r]));

  return (
    <div className="p-8 flex flex-col gap-8 max-w-4xl">
      {/* Back + Header */}
      <div>
        <Link
          href="/profiles"
          className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#0F172A] mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Profiles
        </Link>
        <div className="flex items-center gap-4">
          <div
            className="h-16 w-16 rounded-2xl flex items-center justify-center text-3xl"
            style={{
              background: profile.avatarColor + '22',
              border: `1.5px solid ${profile.avatarColor}44`,
            }}
          >
            {profile.avatarEmoji}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]">{profile.name}</h1>
            <p className="text-[#64748B] text-sm">{meta.label} — {meta.description}</p>
          </div>
          <Badge variant={profile.isActive ? 'success' : 'muted'} className="ml-auto self-start">
            {profile.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </div>

      {/* Category Rules */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-4 w-4 text-[#0EA5E9]" />
          <h2 className="text-lg font-semibold text-[#0F172A]">Content Rules</h2>
        </div>
        <Card className="p-0 overflow-hidden">
          <div className="divide-y divide-[#1A1A2E]">
            {CATEGORIES.map((cat) => {
              const rule = ruleMap[cat.id];
              const action = rule?.action ?? cat.defaultAction[profile.type];
              const cfg = ACTION_CONFIG[action];
              return (
                <div key={cat.id} className="flex items-center justify-between px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{ background: cat.color + '20', color: cat.color }}
                    >
                      {cat.labelEn.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#0F172A]">{cat.label}</p>
                      <p className="text-xs text-[#94A3B8]">{cat.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {rule?.dailyLimitMinutes && (
                      <span className="text-xs text-[#64748B]">
                        Max {rule.dailyLimitMinutes}m/day
                      </span>
                    )}
                    <Badge variant={cfg.variant}>{cfg.label}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      {/* Schedules */}
      {schedules.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-[#F59E0B]" />
            <h2 className="text-lg font-semibold text-[#0F172A]">Time Schedules</h2>
          </div>
          <div className="flex flex-col gap-3">
            {schedules.map((sch) => (
              <Card key={sch.id} className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-[#0F172A]">{sch.label}</p>
                  <p className="text-sm text-[#64748B] mt-0.5">
                    {sch.startTime}–{sch.endTime}
                  </p>
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5, 6, 0].map((d, i) => (
                      <span
                        key={d}
                        className={`text-xs px-1.5 py-0.5 rounded ${
                          sch.days.includes(d)
                            ? 'bg-[#0EA5E9]/20 text-[#0EA5E9] font-medium'
                            : 'text-[#64748B]'
                        }`}
                      >
                        {DAYS[i]}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 max-w-xs">
                  {sch.categories.map((catId) => (
                    <Badge key={catId} variant="danger">
                      {CATEGORY_MAP[catId]?.label ?? catId}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Site Overrides */}
      {overrides.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-4 w-4 text-[#22C55E]" />
            <h2 className="text-lg font-semibold text-[#0F172A]">Site Overrides</h2>
          </div>
          <Card className="p-0 overflow-hidden">
            <div className="divide-y divide-[#1A1A2E]">
              {overrides.map((o) => {
                const cfg = ACTION_CONFIG[o.action];
                return (
                  <div key={o.id} className="flex items-center justify-between px-5 py-3">
                    <p className="text-sm font-mono text-[#0F172A]">{o.url}</p>
                    <Badge variant={cfg.variant}>{cfg.label}</Badge>
                  </div>
                );
              })}
            </div>
          </Card>
        </section>
      )}

      {/* Devices */}
      {devices.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Smartphone className="h-4 w-4 text-[#22D3EE]" />
            <h2 className="text-lg font-semibold text-[#0F172A]">Connected Devices</h2>
          </div>
          <Card className="p-0 overflow-hidden">
            <div className="divide-y divide-[#1A1A2E]">
              {devices.map((dev) => (
                <div key={dev.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-[#0F172A]">{dev.deviceName}</p>
                    <p className="text-xs text-[#94A3B8] capitalize">{dev.platform} · {dev.osVersion}</p>
                  </div>
                  <Badge variant={dev.isOnline ? 'success' : 'muted'}>
                    {dev.isOnline ? 'Online' : 'Offline'}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </section>
      )}
    </div>
  );
}
