'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, ArrowRight, CheckCircle2, Loader2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { VALUE_PROFILE_PRESETS } from '@guardian/shared/constants';
import Link from 'next/link';

// ─── Step 1: Profile creation ────────────────────────────────────────────────

const PROFILE_TYPES = [
  { id: 'child', label: 'Child', description: 'Strict. Only approved categories.', emoji: '👦', color: '#3B82F6' },
  { id: 'teen', label: 'Teen', description: 'Balanced. Limited social & gaming.', emoji: '🧑', color: '#8B5CF6' },
  { id: 'self_control', label: 'Self-Control', description: 'Block distractions for yourself.', emoji: '💼', color: '#22C55E' },
  { id: 'unrestricted', label: 'Unrestricted', description: 'No filtering. Monitoring only.', emoji: '🌐', color: '#0EA5E9' },
] as const;

function StepProfile({ onDone }: { onDone: (profileId: string) => void }) {
  const [name, setName] = useState('');
  const [type, setType] = useState<typeof PROFILE_TYPES[number]['id']>('child');
  const [presetId, setPresetId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleCreate() {
    if (!name.trim()) { setError('Profile name is required.'); return; }
    setError(null);
    startTransition(async () => {
      const res = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_name: name.trim(), type, avatar_emoji: '👦', avatar_color: '#3B82F6' }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? 'Failed to create profile.');
        return;
      }
      const data = await res.json();

      // Apply the chosen value-profile preset as content criteria. Non-fatal:
      // if it fails the profile still exists with type-based defaults.
      if (presetId) {
        await fetch('/api/content/criteria', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile_id: data.id, preset_id: presetId }),
        }).catch(() => {});
      }

      onDone(data.id);
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-semibold text-[#0EA5E9] uppercase tracking-widest mb-1">Step 1 of 3</p>
        <h2 className="text-2xl font-bold text-[#0F172A]">Create your first profile</h2>
        <p className="text-[#475569] mt-1">A profile holds the rules for one person. You can add more later.</p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[#334155]">Profile name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={32}
          placeholder="e.g. Emma, My Work Mac…"
          className="h-11 rounded-xl border border-[#DBEAFE] bg-white px-4 text-sm text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] transition-colors"
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-[#334155]">Profile type</p>
        <div className="grid grid-cols-2 gap-2">
          {PROFILE_TYPES.map((pt) => (
            <button
              key={pt.id}
              type="button"
              onClick={() => setType(pt.id)}
              className={`flex items-start gap-3 rounded-xl border p-3 text-left transition-all ${
                type === pt.id ? 'border-[#0EA5E9] bg-[#0EA5E9]/8' : 'border-[#DBEAFE] hover:border-[#0EA5E9]/30'
              }`}
            >
              <span className="text-xl mt-0.5">{pt.emoji}</span>
              <div>
                <p className="text-sm font-medium text-[#0F172A]">{pt.label}</p>
                <p className="text-xs text-[#94A3B8] mt-0.5">{pt.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-[#334155]">
          Content values <span className="text-[#94A3B8] font-normal">(optional)</span>
        </p>
        <p className="text-xs text-[#94A3B8] -mt-1">
          Pick a values preset for movies & shows. You can fine-tune it later.
        </p>
        <div className="grid grid-cols-1 gap-2 mt-1">
          {VALUE_PROFILE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => setPresetId(presetId === preset.id ? null : preset.id)}
              className={`flex flex-col items-start gap-0.5 rounded-xl border p-3 text-left transition-all ${
                presetId === preset.id ? 'border-[#0EA5E9] bg-[#0EA5E9]/8' : 'border-[#DBEAFE] hover:border-[#0EA5E9]/30'
              }`}
            >
              <p className="text-sm font-medium text-[#0F172A]">{preset.label}</p>
              <p className="text-xs text-[#94A3B8]">{preset.description}</p>
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-[#B91C1C]">{error}</p>}

      <Button onClick={handleCreate} disabled={isPending} size="lg" className="w-full">
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Continue <ArrowRight className="h-4 w-4" /></>}
      </Button>
    </div>
  );
}

// ─── Step 2: Connect device ───────────────────────────────────────────────────

const PLATFORMS = [
  { id: 'ios', label: 'iPhone / iPad', icon: '📱', steps: [
    'Open Settings → tap your Wi-Fi network name',
    'Scroll down to "Configure DNS" → Manual',
    'Delete existing entries, tap "Add Server"',
    'Paste the DNS address below → Save',
  ]},
  { id: 'android', label: 'Android', icon: '🤖', steps: [
    'Open Settings → Network & Internet → Private DNS',
    'Select "Private DNS provider hostname"',
    'Enter the hostname below → Save',
  ]},
  { id: 'macos', label: 'Mac', icon: '🍎', steps: [
    'System Settings → Network → Wi-Fi → Details',
    'Click the DNS tab → click +',
    'Paste the DNS address below → OK → Apply',
  ]},
  { id: 'windows', label: 'Windows', icon: '🪟', steps: [
    'Settings → Network & Internet → Wi-Fi → Hardware properties',
    'Edit DNS → Manual → IPv4 on',
    'Paste the DNS address below → Save',
  ]},
] as const;

function StepDevice({ profileId, onDone }: { profileId: string; onDone: () => void }) {
  const [deviceName, setDeviceName] = useState('');
  const [platform, setPlatform] = useState<typeof PLATFORMS[number]['id']>('ios');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [registered, setRegistered] = useState<{ dnsUrl: string; token: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const currentPlatform = PLATFORMS.find((p) => p.id === platform)!;

  function handleRegister() {
    if (!deviceName.trim()) { setError('Device name is required.'); return; }
    setError(null);
    startTransition(async () => {
      const res = await fetch('/api/device/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_name: deviceName.trim(), platform, profile_id: profileId }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? 'Failed to register device.');
        return;
      }
      const data = await res.json();
      setRegistered({ dnsUrl: data.dns_server, token: data.device_token });
    });
  }

  async function copyDns() {
    if (!registered) return;
    await navigator.clipboard.writeText(registered.dnsUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (registered) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-xs font-semibold text-[#0EA5E9] uppercase tracking-widest mb-1">Step 2 of 3</p>
          <h2 className="text-2xl font-bold text-[#0F172A]">Configure DNS on your device</h2>
          <p className="text-[#475569] mt-1">Copy this address and follow the steps below.</p>
        </div>

        {/* DNS address */}
        <div className="rounded-xl border border-[#DBEAFE] bg-[#EEF3FF] p-4">
          <p className="text-xs font-medium text-[#475569] mb-2">Your Guardian DNS address</p>
          <div className="flex items-center gap-3">
            <code className="flex-1 text-sm font-mono text-[#0369A1] break-all">{registered.dnsUrl}</code>
            <button
              onClick={copyDns}
              className="shrink-0 h-8 w-8 rounded-lg border border-[#DBEAFE] bg-white flex items-center justify-center hover:border-[#0EA5E9] transition-colors"
            >
              {copied ? <Check className="h-4 w-4 text-[#15803D]" /> : <Copy className="h-4 w-4 text-[#475569]" />}
            </button>
          </div>
        </div>

        {/* Platform steps */}
        <div className="flex gap-2 flex-wrap">
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPlatform(p.id)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                platform === p.id ? 'border-[#0EA5E9] bg-[#0EA5E9]/10 text-[#0369A1]' : 'border-[#DBEAFE] text-[#475569] hover:border-[#0EA5E9]/40'
              }`}
            >
              {p.icon} {p.label}
            </button>
          ))}
        </div>

        <ol className="flex flex-col gap-3">
          {currentPlatform.steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <div className="h-6 w-6 rounded-full bg-[#0EA5E9]/10 border border-[#0EA5E9]/20 flex items-center justify-center text-[10px] font-bold text-[#0EA5E9] shrink-0 mt-0.5">
                {i + 1}
              </div>
              <p className="text-sm text-[#475569] leading-relaxed">{step}</p>
            </li>
          ))}
        </ol>

        <Button onClick={onDone} size="lg" className="w-full">
          Done, continue <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-semibold text-[#0EA5E9] uppercase tracking-widest mb-1">Step 2 of 3</p>
        <h2 className="text-2xl font-bold text-[#0F172A]">Connect your first device</h2>
        <p className="text-[#475569] mt-1">We'll give you a DNS address unique to this device.</p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[#334155]">Device name</label>
        <input
          type="text"
          value={deviceName}
          onChange={(e) => setDeviceName(e.target.value)}
          maxLength={64}
          placeholder="e.g. Emma's iPhone, My MacBook…"
          className="h-11 rounded-xl border border-[#DBEAFE] bg-white px-4 text-sm text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] transition-colors"
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-[#334155]">Device type</p>
        <div className="grid grid-cols-2 gap-2">
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlatform(p.id)}
              className={`flex items-center gap-2 rounded-xl border p-3 text-sm transition-all ${
                platform === p.id ? 'border-[#0EA5E9] bg-[#0EA5E9]/8 text-[#0F172A] font-medium' : 'border-[#DBEAFE] text-[#475569] hover:border-[#0EA5E9]/30'
              }`}
            >
              <span>{p.icon}</span> {p.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-[#B91C1C]">{error}</p>}

      <Button onClick={handleRegister} disabled={isPending} size="lg" className="w-full">
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Get DNS address <ArrowRight className="h-4 w-4" /></>}
      </Button>

      <button onClick={onDone} className="text-sm text-[#94A3B8] hover:text-[#475569] transition-colors text-center">
        Skip for now
      </button>
    </div>
  );
}

// ─── Step 3: Done ─────────────────────────────────────────────────────────────

function StepDone() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="h-16 w-16 rounded-2xl bg-[#22C55E]/10 flex items-center justify-center">
        <CheckCircle2 className="h-8 w-8 text-[#22C55E]" />
      </div>
      <div>
        <p className="text-xs font-semibold text-[#0EA5E9] uppercase tracking-widest mb-1">Step 3 of 3</p>
        <h2 className="text-2xl font-bold text-[#0F172A]">Guardian is ready</h2>
        <p className="text-[#475569] mt-2 max-w-sm mx-auto">
          Your profile is set up. Once you configure DNS on your device, filtering starts immediately.
        </p>
      </div>

      <div className="w-full flex flex-col gap-3">
        {[
          { icon: '✅', text: 'Profile created with default rules' },
          { icon: '🔒', text: 'DNS filtering active on connected devices' },
          { icon: '📊', text: 'Usage reports available in your dashboard' },
        ].map((item) => (
          <div key={item.text} className="flex items-center gap-3 rounded-xl border border-[#DBEAFE] bg-[#F5F8FF] px-4 py-3 text-sm text-[#334155]">
            <span>{item.icon}</span> {item.text}
          </div>
        ))}
      </div>

      <Button onClick={() => router.push('/dashboard')} size="lg" className="w-full mt-2">
        Go to Dashboard <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

// ─── Main onboarding page ─────────────────────────────────────────────────────

export default function OnboardingPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [profileId, setProfileId] = useState<string>('');

  return (
    <div className="min-h-screen bg-[#F5F8FF] flex flex-col">
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-[#0EA5E9] flex items-center justify-center">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-[#0F172A]">Guardian</span>
        </div>
        <Link href="/dashboard" className="text-sm text-[#94A3B8] hover:text-[#475569] transition-colors">
          Skip setup
        </Link>
      </header>

      {/* Progress bar */}
      <div className="px-6">
        <div className="h-1.5 bg-[#DBEAFE] rounded-full max-w-md mx-auto">
          <div
            className="h-full bg-[#0EA5E9] rounded-full transition-all duration-500"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 flex items-start justify-center px-6 py-10">
        <div className="w-full max-w-md">
          {step === 1 && (
            <StepProfile onDone={(id) => { setProfileId(id); setStep(2); }} />
          )}
          {step === 2 && (
            <StepDevice profileId={profileId} onDone={() => setStep(3)} />
          )}
          {step === 3 && <StepDone />}
        </div>
      </main>
    </div>
  );
}
