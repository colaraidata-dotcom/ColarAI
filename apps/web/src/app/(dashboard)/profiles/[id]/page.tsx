import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Smartphone, Clock, Globe, Shield, Zap } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PauseButton } from '@/components/dashboard/PauseButton';
import { ScheduleTemplates } from '@/components/dashboard/ScheduleTemplates';
import { OverrideDelaySettings } from '@/components/dashboard/OverrideDelaySettings';
import { getProfile } from '@/lib/db/profiles';
import { PROFILE_TYPE_META, CATEGORIES, CATEGORY_MAP } from '@guardian/shared/constants';

const ACTION_CONFIG = {
  allow: { label: 'Allowed', variant: 'success' as const },
  block: { label: 'Blocked', variant: 'danger' as const },
  limit: { label: 'Limited', variant: 'warning' as const },
};

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export default async function ProfileDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let profile: Awaited<ReturnType<typeof getProfile>>;
  try {
    profile = await getProfile(id);
  } catch {
    notFound();
  }

  const meta = PROFILE_TYPE_META[profile.type];
  const rules = profile.content_rules ?? [];
  const overrides = profile.site_overrides ?? [];
  const schedules = profile.schedules ?? [];
  const devices = profile.devices ?? [];

  const ruleMap = Object.fromEntries(rules.map((r) => [r.category, r]));
  const isPaused = profile.is_paused &&
    (!profile.pause_until || new Date(profile.pause_until) > new Date());

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
              background: profile.avatar_color + '22',
              border: `1.5px solid ${profile.avatar_color}44`,
            }}
          >
            {profile.avatar_emoji}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]">{profile.display_name}</h1>
            <p className="text-[#64748B] text-sm">{meta?.label} — {meta?.description}</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Badge variant={isPaused ? 'warning' : profile.is_active ? 'success' : 'muted'}>
              {isPaused ? 'Paused' : profile.is_active ? 'Active' : 'Inactive'}
            </Badge>
            <PauseButton
              profileId={profile.id}
              initialIsPaused={profile.is_paused ?? false}
              initialPauseUntil={profile.pause_until}
            />
          </div>
        </div>
      </div>

      {/* Self-control Delay — only for adult_self */}
      {profile.type === 'adult_self' && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-4 w-4 text-[#8B5CF6]" />
            <h2 className="text-lg font-semibold text-[#0F172A]">Self-control Settings</h2>
          </div>
          <OverrideDelaySettings
            profileId={profile.id}
            initialDelay={profile.override_delay_minutes ?? 0}
          />
        </section>
      )}

      {/* Content Rules */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-4 w-4 text-[#0EA5E9]" />
          <h2 className="text-lg font-semibold text-[#0F172A]">Content Rules</h2>
        </div>
        <Card className="p-0 overflow-hidden">
          <div className="divide-y divide-[#EEF3FF]">
            {CATEGORIES.map((cat) => {
              const rule = ruleMap[cat.id];
              const action = (rule?.action ?? cat.defaultAction?.[profile.type] ?? 'allow') as 'allow' | 'block' | 'limit';
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
                    {rule?.daily_limit_minutes && (
                      <span className="text-xs text-[#64748B]">
                        Max {rule.daily_limit_minutes}m/day
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

      {/* Schedules + Templates */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-[#F59E0B]" />
          <h2 className="text-lg font-semibold text-[#0F172A]">Time Schedules</h2>
        </div>

        {schedules.length > 0 && (
          <div className="flex flex-col gap-3 mb-4">
            {schedules.map((sch) => (
              <Card key={sch.id} className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-[#0F172A]">{sch.label}</p>
                  <p className="text-sm text-[#64748B] mt-0.5">
                    {sch.start_time}–{sch.end_time} · {sch.action === 'block_all' ? 'Block all' : 'Allow all'}
                  </p>
                  <div className="flex gap-1 mt-2">
                    {DAY_KEYS.map((key, i) => (
                      <span
                        key={key}
                        className={`text-xs px-1.5 py-0.5 rounded ${
                          sch.days.includes(key)
                            ? 'bg-[#0EA5E9]/15 text-[#0369A1] font-medium'
                            : 'text-[#94A3B8]'
                        }`}
                      >
                        {DAY_LABELS[i]}
                      </span>
                    ))}
                  </div>
                </div>
                <Badge variant={sch.is_active ? 'success' : 'muted'}>
                  {sch.is_active ? 'Active' : 'Off'}
                </Badge>
              </Card>
            ))}
          </div>
        )}

        <Card>
          <p className="text-sm font-medium text-[#0F172A] mb-3">Quick Templates</p>
          <ScheduleTemplates profileId={profile.id} />
        </Card>
      </section>

      {/* Site Overrides */}
      {overrides.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-4 w-4 text-[#22C55E]" />
            <h2 className="text-lg font-semibold text-[#0F172A]">Site Overrides</h2>
          </div>
          <Card className="p-0 overflow-hidden">
            <div className="divide-y divide-[#EEF3FF]">
              {overrides.map((o) => {
                const cfg = ACTION_CONFIG[o.action];
                return (
                  <div key={o.id} className="flex items-center justify-between px-5 py-3">
                    <p className="text-sm font-mono text-[#0F172A]">{o.domain}</p>
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
            <div className="divide-y divide-[#EEF3FF]">
              {devices.map((dev) => (
                <div key={dev.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-[#0F172A]">{dev.display_name}</p>
                    <p className="text-xs text-[#94A3B8] capitalize">{dev.platform}</p>
                  </div>
                  <Badge variant={dev.is_online ? 'success' : 'muted'}>
                    {dev.is_online ? 'Online' : 'Offline'}
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
