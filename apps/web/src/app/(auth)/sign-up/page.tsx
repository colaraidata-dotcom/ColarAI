import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { SignUpForm } from './SignUpForm';

export default async function SignUpPage() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) redirect('/dashboard');
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-[#F1F5F9]">Create your account</h1>
        <p className="mt-2 text-sm text-[#64748B]">First profile is free, forever</p>
      </div>

      <SignUpForm />

      <p className="mt-6 text-center text-sm text-[#64748B]">
        Already have an account?{' '}
        <Link href="/sign-in" className="text-[#0EA5E9] hover:text-[#38BDF8] transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
