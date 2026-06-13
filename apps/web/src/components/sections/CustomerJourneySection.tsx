import Link from 'next/link';
import { UserPlus, Users, Wifi, BarChart3 } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    color: '#0EA5E9',
    num: '01',
    title: 'Create your account',
    timeEstimate: '30 seconds',
    description: 'Sign up free with your email. No credit card required. One account covers your whole family.',
  },
  {
    icon: Users,
    color: '#8B5CF6',
    num: '02',
    title: 'Set up profiles',
    timeEstimate: '2 minutes',
    description: 'Add a profile for each person — child, teen, or yourself. Pick what each one can access.',
  },
  {
    icon: Wifi,
    color: '#22D3EE',
    num: '03',
    title: 'Connect a device',
    timeEstimate: '1 minute',
    description: "Change one DNS setting on the device — Guardian takes over from there. Works on any phone, tablet, Mac, or Windows PC.",
  },
  {
    icon: BarChart3,
    color: '#22C55E',
    num: '04',
    title: 'Monitor & adjust',
    timeEstimate: 'Ongoing',
    description: 'See what\'s being blocked, approve requests, and update rules from your dashboard anytime.',
  },
];

export function CustomerJourneySection() {
  return (
    <section className="py-24 border-t border-[#1A1A2E]">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-xs font-semibold text-[#0EA5E9] uppercase tracking-widest mb-3">Get started</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#F1F5F9] leading-tight">
              Up and running<br />in under 5 minutes
            </h2>
          </div>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#0EA5E9] hover:text-[#38BDF8] transition-colors shrink-0"
          >
            Start for free
            <span className="text-[#0EA5E9]">→</span>
          </Link>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={s.num} className="relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div
                  className="absolute top-[28px] left-[64px] right-[-24px] h-px hidden md:block"
                  style={{ background: `linear-gradient(90deg, ${s.color}50, transparent)` }}
                />
              )}

              <div className="rounded-2xl border border-[#1A1A2E] bg-[#0D0D1A] p-6 h-full">
                {/* Icon + number */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: s.color + '15', border: `1px solid ${s.color}30` }}
                  >
                    <s.icon className="h-5 w-5" style={{ color: s.color }} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: s.color + 'aa' }}>
                      Step {s.num}
                    </p>
                    <p className="text-xs text-[#475569]">{s.timeEstimate}</p>
                  </div>
                </div>

                <h3 className="font-semibold text-[#F1F5F9] mb-2">{s.title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">{s.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* DNS plain-language callout */}
        <div className="mt-8 rounded-2xl border border-[#0EA5E9]/15 bg-[#0EA5E9]/5 px-6 py-5 flex flex-col sm:flex-row items-start gap-5">
          <div className="h-10 w-10 rounded-xl bg-[#0EA5E9]/10 flex items-center justify-center shrink-0">
            <Wifi className="h-5 w-5 text-[#0EA5E9]" />
          </div>
          <div>
            <p className="font-semibold text-[#CBD5E1] mb-1">
              What is a "DNS setting" and why is it that simple?
            </p>
            <p className="text-sm text-[#64748B] leading-relaxed max-w-3xl">
              Think of DNS as your device's address book — every time you open an app or website, your device looks up
              the address first. By pointing that lookup to Guardian, we see every request <em>before</em> it loads and
              decide: allow or block. No extra software, no traffic inspection, no slowdown.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
