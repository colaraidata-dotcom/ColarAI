import Link from 'next/link';
import { Plus, Smartphone, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { mockProfiles, mockDevices } from '@guardian/shared/mock';
import { PROFILE_TYPE_META } from '@guardian/shared/constants';

export default function ProfilesPage() {
  return (
    <div className="p-8 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F1F5F9]">Profiles</h1>
          <p className="text-[#94A3B8] text-sm mt-0.5">{mockProfiles.length} profiles configured</p>
        </div>
        <Link href="/profiles/new">
          <Button>
            <Plus className="h-4 w-4" />
            New Profile
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockProfiles.map((profile) => {
          const meta = PROFILE_TYPE_META[profile.type];
          const profileDevices = mockDevices.filter((d) => d.profileId === profile.id);
          const onlineCount = profileDevices.filter((d) => d.isOnline).length;

          return (
            <Link key={profile.id} href={`/profiles/${profile.id}`}>
              <Card className="flex items-start justify-between gap-4 hover:border-[#0EA5E9]/40 transition-colors cursor-pointer">
                <div className="flex items-start gap-4">
                  <div
                    className="h-14 w-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                    style={{
                      background: profile.avatarColor + '22',
                      border: `1.5px solid ${profile.avatarColor}44`,
                    }}
                  >
                    {profile.avatarEmoji}
                  </div>
                  <div>
                    <p className="font-semibold text-[#F1F5F9]">{profile.name}</p>
                    <p className="text-sm text-[#94A3B8]">{meta.label}</p>
                    <p className="text-xs text-[#64748B] mt-1 leading-relaxed max-w-xs">
                      {meta.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-[#64748B] flex items-center gap-1">
                        <Smartphone className="h-3 w-3" />
                        {profileDevices.length} devices
                        {profileDevices.length > 0 && ` (${onlineCount} online)`}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  {profile.isActive ? (
                    <Badge variant="success">
                      <CheckCircle2 className="h-3 w-3" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="muted">Inactive</Badge>
                  )}
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
