import { CheckCircle2, XCircle, MinusCircle } from 'lucide-react';

const products = ['Circle', 'Bark', 'Apple Screen Time', 'Google Family Link', 'Qustodio', 'Guardian'];

const features = [
  {
    label: 'Profile-based rules',
    support: [false, false, false, false, false, true],
  },
  {
    label: 'Teen-specific controls',
    support: [false, false, false, false, 'partial', true],
  },
  {
    label: 'Adult self-control mode',
    support: [false, false, false, false, false, true],
  },
  {
    label: 'iOS + Android + desktop',
    support: ['partial', false, false, false, true, true],
  },
  {
    label: 'One app for the whole family',
    support: [false, false, false, false, false, true],
  },
  {
    label: 'Override request flow',
    support: ['partial', false, false, false, 'partial', true],
  },
];

function Cell({ value }: { value: boolean | 'partial' | string }) {
  if (value === true) return <CheckCircle2 className="h-5 w-5 text-[#15803D] mx-auto" />;
  if (value === false) return <XCircle className="h-5 w-5 text-[#BFDBFE] mx-auto" />;
  return <MinusCircle className="h-5 w-5 text-[#B45309] mx-auto" />;
}

export function CompetitorSection() {
  return (
    <section className="py-24 bg-[#EEF3FF]/50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#0F172A] mb-4">
            Why Guardian?
          </h2>
          <p className="text-[#475569] text-lg max-w-2xl mx-auto">
            Built to fill the gaps that existing tools leave behind.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#DBEAFE]">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-[#DBEAFE] bg-[#EEF3FF]">
                <th className="px-5 py-4 text-left text-sm font-medium text-[#475569]">Feature</th>
                {products.map((p) => (
                  <th
                    key={p}
                    className={`px-4 py-4 text-center text-sm font-medium ${
                      p === 'Guardian' ? 'text-[#0369A1]' : 'text-[#475569]'
                    }`}
                  >
                    {p === 'Guardian' ? (
                      <span className="flex items-center justify-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-[#0EA5E9]" />
                        Guardian
                      </span>
                    ) : (
                      p
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((f, i) => (
                <tr
                  key={f.label}
                  className={`border-b border-[#DBEAFE] last:border-b-0 ${
                    i % 2 === 0 ? 'bg-white' : 'bg-[#F5F8FF]'
                  }`}
                >
                  <td className="px-5 py-4 text-sm text-[#334155]">{f.label}</td>
                  {f.support.map((val, idx) => (
                    <td
                      key={idx}
                      className={`px-4 py-4 text-center ${
                        idx === f.support.length - 1 ? 'bg-[#0EA5E9]/5' : ''
                      }`}
                    >
                      <Cell value={val} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-center text-xs text-[#94A3B8]">
          Partial support (yellow) = available on certain platforms or with limited configuration
        </p>
      </div>
    </section>
  );
}
