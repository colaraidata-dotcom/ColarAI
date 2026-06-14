'use client';

import { useState } from 'react';
import { PauseCircle, PlayCircle, Timer } from 'lucide-react';

interface Props {
  profileId: string;
  initialIsPaused: boolean;
  initialPauseUntil?: string | null;
}

const PAUSE_OPTIONS = [
  { label: '30 min', minutes: 30 },
  { label: '1 hour', minutes: 60 },
  { label: '2 hours', minutes: 120 },
  { label: 'Until I resume', minutes: undefined },
];

export function PauseButton({ profileId, initialIsPaused, initialPauseUntil }: Props) {
  const [isPaused, setIsPaused] = useState(initialIsPaused);
  const [pauseUntil, setPauseUntil] = useState<string | null>(initialPauseUntil ?? null);
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Auto-expire pause_until
  const effectivelyPaused = isPaused && (!pauseUntil || new Date(pauseUntil) > new Date());

  async function pause(minutes?: number) {
    setLoading(true);
    setShowMenu(false);
    const res = await fetch(`/api/profiles/${profileId}/pause`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pause_minutes: minutes }),
    });
    if (res.ok) {
      const data = await res.json();
      setIsPaused(data.is_paused);
      setPauseUntil(data.pause_until);
    }
    setLoading(false);
  }

  async function unpause() {
    setLoading(true);
    const res = await fetch(`/api/profiles/${profileId}/pause`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pause_minutes: 0 }),
    });
    if (res.ok) {
      setIsPaused(false);
      setPauseUntil(null);
    }
    setLoading(false);
  }

  if (effectivelyPaused) {
    return (
      <div className="flex items-center gap-2">
        {pauseUntil && (
          <span className="flex items-center gap-1 text-xs text-[#F59E0B]">
            <Timer className="h-3 w-3" />
            Until {new Date(pauseUntil).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
        <button
          onClick={unpause}
          disabled={loading}
          className="flex items-center gap-1.5 text-sm font-medium text-[#22C55E] hover:text-[#16A34A] transition-colors disabled:opacity-50"
        >
          <PlayCircle className="h-4 w-4" />
          Resume
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu((v) => !v)}
        disabled={loading}
        className="flex items-center gap-1.5 text-sm font-medium text-[#F59E0B] hover:text-[#D97706] transition-colors disabled:opacity-50"
      >
        <PauseCircle className="h-4 w-4" />
        Pause Internet
      </button>
      {showMenu && (
        <div className="absolute right-0 top-7 z-10 bg-white border border-[#DBEAFE] rounded-xl shadow-lg p-1 min-w-[160px]">
          {PAUSE_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              onClick={() => pause(opt.minutes)}
              className="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-[#F0F9FF] text-[#0F172A] transition-colors"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
