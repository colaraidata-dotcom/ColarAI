import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { SignInForm } from './SignInForm';

const ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: 'Invalid email or password.',
  auth_callback_failed: 'Authentication failed. Please try again.',
  session_expired: 'Your session has expired. Please sign in again.',
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) redirect('/dashboard');
  }

  const { next, error } = await searchParams;
  const errorMessage = error ? (ERROR_MESSAGES[error] ?? 'An error occurred. Please try again.') : null;

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-[#F1F5F9]">Welcome back</h1>
        <p className="mt-2 text-sm text-[#64748B]">Sign in to your Guardian account</p>
      </div>

      {errorMessage && (
        <div className="mb-4 rounded-xl border border-[#EF4444]/20 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#EF4444]">
          {errorMessage}
        </div>
      )}

      <SignInForm next={next} />

      <div className="mt-4 text-center">
        <Link href="/sign-in/forgot-password" className="text-sm text-[#64748B] hover:text-[#94A3B8] transition-colors">
          Forgot your password?
        </Link>
      </div>

      <p className="mt-4 text-center text-sm text-[#64748B]">
        No account?{' '}
        <Link href="/sign-up" className="text-[#0EA5E9] hover:text-[#38BDF8] transition-colors">
          Sign up free
        </Link>
      </p>
    </div>
  );
}
