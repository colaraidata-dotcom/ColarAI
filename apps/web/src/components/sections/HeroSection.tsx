import Link from 'next/link';
import {
  Shield, ArrowRight, CheckCircle2,
  LayoutDashboard, Users, BarChart3, Bell, Settings, XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

function DashboardMockup() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        boxShadow: '0 0 0 1px #DBEAFE, 0 32px 80px rgba(14,165,233,0.12), 0 0 60px rgba(14,165,233,0.06)',
      }}
    >
      {/* Browser chrome */}
      <div className="bg-[#EEF3FF] border-b border-[#DBEAFE] px-4 py-3 flex items-center gap-3">
        <div className="flex gap-1.5 shrink-0">
          <div className="h-3 w-3 rounded-full bg-[#EF4444]/70" />
          <div className="h-3 w-3 rounded-full bg-[#F59E0B]/70" />
          <div className="h-3 w-3 rounded-full bg-[#22C55E]/70" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-white rounded-md px-6 py-1.5 text-xs text-[#94A3B8] font-mono max-w-xs w-full text-center border border-[#DBEAFE]">
            app.guardian.io/dashboard
          </div>
        </div>
      </div>

      {/* App layout */}
      <div className="flex h-[440px] bg-[#F5F8FF]">
        {/* Sidebar */}
        <aside className="w-[200px] shrink-0 border-r border-[#DBEAFE] bg-white flex flex-col">
          <div className="px-4 py-4 border-b border-[#DBEAFE] flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-[#0EA5E9] flex items-center justify-center">
              <Shield className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-[#0F172A]">Guardian</span>
          </div>
          <div className="p-2 flex flex-col gap-0.5">
            {[
              { label: 'Dashboard', icon: LayoutDashboard, active: true },
              { label: 'Profiles', icon: Users },
              { label: 'Reports', icon: BarChart3 },
              { label: 'Notifications', icon: Bell, badge: 3 },
              { label: 'Settings', icon: Settings },
            ].map((item) => (
              <div
                key={item.label}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs ${
                  item.active
                    ? 'bg-[#0EA5E9]/10 text-[#0F172A] font-medium'
                    : 'text-[#94A3B8]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <item.icon className={`h-3.5 w-3.5 ${item.active ? 'text-[#0EA5E9]' : ''}`} />
                  {item.label}
                </div>
                {item.badge && (
                  <span className="bg-[#EF4444] text-white text-[10px] rounded-full px-1.5 font-medium">
                    {item.badge}
                  </span>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 p-5 flex flex-col gap-4 overflow-hidden">
          <div>
            <p className="text-sm font-bold text-[#0F172A]">Dashboard</p>
            <p className="text-xs text-[#94A3B8] mt-0.5">Friday, June 13, 2026</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Active Profiles', value: '4', color: '#0EA5E9' },
              { label: 'Devices', value: '6', color: '#22C55E' },
              { label: 'Blocked Today', value: '23', color: '#EF4444' },
              { label: 'Avg. Time', value: '3h 12m', color: '#F59E0B' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-[#DBEAFE] bg-white p-3">
                <p className="text-[10px] text-[#94A3B8] mb-1 leading-tight">{s.label}</p>
                <p className="text-base font-bold leading-tight" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Profiles */}
          <div>
            <p className="text-xs font-semibold text-[#475569] mb-2 uppercase tracking-wider">Profiles</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'Emma', type: 'Child', color: '#3B82F6', blocked: 8, active: true },
                { name: 'Liam', type: 'Teen', color: '#8B5CF6', blocked: 3, active: true },
                { name: 'John — Work', type: 'Self-Control', color: '#22C55E', blocked: 12, active: true },
                { name: 'John — Personal', type: 'Unrestricted', color: '#0EA5E9', blocked: 0, active: false },
              ].map((p) => (
                <div key={p.name} className="rounded-xl border border-[#DBEAFE] bg-white px-3 py-2.5 flex items-center gap-2.5">
                  <div
                    className="h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: p.color }}
                  >
                    {p.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#0F172A] truncate">{p.name}</p>
                    <p className="text-[10px] text-[#94A3B8]">{p.type}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <XCircle className="h-3 w-3 text-[#EF4444]" />
                    <span className="text-[10px] font-medium text-[#EF4444]">{p.blocked}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative pt-28 pb-0 overflow-hidden">
      {/* Dot grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #BFDBFE 1.5px, transparent 1.5px)',
          backgroundSize: '28px 28px',
          opacity: 0.6,
        }}
      />

      {/* Top center glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(14,165,233,0.12) 0%, transparent 65%)',
        }}
      />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#F5F8FF] to-transparent pointer-events-none z-10" />

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        {/* Centered text block */}
        <div className="text-center flex flex-col items-center">
          {/* Category badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#0EA5E9]/30 bg-[#0EA5E9]/8 px-4 py-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-[#0EA5E9] animate-pulse" />
            <span className="text-xs font-medium text-[#0369A1] tracking-wide uppercase">Profile-Based Internet Control</span>
          </div>

          {/* Headline */}
          <h1 className="text-[clamp(2.5rem,8vw,5.5rem)] font-bold leading-[1.05] tracking-tight mb-6">
            <span className="text-[#0F172A]">Your home.</span>
            <br />
            <span className="text-[#0F172A]">Your rules.</span>{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 50%, #0369A1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Your internet.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg text-[#475569] max-w-xl leading-relaxed mb-8">
            Guardian puts every screen in your home under your control — separate rules for every person,
            enforced in real time before content loads.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <Link href="/sign-up">
              <Button size="lg" className="px-7 h-12 text-base">
                Start for Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/demo">
              <button className="h-12 px-7 rounded-xl text-base font-medium border border-[#DBEAFE] bg-white hover:border-[#93C5FD] text-[#475569] hover:text-[#0F172A] transition-colors">
                Live Demo →
              </button>
            </Link>
          </div>

          {/* Trust strip */}
          <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-[#64748B] mb-16">
            {[
              'No credit card required',
              '1 profile free forever',
              '5-minute setup',
            ].map((text) => (
              <div key={text} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#22C55E]" />
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Product screenshot — 3D perspective tilt */}
        <div style={{ perspective: '1400px' }}>
          <div
            style={{
              transform: 'rotateX(7deg) scale(0.97)',
              transformOrigin: 'center top',
              transition: 'transform 0.4s ease',
            }}
            className="hover:[transform:rotateX(2deg)_scale(0.99)] relative"
          >
            {/* Top glow reflection */}
            <div
              className="absolute -top-6 left-1/2 -translate-x-1/2 w-3/4 h-12 pointer-events-none blur-2xl"
              style={{ background: 'rgba(14,165,233,0.18)' }}
            />
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
