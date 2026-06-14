'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [ready, setReady] = useState(false);

  // Supabase sends the token as a URL hash fragment — wait for client hydration
  useEffect(() => { setReady(true); }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setError(null);

    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) { setError(error.message); return; }
      setDone(true);
      setTimeout(() => router.push('/sign-in'), 2500);
    });
  }

  if (done) {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#22C55E]/15">
          <CheckCircle2 className="h-8 w-8 text-[#22C55E]" />
        </div>
        <h1 className="text-2xl font-bold text-[#0F172A] mb-3">Password updated</h1>
        <p className="text-sm text-[#94A3B8]">Redirecting you to sign in…</p>
      </div>
    );
  }

  if (!ready) return null;

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-[#0F172A]">Set new password</h1>
        <p className="mt-2 text-sm text-[#94A3B8]">Choose a strong password for your account.</p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-[#EF4444]/20 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#EF4444]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {[
          { id: 'password', label: 'New password', value: password, onChange: setPassword },
          { id: 'confirm', label: 'Confirm password', value: confirm, onChange: setConfirm },
        ].map((field) => (
          <div key={field.id} className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#334155]" htmlFor={field.id}>
              {field.label}
            </label>
            <div className="relative">
              <input
                id={field.id}
                type={showPw ? 'text' : 'password'}
                required
                minLength={8}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder="••••••••"
                className="h-11 w-full rounded-xl border border-[#DBEAFE] bg-white px-4 pr-11 text-sm text-[#0F172A] placeholder:text-[#64748B] outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] transition-colors"
              />
              {field.id === 'password' && (
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#64748B]"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              )}
            </div>
          </div>
        ))}

        <Button type="submit" disabled={isPending} className="h-11 mt-2">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update Password'}
        </Button>
      </form>
    </div>
  );
}
