'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Shield, LayoutDashboard, Users, BarChart3, Bell, Settings,
  XCircle, CheckCircle2, Clock, ArrowRight, ChevronRight,
} from 'lucide-react';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/sections/Footer';

const profiles = [
  {
    id: 'emma',
    name: 'Emma',
    type: 'Child (age 9)',
    emoji: '👧',
    color: '#3B82F6',
    rules: {
      'Social Media': 'block',
      'Gaming': 'limit',
      'Education': 'allow',
      'Streaming': 'limit',
      'Adult Content': 'block',
      'Shopping': 'block',
      'News': 'allow',
      'Messaging': 'block',
    },
    blockedToday: 14,
    screenTime: '1h 22m',
    timeLimit: '2h',
    recentEvents: [
      { domain: 'tiktok.com', category: 'Social Media', action: 'blocked', time: '3m ago' },
      { domain: 'khanacademy.org', category: 'Education', action: 'allowed', time: '12m ago' },
      { domain: 'roblox.com', category: 'Gaming', action: 'allowed', time: '1h ago' },
      { domain: 'instagram.com', category: 'Social Media', action: 'blocked', time: '1h ago' },
      { domain: 'youtube.com', category: 'Streaming', action: 'allowed', time: '2h ago' },
    ],
  },
  {
    id: 'liam',
    name: 'Liam',
    type: 'Teen (age 15)',
    emoji: '👦',
    color: '#8B5CF6',
    rules: {
      'Social Media': 'limit',
      'Gaming': 'limit',
      'Education': 'allow',
      'Streaming': 'allow',
      'Adult Content': 'block',
      'Shopping': 'allow',
      'News': 'allow',
      'Messaging': 'allow',
    },
    blockedToday: 3,
    screenTime: '3h 44m',
    timeLimit: '4h',
    recentEvents: [
      { domain: 'discord.com', category: 'Messaging', action: 'allowed', time: '5m ago' },
      { domain: 'gambling-site.com', category: 'Adult Content', action: 'blocked', time: '20m ago' },
      { domain: 'netflix.com', category: 'Streaming', action: 'allowed', time: '45m ago' },
      { domain: 'twitter.com', category: 'Social Media', action: 'allowed', time: '1h ago' },
      { domain: 'steam.com', category: 'Gaming', action: 'allowed', time: '2h ago' },
    ],
  },
  {
    id: 'john',
    name: 'John — Work',
    type: 'Self-Control',
    emoji: '💼',
    color: '#22C55E',
    rules: {
      'Social Media': 'block',
      'Gaming': 'block',
      'Education': 'allow',
      'Streaming': 'block',
      'Adult Content': 'block',
      'Shopping': 'limit',
      'News': 'limit',
      'Messaging': 'allow',
    },
    blockedToday: 22,
    screenTime: '6h 10m',
    timeLimit: null,
    recentEvents: [
      { domain: 'notion.so', category: 'Education', action: 'allowed', time: '2m ago' },
      { domain: 'twitter.com', category: 'Social Media', action: 'blocked', time: '8m ago' },
      { domain: 'youtube.com', category: 'Streaming', action: 'blocked', time: '30m ago' },
      { domain: 'github.com', category: 'Education', action: 'allowed', time: '1h ago' },
      { domain: 'reddit.com', category: 'Social Media', action: 'blocked', time: '2h ago' },
    ],
  },
];

const categoryColors: Record<string, string> = {
  'Social Media': '#F59E0B',
  'Gaming': '#8B5CF6',
  'Education': '#22C55E',
  'Streaming': '#0EA5E9',
  'Adult Content': '#EF4444',
  'Shopping': '#EC4899',
  'News': '#6366F1',
  'Messaging': '#22D3EE',
};

function RuleIcon({ rule }: { rule: string }) {
  if (rule === 'allow') return <CheckCircle2 className="h-3.5 w-3.5 text-[#22C55E]" />;
  if (rule === 'block') return <XCircle className="h-3.5 w-3.5 text-[#EF4444]" />;
  return <Clock className="h-3.5 w-3.5 text-[#F59E0B]" />;
}

function RuleBadge({ rule }: { rule: string }) {
  const styles: Record<string, string> = {
    allow: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20',
    block: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20',
    limit: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-medium ${styles[rule]}`}>
      <RuleIcon rule={rule} />
      {rule.charAt(0).toUpperCase() + rule.slice(1)}
    </span>
  );
}

export default function DemoPage() {
  const [activeProfileId, setActiveProfileId] = useState('emma');
  const [activeTab, setActiveTab] = useState<'overview' | 'rules' | 'activity'>('overview');

  const profile = profiles.find((p) => p.id === activeProfileId)!;

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-0">
        {/* Header */}
        <div className="border-b border-[#DBEAFE] py-10">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0EA5E9]/25 bg-[#0EA5E9]/8 px-4 py-1.5 mb-5">
              <div className="h-1.5 w-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="text-xs font-medium text-[#0EA5E9] tracking-wide uppercase">Interactive Demo — No Sign-up Required</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-[#0F172A] leading-tight mb-4">
              See Guardian in action
            </h1>
            <p className="text-[#94A3B8] max-w-lg mx-auto leading-relaxed">
              Click through the profiles below to see how different rules work for each family member.
              This is what you'd see in your own dashboard.
            </p>
          </div>
        </div>

        {/* Demo container */}
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid lg:grid-cols-[260px_1fr] gap-6">

            {/* Left: profile list */}
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-widest px-1 mb-1">Profiles</p>
              {profiles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setActiveProfileId(p.id); setActiveTab('overview'); }}
                  className={`w-full text-left rounded-xl border p-4 transition-all ${
                    activeProfileId === p.id
                      ? 'border-[#0EA5E9]/40 bg-[#0EA5E9]/8'
                      : 'border-[#DBEAFE] bg-[#EEF3FF] hover:border-[#93C5FD]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-9 w-9 rounded-lg flex items-center justify-center text-base shrink-0"
                      style={{ background: p.color + '20', border: `1px solid ${p.color}40` }}
                    >
                      {p.emoji}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#0F172A] truncate">{p.name}</p>
                      <p className="text-[11px] text-[#94A3B8]">{p.type}</p>
                    </div>
                    <ChevronRight className={`h-4 w-4 ml-auto shrink-0 transition-colors ${activeProfileId === p.id ? 'text-[#0EA5E9]' : 'text-[#64748B]'}`} />
                  </div>
                  {activeProfileId === p.id && (
                    <div className="mt-3 pt-3 border-t border-[#0EA5E9]/15 flex gap-4 text-xs text-[#94A3B8]">
                      <span><span className="text-[#EF4444] font-semibold">{p.blockedToday}</span> blocked</span>
                      <span><span className="text-[#0EA5E9] font-semibold">{p.screenTime}</span> online</span>
                    </div>
                  )}
                </button>
              ))}

              {/* Add profile hint */}
              <div className="rounded-xl border border-dashed border-[#93C5FD] p-4 text-center">
                <p className="text-xs text-[#64748B]">+ Add another profile</p>
                <p className="text-[10px] text-[#374151] mt-0.5">Guests, partners, employees…</p>
              </div>
            </div>

            {/* Right: profile detail */}
            <div className="rounded-2xl border border-[#DBEAFE] bg-[#EEF3FF] overflow-hidden">
              {/* Profile header */}
              <div className="px-6 py-5 border-b border-[#DBEAFE] flex items-center gap-4">
                <div
                  className="h-11 w-11 rounded-xl flex items-center justify-center text-lg shrink-0"
                  style={{ background: profile.color + '20', border: `1px solid ${profile.color}40` }}
                >
                  {profile.emoji}
                </div>
                <div>
                  <h2 className="font-bold text-[#0F172A]">{profile.name}</h2>
                  <p className="text-xs text-[#94A3B8]">{profile.type}</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  {profile.timeLimit && (
                    <div className="hidden sm:flex items-center gap-2 rounded-lg bg-white border border-[#DBEAFE] px-3 py-1.5">
                      <Clock className="h-3.5 w-3.5 text-[#F59E0B]" />
                      <span className="text-xs text-[#64748B]">{profile.screenTime} / {profile.timeLimit} today</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-[#DBEAFE]">
                {(['overview', 'rules', 'activity'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
                      activeTab === tab
                        ? 'text-[#0EA5E9] border-b-2 border-[#0EA5E9]'
                        : 'text-[#64748B] hover:text-[#64748B]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="p-6">
                {/* Overview tab */}
                {activeTab === 'overview' && (
                  <div className="flex flex-col gap-6">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Blocked today', value: profile.blockedToday.toString(), color: '#EF4444' },
                        { label: 'Screen time', value: profile.screenTime, color: '#0EA5E9' },
                        { label: 'Requests allowed', value: String(Math.floor(profile.blockedToday * 4.2)), color: '#22C55E' },
                      ].map((s) => (
                        <div key={s.label} className="rounded-xl bg-white border border-[#DBEAFE] p-4">
                          <p className="text-[10px] text-[#94A3B8] mb-1 uppercase tracking-wider">{s.label}</p>
                          <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Screen time bar */}
                    {profile.timeLimit && (
                      <div>
                        <div className="flex justify-between text-xs text-[#94A3B8] mb-2">
                          <span>Daily screen time</span>
                          <span>{profile.screenTime} of {profile.timeLimit} used</span>
                        </div>
                        <div className="h-2 rounded-full bg-[#DBEAFE] overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              background: 'linear-gradient(90deg, #0EA5E9, #22D3EE)',
                              width: profile.id === 'emma' ? '68%' : '93%',
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Recent blocks summary */}
                    <div>
                      <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-3">Recent activity</p>
                      <div className="flex flex-col gap-2">
                        {profile.recentEvents.slice(0, 4).map((e, i) => (
                          <div key={i} className="flex items-center gap-3 rounded-lg bg-white border border-[#DBEAFE] px-3 py-2.5">
                            <div
                              className="h-1.5 w-1.5 rounded-full shrink-0"
                              style={{ background: e.action === 'blocked' ? '#EF4444' : '#22C55E' }}
                            />
                            <span className="text-xs font-mono text-[#64748B] flex-1 truncate">{e.domain}</span>
                            <span
                              className="text-[10px] font-medium shrink-0"
                              style={{ color: categoryColors[e.category] ?? '#64748B' }}
                            >
                              {e.category}
                            </span>
                            <span className="text-[10px] text-[#64748B] shrink-0">{e.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Rules tab */}
                {activeTab === 'rules' && (
                  <div className="flex flex-col gap-3">
                    <p className="text-sm text-[#94A3B8] mb-2">
                      These rules apply to every device linked to this profile.
                    </p>
                    {Object.entries(profile.rules).map(([cat, rule]) => (
                      <div key={cat} className="flex items-center justify-between rounded-lg bg-white border border-[#DBEAFE] px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{ background: categoryColors[cat] ?? '#64748B' }}
                          />
                          <span className="text-sm text-[#334155] font-medium">{cat}</span>
                        </div>
                        <RuleBadge rule={rule} />
                      </div>
                    ))}
                    <p className="text-xs text-[#64748B] mt-2">
                      <Clock className="h-3 w-3 inline mr-1 text-[#F59E0B]" />
                      "Limit" means allowed up to a daily time cap (e.g. 60 min/day), then blocked.
                    </p>
                  </div>
                )}

                {/* Activity tab */}
                {activeTab === 'activity' && (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-[#94A3B8] mb-3">
                      Every request Guardian processes — allowed and blocked.
                    </p>
                    {profile.recentEvents.map((e, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${
                          e.action === 'blocked'
                            ? 'border-[#EF4444]/15 bg-[#EF4444]/5'
                            : 'border-[#22C55E]/15 bg-[#22C55E]/5'
                        }`}
                      >
                        {e.action === 'blocked'
                          ? <XCircle className="h-4 w-4 text-[#EF4444] shrink-0" />
                          : <CheckCircle2 className="h-4 w-4 text-[#22C55E] shrink-0" />
                        }
                        <span className="text-sm font-mono text-[#64748B] flex-1 truncate">{e.domain}</span>
                        <span
                          className="text-[11px] font-medium shrink-0"
                          style={{ color: categoryColors[e.category] ?? '#64748B' }}
                        >
                          {e.category}
                        </span>
                        <span className="text-[11px] text-[#64748B] shrink-0 ml-2">{e.time}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-2xl border border-[#0EA5E9]/20 bg-[#0EA5E9]/5 p-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-[#0EA5E9]" />
              <h3 className="text-xl font-bold text-[#0F172A]">Ready to set this up for your family?</h3>
            </div>
            <p className="text-[#94A3B8] mb-6 max-w-md mx-auto">
              Create your free account in 30 seconds. One profile is free forever — no credit card needed.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 rounded-xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-semibold px-6 py-3 transition-colors"
              >
                Start for Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-2 rounded-xl border border-[#DBEAFE] bg-[#EEF3FF] hover:border-[#93C5FD] text-[#64748B] font-medium px-6 py-3 transition-colors"
              >
                How does it work?
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
