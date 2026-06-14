'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/sign-in/reset-password`,
      });
      if (error) {
        setError('Could not send reset email. Please check the address and try again.');
        return;
      }
      setSent(true);
    });
  }

  if (sent) {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#22C55E]/15">
          <CheckCircle2 className="h-8 w-8 text-[#22C55E]" />
        </div>
        <h1 className="text-2xl font-bold text-[#0F172A] mb-3">Check your email</h1>
        <p className="text-sm text-[#94A3B8] mb-8">
          We sent a password reset link to <span className="text-[#334155]">{email}</span>.
          The link expires in 24 hours.
        </p>
        <Link href="/sign-in">
          <Button variant="secondary" size="lg" className="w-full">Back to sign in</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <Link
        href="/sign-in"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#94A3B8] hover:text-[#64748B] transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to sign in
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0F172A]">Forgot password?</h1>
        <p className="mt-2 text-sm text-[#94A3B8]">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-[#EF4444]/20 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#EF4444]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#334155]" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 rounded-xl border border-[#DBEAFE] bg-white px-4 text-sm text-[#0F172A] placeholder:text-[#64748B] outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] transition-colors"
          />
        </div>

        <Button type="submit" disabled={isPending} className="h-11">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Reset Link'}
        </Button>
      </form>
    </div>
  );
}
