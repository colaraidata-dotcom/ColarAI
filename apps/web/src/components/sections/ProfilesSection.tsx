import { CheckCircle2, XCircle, Clock } from 'lucide-react';

const profiles = [
  {
    type: 'Child',
    age: '5–12',
    color: '#3B82F6',
    initial: 'E',
    example: 'Emma, age 8',
    stance: 'Strict allowlist. Unknown = blocked.',
    rules: [
      { label: 'Social media', action: 'block' as const },
      { label: 'Adult content', action: 'block' as const },
      { label: 'Gaming', action: 'limit' as const, detail: '60m / day' },
      { label: 'Education', action: 'allow' as const },
      { label: 'Gambling', action: 'block' as const },
    ],
  },
  {
    type: 'Teen',
    age: '13–17',
    color: '#8B5CF6',
    initial: 'L',
    example: 'Liam, age 15',
    stance: 'Balanced. More access, still guided.',
    rules: [
      { label: 'Social media', action: 'limit' as const, detail: '2h / day' },
      { label: 'Adult content', action: 'block' as const },
      { label: 'Gaming', action: 'limit' as const, detail: '2h / day' },
      { label: 'Education', action: 'allow' as const },
      { label: 'Gambling', action: 'block' as const },
    ],
  },
  {
    type: 'Self-Control',
    age: 'Adult',
    color: '#22C55E',
    initial: 'J',
    example: 'Work focus mode',
    stance: 'Block distractions during work hours.',
    rules: [
      { label: 'Social media', action: 'block' as const, detail: '09:00–18:00' },
      { label: 'News sites', action: 'block' as const, detail: '09:00–18:00' },
      { label: 'Shopping', action: 'block' as const },
      { label: 'Productivity', action: 'allow' as const },
      { label: 'Education', action: 'allow' as const },
    ],
  },
];

function ActionBadge({ action, detail }: { action: 'allow' | 'block' | 'limit'; detail?: string }) {
  if (action === 'allow') return (
    <span className="flex items-center gap-1 text-xs text-[#15803D] font-medium">
      <CheckCircle2 className="h-3 w-3" /> Allowed
    </span>
  );
  if (action === 'block') return (
    <span className="flex items-center gap-1 text-xs text-[#B91C1C] font-medium">
      <XCircle className="h-3 w-3" /> Blocked
    </span>
  );
  return (
    <span className="flex items-center gap-1 text-xs text-[#B45309] font-medium">
      <Clock className="h-3 w-3" /> {detail ?? 'Limited'}
    </span>
  );
}

export function ProfilesSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-16">
          <p className="text-xs font-semibold text-[#0EA5E9] uppercase tracking-widest mb-3">Profiles</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#0F172A] leading-tight max-w-xl">
            Rules shaped<br />for each person
          </h2>
          <p className="text-[#475569] mt-4 max-w-lg text-base leading-relaxed">
            What works for an 8-year-old is too restrictive for a 15-year-old. Each profile is configured independently.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {profiles.map((p) => (
            <div
              key={p.type}
              className="rounded-2xl border border-[#DBEAFE] bg-white overflow-hidden hover:border-[#93C5FD] transition-colors"
            >
              {/* Profile header */}
              <div className="p-6 border-b border-[#DBEAFE]" style={{ background: p.color + '08' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                    style={{ background: p.color }}
                  >
                    {p.initial}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-[#0F172A] text-sm">{p.type}</p>
                      <span
                        className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                        style={{ background: p.color + '18', color: p.color }}
                      >
                        {p.age}
                      </span>
                    </div>
                    <p className="text-xs text-[#94A3B8] mt-0.5">{p.example}</p>
                  </div>
                </div>
                <p className="text-xs text-[#475569] italic">{p.stance}</p>
              </div>

              {/* Rules */}
              <div className="p-6 flex flex-col gap-3.5">
                {p.rules.map((rule) => (
                  <div key={rule.label} className="flex items-center justify-between">
                    <span className="text-sm text-[#334155]">{rule.label}</span>
                    <ActionBadge action={rule.action} detail={'detail' in rule ? rule.detail : undefined} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
