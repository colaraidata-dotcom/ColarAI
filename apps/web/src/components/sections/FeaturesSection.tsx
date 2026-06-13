import { Users, Shield, BarChart3, Smartphone, Brain, Clock } from 'lucide-react';

const features = [
  {
    num: '01',
    icon: Users,
    color: '#0EA5E9',
    title: 'Unlimited profiles',
    description:
      'One account, separately configured profiles for every person. Different ages, different rules — managed from the same place.',
  },
  {
    num: '02',
    icon: Shield,
    color: '#22C55E',
    title: 'Real-time filtering',
    description:
      'Every DNS request is classified and checked against profile rules before any content loads. No page visits a blocked server.',
  },
  {
    num: '03',
    icon: Smartphone,
    color: '#22D3EE',
    title: 'Cross-platform',
    description:
      'Same profile rules on iOS, Android, macOS, and Windows. When a child switches devices, the rules follow them.',
  },
  {
    num: '04',
    icon: Clock,
    color: '#F59E0B',
    title: 'Time schedules',
    description:
      'No gaming during school hours. Social media off after 9 PM. Set rules by day of the week.',
  },
  {
    num: '05',
    icon: Brain,
    color: '#8B5CF6',
    title: 'AI classification',
    description:
      'New domains not in the database are classified by machine learning. Unknown sites are not automatically allowed.',
  },
  {
    num: '06',
    icon: BarChart3,
    color: '#EC4899',
    title: 'Weekly reports',
    description:
      'Category-based usage time, blocked attempts, and most-visited sites delivered every week.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mb-16">
          <p className="text-xs font-semibold text-[#0EA5E9] uppercase tracking-widest mb-3">Features</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#F1F5F9] leading-tight max-w-xl">
            One platform,<br />for everyone
          </h2>
        </div>

        {/* Feature rows — NOT a bento grid */}
        <div className="flex flex-col">
          {features.map((f, i) => {
            const Icon = f.icon;
            const isLast = i === features.length - 1;
            return (
              <div
                key={f.title}
                className={`group grid grid-cols-[80px_1fr_2fr] gap-8 py-8 items-start ${
                  !isLast ? 'border-b border-[#1A1A2E]' : ''
                }`}
              >
                {/* Number */}
                <span className="text-sm font-mono text-[#2A2A40] font-bold pt-0.5 group-hover:text-[#0EA5E9] transition-colors">
                  {f.num}
                </span>

                {/* Icon + Title */}
                <div className="flex items-start gap-3">
                  <div
                    className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: f.color + '18' }}
                  >
                    <Icon className="h-4.5 w-4.5" style={{ color: f.color }} />
                  </div>
                  <h3 className="text-base font-semibold text-[#F1F5F9] leading-tight pt-1.5">
                    {f.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-[#64748B] leading-relaxed text-sm pt-1.5 group-hover:text-[#94A3B8] transition-colors">
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
