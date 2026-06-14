import Link from 'next/link';
import { Plus, Smartphone } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PauseButton } from '@/components/dashboard/PauseButton';
import { getProfiles } from '@/lib/db/profiles';
import { PROFILE_TYPE_META } from '@guardian/shared/constants';

export default async function ProfilesPage() {
  const profiles = await getProfiles().catch(() => []);

  return (
    <div className="p-8 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Profiles</h1>
          <p className="text-[#64748B] text-sm mt-0.5">{profiles.length} profiles configured</p>
        </div>
        <Link href="/profiles/new">
          <Button>
            <Plus className="h-4 w-4" />
            New Profile
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profiles.map((profile) => {
          const meta = PROFILE_TYPE_META[profile.type];
          const devices = (profile as any).devices ?? [];
          const onlineCount = devices.filter((d: any) => d.is_online).length;
          const isPaused = profile.is_paused &&
            (!profile.pause_until || new Date(profile.pause_until) > new Date());

          return (
            <Card key={profile.id} className="flex items-start justify-between gap-4">
              <Link href={`/profiles/${profile.id}`} className="flex items-start gap-4 flex-1 min-w-0">
                <div
                  className="h-14 w-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                  style={{
                    background: profile.avatar_color + '22',
                    border: `1.5px solid ${profile.avatar_color}44`,
                  }}
                >
                  {profile.avatar_emoji}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-[#0F172A]">{profile.display_name}</p>
                  <p className="text-sm text-[#64748B]">{meta?.label}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs text-[#94A3B8] flex items-center gap-1">
                      <Smartphone className="h-3 w-3" />
                      {devices.length} devices{devices.length > 0 && ` (${onlineCount} online)`}
                    </span>
                    {isPaused && (
                      <Badge variant="warning">Paused</Badge>
                    )}
                  </div>
                </div>
              </Link>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <Badge variant={profile.is_active ? 'success' : 'muted'}>
                  {profile.is_active ? 'Active' : 'Inactive'}
                </Badge>
                <PauseButton
                  profileId={profile.id}
                  initialIsPaused={profile.is_paused ?? false}
                  initialPauseUntil={profile.pause_until}
                />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
