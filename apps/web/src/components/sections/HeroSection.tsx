import Link from 'next/link';
import {
  Shield, ArrowRight, CheckCircle2,
  LayoutDashboard, Users, BarChart3, Bell, Settings, XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Inline product screenshot — shows the actual product UI
function DashboardMockup() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        boxShadow: '0 0 0 1px #1A1A2E, 0 32px 80px rgba(0,0,0,0.6), 0 0 80px rgba(14,165,233,0.08)',
      }}
    >
      {/* Browser chrome */}
      <div className="bg-[#0D0D1A] border-b border-[#1A1A2E] px-4 py-3 flex items-center gap-3">
        <div className="flex gap-1.5 shrink-0">
          <div className="h-3 w-3 rounded-full bg-[#EF4444]/80" />
          <div className="h-3 w-3 rounded-full bg-[#F59E0B]/80" />
          <div className="h-3 w-3 rounded-full bg-[#22C55E]/80" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-[#111120] rounded-md px-6 py-1.5 text-xs text-[#475569] font-mono max-w-xs w-full text-center">
            app.guardian.io/dashboard
          </div>
        </div>
      </div>

      {/* App layout */}
      <div className="flex h-[440px] bg-[#08080F]">
        {/* Sidebar */}
        <aside className="w-[200px] shrink-0 border-r border-[#1A1A2E] bg-[#0D0D1A] flex flex-col">
          <div className="px-4 py-4 border-b border-[#1A1A2E] flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-[#0EA5E9] flex items-center justify-center">
              <Shield className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-[#F1F5F9]">Guardian</span>
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
                    ? 'bg-[#0EA5E9]/15 text-[#F1F5F9] font-medium'
                    : 'text-[#64748B]'
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
            <p className="text-sm font-bold text-[#F1F5F9]">Dashboard</p>
            <p className="text-xs text-[#64748B] mt-0.5">Friday, June 13, 2026</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Active Profiles', value: '4', color: '#0EA5E9' },
              { label: 'Devices', value: '6', color: '#22C55E' },
              { label: 'Blocked Today', value: '23', color: '#EF4444' },
              { label: 'Avg. Time', value: '3h 12m', color: '#F59E0B' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-[#1A1A2E] bg-[#111120] p-3">
                <p className="text-[10px] text-[#64748B] mb-1 leading-tight">{s.label}</p>
                <p className="text-base font-bold leading-tight" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Profiles */}
          <div>
            <p className="text-xs font-semibold text-[#94A3B8] mb-2 uppercase tracking-wider">Profiles</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'Emma', type: 'Child', color: '#3B82F6', blocked: 8, active: true },
                { name: 'Liam', type: 'Teen', color: '#8B5CF6', blocked: 3, active: true },
                { name: 'John — Work', type: 'Self-Control', color: '#22C55E', blocked: 12, active: true },
                { name: 'John — Personal', type: 'Unrestricted', color: '#0EA5E9', blocked: 0, active: false },
              ].map((p) => (
                <div key={p.name} className="rounded-xl border border-[#1A1A2E] bg-[#111120] px-3 py-2.5 flex items-center gap-2.5">
                  <div
                    className="h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: p.color }}
                  >
                    {p.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#F1F5F9] truncate">{p.name}</p>
                    <p className="text-[10px] text-[#64748B]">{p.type}</p>
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
          backgroundImage: 'radial-gradient(circle, #1E2035 1.5px, transparent 1.5px)',
          backgroundSize: '28px 28px',
          opacity: 0.7,
        }}
      />

      {/* Top center glow — subtle, not neon */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(14,165,233,0.10) 0%, transparent 65%)',
        }}
      />

      {/* Bottom fade into page */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#08080F] to-transparent pointer-events-none z-10" />

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        {/* Centered text block */}
        <div className="text-center flex flex-col items-center">
          {/* Category badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#0EA5E9]/25 bg-[#0EA5E9]/8 px-4 py-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-[#0EA5E9] animate-pulse" />
            <span className="text-xs font-medium text-[#0EA5E9] tracking-wide uppercase">Profile-Based Internet Control</span>
          </div>

          {/* Headline — massive, tight */}
          <h1 className="text-[clamp(2.5rem,8vw,5.5rem)] font-bold leading-[1.05] tracking-tight mb-6">
            <span className="text-[#F1F5F9]">Every person gets</span>
            <br />
            <span className="text-[#F1F5F9]">their own</span>{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 50%, #22D3EE 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              internet.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg text-[#94A3B8] max-w-xl leading-relaxed mb-8">
            Guardian enforces per-profile rules across iOS, Android, macOS, and Windows —
            in real time, before content loads.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <Link href="/sign-up">
              <Button size="lg" className="px-7 h-12 text-base">
                Start for Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <button className="h-12 px-7 rounded-xl text-base font-medium text-[#94A3B8] hover:text-[#F1F5F9] transition-colors">
                How does it work?
              </button>
            </Link>
          </div>

          {/* Trust strip */}
          <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-[#475569] mb-16">
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
        <div
          style={{
            perspective: '1400px',
          }}
        >
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
              style={{ background: 'rgba(14,165,233,0.25)' }}
            />
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
