const steps = [
  {
    num: '01',
    color: '#0EA5E9',
    title: 'Your device asks for an address',
    description:
      'Every app and website starts by looking up a domain name — like asking "where does google.com live?" This happens before any page loads.',
  },
  {
    num: '02',
    color: '#8B5CF6',
    title: 'Guardian catches the question',
    description:
      'Instead of asking a random internet server, the device asks Guardian first. We check what category the site belongs to — social media, gaming, adult content, etc.',
  },
  {
    num: '03',
    color: '#22D3EE',
    title: 'We check the profile rules',
    description:
      "We look up which profile is active on that device and what rules you've set. Is gaming blocked? Is it after 9 PM? Is the daily time limit reached?",
  },
  {
    num: '04',
    color: '#22C55E',
    title: 'Allow or block — instantly',
    description:
      'Allowed: the page loads as normal. Blocked: the site never opens, and you get a notification. The whole process takes less than 5 milliseconds.',
  },
];

// Simple visual flow diagram
function FlowDiagram() {
  return (
    <div className="my-12 rounded-2xl border border-[#1A1A2E] bg-[#0D0D1A] p-6 overflow-x-auto">
      <div className="flex items-center gap-0 min-w-[520px]">
        {/* Device */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div className="h-12 w-12 rounded-xl bg-[#1A1A2E] border border-[#252540] flex items-center justify-center text-xl">
            📱
          </div>
          <p className="text-[10px] text-[#475569] font-medium text-center">Child's<br />device</p>
        </div>

        {/* Arrow + label */}
        <div className="flex-1 flex flex-col items-center gap-1 px-2">
          <p className="text-[9px] text-[#0EA5E9] font-semibold uppercase tracking-wider">DNS query</p>
          <div className="w-full h-px bg-gradient-to-r from-[#0EA5E9]/60 to-[#0EA5E9]/60 relative">
            <div className="absolute right-0 top-[-3px] border-l-4 border-l-[#0EA5E9] border-y-4 border-y-transparent" />
          </div>
          <p className="text-[9px] text-[#475569]">"where is tiktok.com?"</p>
        </div>

        {/* Guardian */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div className="h-12 w-20 rounded-xl bg-[#0EA5E9]/10 border border-[#0EA5E9]/30 flex items-center justify-center">
            <span className="text-xs font-bold text-[#0EA5E9]">Guardian</span>
          </div>
          <p className="text-[10px] text-[#475569] font-medium text-center">Checks rules<br />instantly</p>
        </div>

        {/* Two outcomes */}
        <div className="flex-1 flex flex-col gap-2 px-2">
          {/* Blocked path */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-[#EF4444]/40 relative">
              <div className="absolute right-0 top-[-3px] border-l-4 border-l-[#EF4444] border-y-4 border-y-transparent" />
            </div>
            <div className="h-7 w-20 shrink-0 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-center justify-center">
              <p className="text-[10px] font-semibold text-[#EF4444]">BLOCKED</p>
            </div>
          </div>
          {/* Allowed path */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-[#22C55E]/40 relative">
              <div className="absolute right-0 top-[-3px] border-l-4 border-l-[#22C55E] border-y-4 border-y-transparent" />
            </div>
            <div className="h-7 w-20 shrink-0 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center justify-center">
              <p className="text-[10px] font-semibold text-[#22C55E]">ALLOWED</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notification row */}
      <div className="mt-5 pt-4 border-t border-[#1A1A2E] flex items-center gap-3">
        <div className="h-6 w-6 rounded-full bg-[#F59E0B]/10 flex items-center justify-center text-xs shrink-0">🔔</div>
        <p className="text-xs text-[#64748B]">
          Every blocked request is logged and you get a notification — so you always know what your child tried to access.
        </p>
      </div>
    </div>
  );
}

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 border-t border-[#1A1A2E]">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-semibold text-[#0EA5E9] uppercase tracking-widest mb-3">How it works</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#F1F5F9] leading-tight max-w-xl">
            Blocked before it<br />even loads
          </h2>
          <p className="text-[#64748B] mt-4 max-w-lg leading-relaxed">
            Guardian works at the DNS level — the first step every device takes before opening any website or app.
            That means we can block content before a single byte is downloaded.
          </p>
        </div>

        {/* Visual flow */}
        <FlowDiagram />

        {/* Steps */}
        <div className="grid md:grid-cols-4 gap-0">
          {steps.map((s, i) => (
            <div key={s.num} className="relative">
              {i < steps.length - 1 && (
                <div
                  className="absolute top-[22px] left-[72px] right-0 h-px hidden md:block"
                  style={{ background: `linear-gradient(90deg, ${s.color}40, transparent)` }}
                />
              )}
              <div className="pr-8 pb-8">
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
      </div>
    </section>
  );
}
