const steps = [
  {
    num: '01',
    color: '#0EA5E9',
    title: 'Request intercepted',
    description:
      'A device opens a site or app. Guardian captures the DNS query at the network level before any data is exchanged.',
  },
  {
    num: '02',
    color: '#8B5CF6',
    title: 'Content classified',
    description:
      'The domain is matched against 10 content categories using DNS databases and — for unknown domains — AI classification.',
  },
  {
    num: '03',
    color: '#22D3EE',
    title: 'Profile rule applied',
    description:
      "The device's active profile rules, time schedules, and daily limits are checked against the classified category.",
  },
  {
    num: '04',
    color: '#22C55E',
    title: 'Access granted or blocked',
    description:
      'Allowed: real IP returned, content loads. Blocked: NXDOMAIN, site never loads. Decision logged to dashboard.',
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-16">
          <p className="text-xs font-semibold text-[#0EA5E9] uppercase tracking-widest mb-3">How it works</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#F1F5F9] leading-tight max-w-xl">
            Every request,<br />decided in milliseconds
          </h2>
        </div>

        {/* Steps — horizontal timeline on desktop */}
        <div className="grid md:grid-cols-4 gap-0">
          {steps.map((s, i) => (
            <div key={s.num} className="relative">
              {/* Connector */}
              {i < steps.length - 1 && (
                <div
                  className="absolute top-[22px] left-[72px] right-0 h-px hidden md:block"
                  style={{ background: `linear-gradient(90deg, ${s.color}40, transparent)` }}
                />
              )}

              <div className="pr-8 pb-8">
                {/* Step indicator */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="h-11 w-11 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                    style={{ background: s.color + '18', color: s.color }}
                  >
                    {s.num}
                  </div>
                </div>

                <h3 className="font-semibold text-[#F1F5F9] mb-2">{s.title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">{s.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* DNS clarification note */}
        <div className="mt-4 rounded-xl border border-[#1A1A2E] bg-[#0D0D1A] px-6 py-4 flex items-start gap-4">
          <div className="h-8 w-8 rounded-lg bg-[#0EA5E9]/10 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-xs font-bold text-[#0EA5E9]">DNS</span>
          </div>
          <div>
            <p className="text-sm font-medium text-[#CBD5E1] mb-0.5">Why DNS?</p>
            <p className="text-xs text-[#475569] leading-relaxed max-w-2xl">
              DNS is the phone book of the internet — every site visit starts here. By intercepting DNS queries, Guardian
              blocks content before any data is sent or received, with no visible slowdown and no need to inspect encrypted traffic.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
