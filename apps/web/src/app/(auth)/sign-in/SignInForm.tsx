'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export function SignInForm({ next }: { next?: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    setError(null);
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError('Invalid email or password.');
        return;
      }
      const dest = next && next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard';
      router.push(dest);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#CBD5E1]" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="h-11 rounded-xl border border-[#1A1A2E] bg-[#111120] px-4 text-sm text-[#F1F5F9] placeholder:text-[#475569] outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#CBD5E1]" htmlFor="password">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="h-11 w-full rounded-xl border border-[#1A1A2E] bg-[#111120] px-4 pr-11 text-sm text-[#F1F5F9] placeholder:text-[#475569] outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#94A3B8] transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-[#EF4444]">{error}</p>
      )}

      <Button type="submit" disabled={isPending} className="h-11 mt-2">
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
      </Button>
    </form>
  );
}
