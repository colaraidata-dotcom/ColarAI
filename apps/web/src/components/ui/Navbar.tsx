import Link from 'next/link';
import { Shield } from 'lucide-react';
import { Button } from './Button';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#DBEAFE]/80 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-semibold text-[#0F172A]">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0EA5E9]">
            <Shield className="h-4 w-4 text-white" />
          </div>
          Guardian
        </Link>

        <div className="hidden md:flex items-center gap-7 text-sm text-[#475569]">
          <Link href="/how-it-works" className="hover:text-[#0F172A] transition-colors">How It Works</Link>
          <Link href="/#features" className="hover:text-[#0F172A] transition-colors">Features</Link>
          <Link href="/pricing" className="hover:text-[#0F172A] transition-colors">Pricing</Link>
          <Link href="/privacy" className="hover:text-[#0F172A] transition-colors">Privacy</Link>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/sign-in">
            <button className="px-4 py-2 text-sm text-[#475569] hover:text-[#0F172A] transition-colors">
              Sign In
            </button>
          </Link>
          <Link href="/sign-up">
            <Button size="sm">Get Started Free</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
