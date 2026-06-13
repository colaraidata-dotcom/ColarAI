import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/sections/Footer';
import { Lock, Server, Eye, Trash2, Globe, Shield } from 'lucide-react';

const sections = [
  {
    icon: Lock,
    color: '#0EA5E9',
    title: 'What we collect',
    content: [
      'Account information: email address, hashed password.',
      'Profile configuration: rules, schedules, device assignments.',
      'Domain category decisions: when a domain is blocked or allowed, we log the domain hash (SHA-256), category, action, and timestamp — never the full URL.',
      'Device metadata: platform type, last-seen timestamp. No location data.',
      'Billing information: processed and stored by Stripe. Guardian never sees your card number.',
    ],
  },
  {
    icon: Server,
    color: '#8B5CF6',
    title: 'What we do NOT collect',
    content: [
      'Full URLs or page content — never.',
      'Search queries.',
      'Passwords or message content from apps.',
      'Device location.',
      'Any data beyond the DNS category decision.',
    ],
  },
  {
    icon: Eye,
    color: '#22C55E',
    title: 'Who can see your data',
    content: [
      'Account owner: has full access to profile rules, device list, and decision logs.',
      'Teen profile visibility: you can configure how much detail is shown for teen profiles.',
      'Child profiles: no access to logs or settings.',
      'Guardian staff: no access to your logs without explicit consent and a valid support request.',
    ],
  },
  {
    icon: Trash2,
    color: '#F59E0B',
    title: 'Data retention',
    content: [
      'Access logs: retained for 90 days by default. You can shorten this to 30 days or delete logs immediately from account settings.',
      'Account data: retained until you delete your account.',
      'Deleted account: all associated data (profiles, devices, logs) is permanently deleted within 30 days.',
    ],
  },
  {
    icon: Globe,
    color: '#22D3EE',
    title: 'Data location & GDPR',
    content: [
      'Your data is stored in the EU (Frankfurt, Germany) by default.',
      'We are GDPR compliant. EU residents have the right to access, correct, or delete their data at any time.',
      'To request a full data export or deletion, contact privacy@guardian.io.',
    ],
  },
  {
    icon: Shield,
    color: '#EC4899',
    title: 'Security',
    content: [
      'All data in transit is encrypted with TLS 1.3.',
      'DNS queries use DNS-over-HTTPS (DoH) — encrypted end to end.',
      'Passwords are hashed with bcrypt. We cannot recover your password.',
      'API authentication uses short-lived JWT tokens.',
      'Database access is gated by Row Level Security — each user can only access their own data.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        {/* Header */}
        <section className="py-20 border-b border-[#1A1A2E]">
          <div className="mx-auto max-w-3xl px-6">
            <p className="text-xs font-semibold text-[#0EA5E9] uppercase tracking-widest mb-4">Privacy</p>
            <h1 className="text-5xl font-bold text-[#F1F5F9] mb-4">Privacy Policy</h1>
            <p className="text-[#64748B] text-lg leading-relaxed max-w-2xl">
              Guardian was designed with privacy as a constraint, not an afterthought.
              This document explains exactly what we collect, why, and what we don't.
            </p>
            <p className="text-sm text-[#475569] mt-4">Last updated: June 2026</p>
          </div>
        </section>

        {/* Sections */}
        <section className="py-24">
          <div className="mx-auto max-w-3xl px-6">
            <div className="flex flex-col gap-16">
              {sections.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.title}>
                    <div className="flex items-center gap-3 mb-5">
                      <div
                        className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: s.color + '18' }}
                      >
                        <Icon className="h-4.5 w-4.5" style={{ color: s.color }} />
                      </div>
                      <h2 className="text-xl font-bold text-[#F1F5F9]">{s.title}</h2>
                    </div>
                    <ul className="flex flex-col gap-3">
                      {s.content.map((c, i) => (
                        <li key={i} className="flex gap-3 text-sm text-[#94A3B8] leading-relaxed">
                          <span className="text-[#1A1A2E] font-mono mt-0.5">—</span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            <div className="mt-16 rounded-2xl border border-[#1A1A2E] bg-[#0D0D1A] p-8">
              <h3 className="font-semibold text-[#F1F5F9] mb-2">Contact</h3>
              <p className="text-sm text-[#64748B]">
                Privacy questions, data requests, or GDPR enquiries:{' '}
                <span className="text-[#0EA5E9]">privacy@guardian.io</span>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
