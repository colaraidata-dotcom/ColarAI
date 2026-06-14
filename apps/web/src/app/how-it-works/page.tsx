import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/sections/Footer';
import { CTASection } from '@/components/sections/CTASection';
import { Shield, ArrowRight, Wifi, Server, Cpu, CheckCircle2, XCircle, Clock } from 'lucide-react';

const steps = [
  {
    num: '01',
    color: '#0EA5E9',
    title: 'Guardian app installed on device',
    description:
      'The Guardian app is installed on the device (iOS, Android, macOS, or Windows). It configures the device\'s DNS settings to route all queries through Guardian\'s resolver.',
    detail: 'No root access or complex setup required. On iOS and Android, this is done via the Network Extension or VPN Service API.',
  },
  {
    num: '02',
    color: '#8B5CF6',
    title: 'Device sends a DNS query',
    description:
      'When any app or browser tries to load content, it first needs to resolve the domain name to an IP address via DNS. This query goes to Guardian.',
    detail: 'Guardian uses DNS-over-HTTPS (DoH), meaning all DNS traffic is encrypted. No ISP or network can see what domains are being queried.',
  },
  {
    num: '03',
    color: '#22D3EE',
    title: 'Domain is categorized',
    description:
      'Guardian\'s resolver looks up the domain against a database of 10 content categories. Unknown domains are classified in real time using AI pattern matching.',
    detail: 'Categories: Social Media, Adult Content, Gaming, Gambling, Education, News, Shopping, Streaming, Productivity, and More.',
  },
  {
    num: '04',
    color: '#F59E0B',
    title: 'Profile rules are checked',
    description:
      "The device is matched to a profile (Emma's iPad → Child profile). That profile's rules, time schedules, and site overrides are applied.",
    detail: 'Rules are cached locally for 60 seconds. Changes you make in the dashboard propagate to devices within 1 minute.',
  },
  {
    num: '05',
    color: '#22C55E',
    title: 'Access granted or blocked',
    description:
      'Allowed: Guardian returns the real IP address. The content loads normally. Blocked: Guardian returns NXDOMAIN. The site never loads.',
    detail: 'The entire process takes under 5ms. There is no noticeable slowdown compared to using a standard DNS resolver.',
  },
  {
    num: '06',
    color: '#EC4899',
    title: 'Decision logged to dashboard',
    description:
      'Every decision (allowed or blocked) is logged with a domain hash and category. The parent dashboard shows this in real time.',
    detail: 'Full URLs are never stored — only the domain and category. Logs are retained for 90 days by default.',
  },
];

const categories = [
  { name: 'Social Media', examples: 'Instagram, TikTok, Twitter, Snapchat' },
  { name: 'Adult Content', examples: 'Age-restricted sites' },
  { name: 'Gaming', examples: 'Steam, Roblox, Epic Games, Battle.net' },
  { name: 'Gambling', examples: 'Online casinos, sports betting' },
  { name: 'Education', examples: 'Khan Academy, Coursera, Duolingo' },
  { name: 'Streaming', examples: 'Netflix, YouTube, Twitch, Spotify' },
  { name: 'News', examples: 'BBC, CNN, Reuters, news sites' },
  { name: 'Shopping', examples: 'Amazon, eBay, Etsy' },
  { name: 'Productivity', examples: 'Google Workspace, Notion, Figma' },
  { name: 'Messaging', examples: 'WhatsApp Web, Telegram, Discord' },
];

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        {/* Hero */}
        <section className="py-20 border-b border-[#DBEAFE]">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <p className="text-xs font-semibold text-[#0EA5E9] uppercase tracking-widest mb-4">How It Works</p>
            <h1 className="text-5xl lg:text-6xl font-bold text-[#0F172A] leading-tight mb-6">
              DNS filtering,<br />explained simply
            </h1>
            <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto leading-relaxed">
              Guardian intercepts DNS queries — the first step every app takes before loading content.
              By controlling this step, we filter the internet before anything is ever sent or received.
            </p>
          </div>
        </section>

        {/* Steps */}
        <section className="py-24">
          <div className="mx-auto max-w-5xl px-6">
            <div className="flex flex-col gap-0">
              {steps.map((s, i) => (
                <div
                  key={s.num}
                  className={`grid grid-cols-[80px_1fr] gap-8 py-10 ${i < steps.length - 1 ? 'border-b border-[#DBEAFE]' : ''}`}
                >
                  <div
                    className="h-12 w-12 rounded-xl flex items-center justify-center text-sm font-bold"
                    style={{ background: s.color + '18', color: s.color }}
                  >
                    {s.num}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0F172A] mb-2">{s.title}</h3>
                    <p className="text-[#64748B] leading-relaxed mb-3">{s.description}</p>
                    <p className="text-sm text-[#64748B] border-l-2 pl-4" style={{ borderColor: s.color + '60' }}>
                      {s.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-24 border-t border-[#DBEAFE] bg-[#EEF3FF]">
          <div className="mx-auto max-w-5xl px-6">
            <div className="mb-12">
              <p className="text-xs font-semibold text-[#0EA5E9] uppercase tracking-widest mb-3">Content Categories</p>
              <h2 className="text-3xl font-bold text-[#0F172A]">10 categories, fully configurable</h2>
              <p className="text-[#94A3B8] mt-3 max-w-xl">Each category can be set to Allow, Block, or Limit (with daily time caps) per profile.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {categories.map((c) => (
                <div key={c.name} className="rounded-xl border border-[#DBEAFE] bg-white p-4">
                  <p className="font-medium text-[#334155] text-sm mb-1">{c.name}</p>
                  <p className="text-xs text-[#64748B] leading-relaxed">{c.examples}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Rule actions */}
        <section className="py-24 border-t border-[#DBEAFE]">
          <div className="mx-auto max-w-5xl px-6">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-[#0F172A] mb-3">Three rule actions</h2>
              <p className="text-[#94A3B8]">For each category, each profile can have one of three rules.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: CheckCircle2,
                  color: '#22C55E',
                  label: 'Allow',
                  description: 'Content loads normally. No restriction. DNS returns the real IP address.',
                },
                {
                  icon: XCircle,
                  color: '#EF4444',
                  label: 'Block',
                  description: 'Content never loads. DNS returns NXDOMAIN. No data is sent to the blocked server.',
                },
                {
                  icon: Clock,
                  color: '#F59E0B',
                  label: 'Limit',
                  description: 'Content is allowed up to a daily time cap (e.g. 60 min/day). After the cap, it\'s blocked.',
                },
              ].map((a) => (
                <div key={a.label} className="rounded-2xl border border-[#DBEAFE] bg-[#EEF3FF] p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <a.icon className="h-5 w-5" style={{ color: a.color }} />
                    <span className="font-semibold text-[#0F172A]">{a.label}</span>
                  </div>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">{a.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  );
}
