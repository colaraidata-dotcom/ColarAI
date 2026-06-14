'use client';

import { useState } from 'react';
import { XCircle, CheckCircle2, Bell, Clock, Shield, Smartphone, Monitor, Apple, Settings } from 'lucide-react';

// ─── Inline mockups ──────────────────────────────────────────────────────────

function ProfileSetupMockup() {
  return (
    <div className="rounded-xl bg-white border border-[#DBEAFE] overflow-hidden text-xs">
      <div className="px-4 py-3 border-b border-[#DBEAFE] flex items-center gap-2">
        <div className="h-5 w-5 rounded bg-[#3B82F6] flex items-center justify-center text-[10px] font-bold text-white">E</div>
        <span className="font-semibold text-[#0F172A]">Emma</span>
        <span className="ml-auto text-[10px] text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 px-2 py-0.5 rounded-full">Child · 9 years</span>
      </div>
      <div className="p-4 flex flex-col gap-2.5">
        {[
          { cat: 'Social Media', rule: 'block', color: '#EF4444' },
          { cat: 'Gaming', rule: 'limit · 1h/day', color: '#F59E0B' },
          { cat: 'Education', rule: 'always allowed', color: '#22C55E' },
          { cat: 'Adult Content', rule: 'block', color: '#EF4444' },
          { cat: 'Streaming', rule: 'limit · 1h/day', color: '#F59E0B' },
        ].map((r) => (
          <div key={r.cat} className="flex items-center justify-between">
            <span className="text-[#64748B]">{r.cat}</span>
            <span className="font-medium" style={{ color: r.color }}>{r.rule}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeviceConnectedMockup() {
  return (
    <div className="rounded-xl bg-white border border-[#DBEAFE] overflow-hidden text-xs">
      <div className="px-4 py-3 border-b border-[#DBEAFE]">
        <span className="text-[#94A3B8]">Emma's devices</span>
      </div>
      <div className="p-4 flex flex-col gap-3">
        {[
          { name: "Emma's iPhone 15", status: 'Active', icon: '📱', profile: 'Child profile' },
          { name: "Emma's iPad", status: 'Active', icon: '📟', profile: 'Child profile' },
          { name: "School Laptop", status: 'Inactive', icon: '💻', profile: 'Child profile' },
        ].map((d) => (
          <div key={d.name} className="flex items-center gap-3 rounded-lg bg-[#EEF3FF] border border-[#DBEAFE] px-3 py-2.5">
            <span className="text-base shrink-0">{d.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-[#334155] font-medium truncate">{d.name}</p>
              <p className="text-[#64748B] text-[10px]">{d.profile}</p>
            </div>
            <span
              className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                d.status === 'Active'
                  ? 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20'
                  : 'text-[#94A3B8] bg-[#EEF3FF] border-[#DBEAFE]'
              }`}
            >
              {d.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BlockedSiteMockup() {
  return (
    <div className="rounded-xl bg-white border border-[#DBEAFE] overflow-hidden text-xs">
      {/* Simulated browser bar */}
      <div className="px-4 py-2 border-b border-[#DBEAFE] bg-[#EEF3FF] flex items-center gap-2">
        <div className="flex gap-1">
          <div className="h-2 w-2 rounded-full bg-[#EF4444]/70" />
          <div className="h-2 w-2 rounded-full bg-[#F59E0B]/70" />
          <div className="h-2 w-2 rounded-full bg-[#22C55E]/70" />
        </div>
        <div className="flex-1 rounded bg-white px-3 py-1 text-[#EF4444]/80 font-mono text-[10px] text-center">
          tiktok.com
        </div>
      </div>
      {/* Blocked page */}
      <div className="flex flex-col items-center justify-center py-8 px-4 gap-3">
        <div className="h-10 w-10 rounded-full bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center">
          <XCircle className="h-5 w-5 text-[#EF4444]" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-[#0F172A] mb-1">Site blocked</p>
          <p className="text-[#94A3B8] text-[10px]">Social Media · Child profile</p>
        </div>
        <button className="mt-1 text-[10px] font-medium text-[#0EA5E9] border border-[#0EA5E9]/30 bg-[#0EA5E9]/8 rounded-lg px-3 py-1.5">
          Request access from parent →
        </button>
      </div>
    </div>
  );
}

function NotificationMockup() {
  return (
    <div className="rounded-xl bg-white border border-[#DBEAFE] overflow-hidden text-xs">
      <div className="px-4 py-3 border-b border-[#DBEAFE] flex items-center gap-2">
        <Bell className="h-4 w-4 text-[#F59E0B]" />
        <span className="font-semibold text-[#0F172A]">Access request</span>
        <span className="ml-auto text-[#64748B] text-[10px]">Just now</span>
      </div>
      <div className="p-4">
        <p className="text-[#64748B] mb-4">
          <span className="text-[#0F172A] font-medium">Emma</span> wants to access{' '}
          <span className="text-[#F59E0B] font-medium">tiktok.com</span>
          <br />
          <span className="text-[#64748B] text-[10px]">Social Media · blocked by Child profile</span>
        </p>
        <div className="flex gap-2">
          <button className="flex-1 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/25 text-[#22C55E] font-semibold py-2 text-[11px]">
            ✓ Allow once
          </button>
          <button className="flex-1 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/25 text-[#EF4444] font-semibold py-2 text-[11px]">
            ✗ Deny
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Scenario steps ──────────────────────────────────────────────────────────

const steps = [
  {
    num: '01',
    color: '#0EA5E9',
    title: "You create Emma's profile",
    description:
      "You name the profile, pick her age group (Child, 5–12), and Guardian fills in sensible defaults. You can adjust every rule: block social media, limit gaming to 1 hour a day, always allow homework sites.",
    mockup: <ProfileSetupMockup />,
  },
  {
    num: '02',
    color: '#8B5CF6',
    title: "You connect her iPhone and iPad",
    description:
      "Inside the dashboard, you get a Guardian DNS address unique to Emma's profile. You enter it in her phone's Wi-Fi settings — one field, 10 seconds. From that moment, every site she visits goes through Guardian first.",
    mockup: <DeviceConnectedMockup />,
  },
  {
    num: '03',
    color: '#EF4444',
    title: "Emma opens TikTok — blocked instantly",
    description:
      "Before TikTok loads even one pixel, Guardian intercepts the request, sees 'Social Media → blocked', and returns nothing. Emma sees a 'Site blocked' page. She can optionally tap 'Request access from parent'.",
    mockup: <BlockedSiteMockup />,
  },
  {
    num: '04',
    color: '#22C55E',
    title: "You decide — from your phone",
    description:
      "You get a push notification with the site name and category. You can approve a one-time exception, deny it, or ignore it. Emma sees the result on her screen in seconds. You never had to be in the same room.",
    mockup: <NotificationMockup />,
  },
];

// ─── Device setup tabs ───────────────────────────────────────────────────────

const deviceGuides = [
  {
    id: 'iphone',
    label: 'iPhone / iPad',
    icon: '📱',
    steps: [
      'Open Settings → tap your Wi-Fi network name',
      'Scroll down to "Configure DNS" → tap it → choose Manual',
      'Delete any existing DNS servers',
      'Tap "Add Server" → paste the Guardian DNS address from your dashboard',
      'Tap Save — done. Emma\'s phone is now under Guardian.',
    ],
    note: 'Works on all iOS versions. Covers Safari, Chrome, every app — not just the browser.',
  },
  {
    id: 'android',
    label: 'Android',
    icon: '🤖',
    steps: [
      'Open Settings → Network & Internet → Private DNS',
      'Select "Private DNS provider hostname"',
      'Enter the Guardian DNS hostname from your dashboard',
      'Tap Save — Guardian is now active on this device.',
    ],
    note: 'Private DNS (DNS-over-TLS) is built into Android 9+. No app installation needed.',
  },
  {
    id: 'mac',
    label: 'Mac',
    icon: '🍎',
    steps: [
      'Open System Settings → Network → select your Wi-Fi → Details',
      'Click the "DNS" tab',
      'Click the + button and add the Guardian DNS address from your dashboard',
      'Click OK → Apply — done.',
    ],
    note: 'Covers all browsers and apps on this Mac. Works on macOS Ventura and later.',
  },
  {
    id: 'windows',
    label: 'Windows',
    icon: '🪟',
    steps: [
      'Open Settings → Network & Internet → Wi-Fi → Hardware properties',
      'Click "Edit" next to DNS server assignment',
      'Select "Manual" → turn on IPv4',
      'Enter the Guardian DNS address from your dashboard under "Preferred DNS"',
      'Click Save.',
    ],
    note: 'Covers all browsers (Chrome, Edge, Firefox) and apps system-wide.',
  },
  {
    id: 'router',
    label: 'Router',
    icon: '📡',
    steps: [
      'Log into your router admin panel (usually 192.168.1.1)',
      'Go to DNS settings (often under WAN or Internet settings)',
      'Replace the existing DNS server address with Guardian\'s DNS from your dashboard',
      'Save and restart the router.',
    ],
    note: 'This protects every device on your home network at once — phones, tablets, game consoles, smart TVs — without changing anything on each device individually.',
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export function ParentControlSection() {
  const [activeDevice, setActiveDevice] = useState('iphone');
  const [activeStep, setActiveStep] = useState(0);

  const currentDevice = deviceGuides.find((d) => d.id === activeDevice)!;
  const currentStep = steps[activeStep];

  return (
    <section className="py-24 border-t border-[#DBEAFE]">
      <div className="mx-auto max-w-7xl px-6">

        {/* Header */}
        <div className="mb-16">
          <p className="text-xs font-semibold text-[#0EA5E9] uppercase tracking-widest mb-3">For parents</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#0F172A] leading-tight max-w-2xl">
            How you actually control<br />what your child sees online
          </h2>
          <p className="text-[#94A3B8] mt-4 max-w-xl leading-relaxed">
            No complicated software. No agent installed on their phone. Just one DNS setting —
            and you control everything from a single dashboard.
          </p>
        </div>

        {/* ── Scenario walkthrough ── */}
        <div className="mb-20">
          <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-widest mb-6">
            Real example: Emma, age 9
          </p>

          {/* Step selector */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {steps.map((s, i) => (
              <button
                key={s.num}
                onClick={() => setActiveStep(i)}
                className={`text-left rounded-xl border p-4 transition-all ${
                  activeStep === i
                    ? 'border-[#0EA5E9]/40 bg-[#0EA5E9]/8'
                    : 'border-[#DBEAFE] bg-[#EEF3FF] hover:border-[#93C5FD]'
                }`}
              >
                <p
                  className="text-[10px] font-bold uppercase tracking-widest mb-1"
                  style={{ color: activeStep === i ? s.color : '#475569' }}
                >
                  Step {s.num}
                </p>
                <p className="text-xs font-medium text-[#334155] leading-snug">{s.title}</p>
              </button>
            ))}
          </div>

          {/* Active step detail */}
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <div
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4 text-[11px] font-semibold uppercase tracking-wider border"
                style={{
                  color: currentStep.color,
                  background: currentStep.color + '12',
                  borderColor: currentStep.color + '30',
                }}
              >
                Step {currentStep.num}
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-3">{currentStep.title}</h3>
              <p className="text-[#94A3B8] leading-relaxed">{currentStep.description}</p>

              {/* Next step hint */}
              {activeStep < steps.length - 1 && (
                <button
                  onClick={() => setActiveStep(activeStep + 1)}
                  className="mt-6 flex items-center gap-2 text-sm text-[#0EA5E9] hover:text-[#38BDF8] transition-colors"
                >
                  Next: {steps[activeStep + 1].title}
                  <span>→</span>
                </button>
              )}
            </div>
            <div>{currentStep.mockup}</div>
          </div>
        </div>

        {/* ── Device connection guide ── */}
        <div className="rounded-2xl border border-[#DBEAFE] bg-[#EEF3FF] overflow-hidden">
          <div className="px-6 py-5 border-b border-[#DBEAFE]">
            <h3 className="font-bold text-[#0F172A] text-lg mb-1">How to connect a device</h3>
            <p className="text-sm text-[#94A3B8]">
              Pick the device type. You'll copy the Guardian DNS address from your dashboard and paste it in one setting.
            </p>
          </div>

          {/* Device tabs */}
          <div className="flex overflow-x-auto border-b border-[#DBEAFE]">
            {deviceGuides.map((d) => (
              <button
                key={d.id}
                onClick={() => setActiveDevice(d.id)}
                className={`flex items-center gap-2 px-5 py-3.5 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
                  activeDevice === d.id
                    ? 'text-[#0EA5E9] border-[#0EA5E9] bg-[#0EA5E9]/5'
                    : 'text-[#64748B] border-transparent hover:text-[#64748B]'
                }`}
              >
                <span>{d.icon}</span>
                {d.label}
              </button>
            ))}
          </div>

          {/* Guide content */}
          <div className="p-6 grid md:grid-cols-2 gap-8">
            <div>
              <ol className="flex flex-col gap-4">
                {currentDevice.steps.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <div
                      className="h-6 w-6 rounded-full bg-[#0EA5E9]/10 border border-[#0EA5E9]/20 flex items-center justify-center text-[10px] font-bold text-[#0EA5E9] shrink-0 mt-0.5"
                    >
                      {i + 1}
                    </div>
                    <p className="text-sm text-[#64748B] leading-relaxed">{step}</p>
                  </li>
                ))}
              </ol>
              <div className="mt-5 rounded-lg border border-[#DBEAFE] bg-white px-4 py-3 flex gap-3">
                <Shield className="h-4 w-4 text-[#0EA5E9] shrink-0 mt-0.5" />
                <p className="text-xs text-[#94A3B8] leading-relaxed">{currentDevice.note}</p>
              </div>
            </div>

            {/* What happens after */}
            <div className="rounded-xl border border-[#DBEAFE] bg-white p-5">
              <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-4">After connecting</p>
              <div className="flex flex-col gap-3">
                {[
                  {
                    icon: <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />,
                    text: "Allowed sites load normally — no slowdown",
                  },
                  {
                    icon: <XCircle className="h-4 w-4 text-[#EF4444]" />,
                    text: "Blocked sites never open — the page doesn't load at all",
                  },
                  {
                    icon: <Bell className="h-4 w-4 text-[#F59E0B]" />,
                    text: "You get notified every time a blocked site is attempted",
                  },
                  {
                    icon: <Clock className="h-4 w-4 text-[#8B5CF6]" />,
                    text: "Time limits are tracked per category — gaming stops at 1 hour",
                  },
                  {
                    icon: <Settings className="h-4 w-4 text-[#0EA5E9]" />,
                    text: "Rule changes you make apply to the device within 60 seconds",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5">{item.icon}</div>
                    <p className="text-xs text-[#64748B] leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* One account callout */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {[
            {
              icon: '👨‍👩‍👧‍👦',
              title: 'One account, whole family',
              desc: 'Emma, Liam, yourself — separate profiles, separate rules. One dashboard.',
            },
            {
              icon: '📲',
              title: 'Manage from anywhere',
              desc: 'Block a site, approve a request, update rules — all from your phone while you\'re at work.',
            },
            {
              icon: '🔄',
              title: 'Rules follow the device',
              desc: "If Emma logs into a new Wi-Fi, the rules still apply as long as Guardian is her DNS.",
            },
          ].map((card) => (
            <div key={card.title} className="rounded-xl border border-[#DBEAFE] bg-[#EEF3FF] p-5">
              <div className="text-2xl mb-3">{card.icon}</div>
              <p className="font-semibold text-[#334155] mb-1.5">{card.title}</p>
              <p className="text-sm text-[#94A3B8] leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
