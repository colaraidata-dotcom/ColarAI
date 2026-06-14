import { Lock, Eye, Server, ShieldCheck } from 'lucide-react';

const trustItems = [
  {
    icon: Lock,
    color: '#0EA5E9',
    title: 'Minimal Cloud Logging',
    description:
      'Browsing data is processed on-device whenever possible. Only rule decisions and category labels go to the cloud — not full URLs.',
  },
  {
    icon: Eye,
    color: '#22C55E',
    title: 'Parent Visibility',
    description:
      'The blocked content log is visible only to the account owner. Detail level for teen profiles is configurable.',
  },
  {
    icon: Server,
    color: '#F59E0B',
    title: 'Configurable Retention',
    description:
      'Usage logs are retained for 90 days by default. Shorten to 30 days in account settings or delete instantly.',
  },
  {
    icon: ShieldCheck,
    color: '#22D3EE',
    title: 'Tamper Protection',
    description:
      "Child profiles can't disable Guardian or change DNS settings. Any attempt triggers an immediate notification.",
  },
];

export function TrustSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#0F172A] mb-4">
            Trust is part of the design
          </h2>
          <p className="text-[#475569] text-lg max-w-2xl mx-auto">
            Internet safety tools often come at the cost of privacy. Guardian chose a different path.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex gap-5 rounded-2xl border border-[#DBEAFE] bg-white p-6"
              >
                <div
                  className="shrink-0 h-10 w-10 rounded-xl flex items-center justify-center"
                  style={{ background: item.color + '15' }}
                >
                  <Icon className="h-5 w-5" style={{ color: item.color }} />
                </div>
                <div>
                  <h3 className="font-semibold text-[#0F172A] mb-1.5">{item.title}</h3>
                  <p className="text-sm text-[#475569] leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
