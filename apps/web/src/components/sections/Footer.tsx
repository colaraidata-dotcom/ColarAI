import Link from 'next/link';
import { Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[#1A1A2E] py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2 font-semibold text-[#F1F5F9]">
              <div className="h-7 w-7 rounded-lg bg-[#0EA5E9] flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              Guardian
            </Link>
            <p className="text-sm text-[#64748B] max-w-xs">
              Profile-based internet control platform. Built for family safety and personal focus.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
            <div className="flex flex-col gap-3">
              <p className="font-medium text-[#F1F5F9]">Product</p>
              <Link href="/how-it-works" className="text-[#64748B] hover:text-[#CBD5E1]">How It Works</Link>
              <Link href="/#features" className="text-[#64748B] hover:text-[#CBD5E1]">Features</Link>
              <Link href="/pricing" className="text-[#64748B] hover:text-[#CBD5E1]">Pricing</Link>
            </div>
            <div className="flex flex-col gap-3">
              <p className="font-medium text-[#F1F5F9]">Privacy</p>
              <Link href="/privacy" className="text-[#64748B] hover:text-[#CBD5E1]">Privacy Policy</Link>
              <Link href="/privacy" className="text-[#64748B] hover:text-[#CBD5E1]">Data Retention</Link>
              <Link href="/privacy" className="text-[#64748B] hover:text-[#CBD5E1]">GDPR</Link>
            </div>
            <div className="flex flex-col gap-3">
              <p className="font-medium text-[#F1F5F9]">Apps</p>
              <span className="text-[#64748B]">iOS — Coming Soon</span>
              <span className="text-[#64748B]">Android — Coming Soon</span>
              <Link href="/dashboard" className="text-[#64748B] hover:text-[#CBD5E1]">Web Dashboard</Link>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-[#1A1A2E] pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <p>© 2026 Guardian. All rights reserved.</p>
          <p>Guardian v0.1 — MVP Preview</p>
        </div>
      </div>
    </footer>
  );
}
