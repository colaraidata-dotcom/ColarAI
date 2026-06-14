'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const PROFILE_TYPES = [
  {
    id: 'child',
    label: 'Child',
    description: 'Most restrictive. Only approved categories are accessible.',
    emoji: '👦',
    color: '#3B82F6',
  },
  {
    id: 'teen',
    label: 'Teen',
    description: 'Balanced control. Limited social media and gaming.',
    emoji: '🧑',
    color: '#8B5CF6',
  },
  {
    id: 'self_control',
    label: 'Self-Control',
    description: 'For adults. Blocks distracting categories.',
    emoji: '💼',
    color: '#22C55E',
  },
  {
    id: 'unrestricted',
    label: 'Unrestricted',
    description: 'No filtering. Monitoring only.',
    emoji: '🌐',
    color: '#0EA5E9',
  },
] as const;

const AVATARS = ['👧', '👦', '🧒', '👶', '🧑', '👱', '👨', '👩', '🧔', '👴', '👵', '🦸'];
const COLORS = ['#3B82F6', '#8B5CF6', '#22C55E', '#0EA5E9', '#F59E0B', '#EF4444', '#EC4899', '#14B8A6'];

export default function NewProfilePage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState('');
  const [type, setType] = useState<typeof PROFILE_TYPES[number]['id']>('child');
  const [avatar, setAvatar] = useState('👧');
  const [color, setColor] = useState('#3B82F6');
  const [error, setError] = useState<string | null>(null);

  function handleSave() {
    if (!name.trim()) { setError('Name is required.'); return; }
    setError(null);
    startTransition(async () => {
      const res = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_name: name.trim(), type, avatar_emoji: avatar, avatar_color: color }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? 'Failed to create profile.');
        return;
      }
      router.push('/profiles');
      router.refresh();
    });
  }

  return (
    <div className="p-8 flex flex-col gap-8 max-w-2xl">
      <div>
        <Link
          href="/profiles"
          className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#0F172A] mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Profiles
        </Link>
        <h1 className="text-2xl font-bold text-[#0F172A]">New Profile</h1>
        <p className="text-[#64748B] text-sm mt-0.5">Create a profile and assign devices to it.</p>
      </div>

      {/* Avatar & Color */}
      <Card className="flex flex-col gap-6">
        <div className="flex items-center gap-6">
          <div
            className="h-20 w-20 rounded-2xl flex items-center justify-center text-4xl shrink-0"
            style={{ background: color + '22', border: `1.5px solid ${color}55` }}
          >
            {avatar}
          </div>
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-xs font-medium text-[#94A3B8] mb-2">Avatar</p>
              <div className="flex flex-wrap gap-2">
                {AVATARS.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setAvatar(em)}
                    className={`h-9 w-9 rounded-lg text-lg transition-all ${
                      avatar === em
                        ? 'ring-2 ring-[#0EA5E9] bg-[#0EA5E9]/15'
                        : 'bg-white border border-[#DBEAFE] hover:border-[#0EA5E9]/40'
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-[#94A3B8] mb-2">Color</p>
              <div className="flex gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className="h-7 w-7 rounded-full transition-all"
                    style={{
                      backgroundColor: c,
                      outline: color === c ? `3px solid white` : 'none',
                      outlineOffset: '2px',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Name */}
      <Card className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[#334155]" htmlFor="name">
          Profile name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={32}
          placeholder="e.g. Emma, Work laptop…"
          className="h-11 rounded-xl border border-[#DBEAFE] bg-[#F5F8FF] px-4 text-sm text-[#0F172A] placeholder:text-[#64748B] outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] transition-colors"
        />
        {error && <p className="text-sm text-[#EF4444]">{error}</p>}
      </Card>

      {/* Profile type */}
      <Card className="flex flex-col gap-3">
        <p className="text-sm font-medium text-[#334155]">Profile type</p>
        <div className="flex flex-col gap-2">
          {PROFILE_TYPES.map((pt) => (
            <button
              key={pt.id}
              type="button"
              onClick={() => setType(pt.id)}
              className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                type === pt.id
                  ? 'border-[#0EA5E9] bg-[#0EA5E9]/8'
                  : 'border-[#DBEAFE] hover:border-[#0EA5E9]/30'
              }`}
            >
              <span className="text-2xl">{pt.emoji}</span>
              <div className="flex-1">
                <p className={`font-medium ${type === pt.id ? 'text-[#0F172A]' : 'text-[#334155]'}`}>
                  {pt.label}
                </p>
                <p className="text-xs text-[#94A3B8] mt-0.5">{pt.description}</p>
              </div>
              {type === pt.id && (
                <div className="h-5 w-5 rounded-full bg-[#0EA5E9] flex items-center justify-center shrink-0">
                  <div className="h-2 w-2 rounded-full bg-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </Card>

      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={isPending} size="lg" className="px-8">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Profile'}
        </Button>
        <Link href="/profiles">
          <Button variant="ghost" size="lg">Cancel</Button>
        </Link>
      </div>
    </div>
  );
}
