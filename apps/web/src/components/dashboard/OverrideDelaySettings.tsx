'use client';

import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';

const DELAY_OPTIONS = [
  { label: 'Instant (no delay)', value: 0 },
  { label: '5 minutes', value: 5 },
  { label: '10 minutes', value: 10 },
  { label: '20 minutes', value: 20 },
  { label: '30 minutes', value: 30 },
];

export function OverrideDelaySettings({
  profileId,
  initialDelay,
}: {
  profileId: string;
  initialDelay: number;
}) {
  const [delay, setDelay] = useState(initialDelay);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function save(newDelay: number) {
    setLoading(true);
    const res = await fetch(`/api/profiles/${profileId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ override_delay_minutes: newDelay }),
    });
    if (res.ok) {
      setDelay(newDelay);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setLoading(false);
  }

  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border border-[#DBEAFE] bg-[#F0F9FF]">
      <ShieldCheck className="h-5 w-5 text-[#0EA5E9] mt-0.5 shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-medium text-[#0F172A]">Self-control Override Delay</p>
        <p className="text-xs text-[#64748B] mt-0.5 mb-3">
          When you try to relax a rule on this profile, the change takes effect after a delay — giving you time to reconsider.
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          {DELAY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => save(opt.value)}
              disabled={loading}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                delay === opt.value
                  ? 'bg-[#0EA5E9] text-white border-[#0EA5E9]'
                  : 'bg-white text-[#334155] border-[#DBEAFE] hover:border-[#0EA5E9]/60'
              } disabled:opacity-50`}
            >
              {opt.label}
            </button>
          ))}
          {saved && <span className="text-xs text-[#22C55E] font-medium">Saved ✓</span>}
        </div>
      </div>
    </div>
  );
}
