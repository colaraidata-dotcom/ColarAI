import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'One profile, unlimited trial.',
    cta: 'Start for free',
    highlighted: false,
    features: [
      '1 profile',
      'Up to 2 devices',
      '10 category rules',
      'Basic reporting',
      'Manual override approval',
    ],
  },
  {
    name: 'Family',
    price: '$14.99',
    period: 'mo',
    description: 'Full protection for the whole family.',
    cta: 'Start Family plan',
    highlighted: true,
    features: [
      'Unlimited profiles',
      'Up to 20 devices',
      'All categories + site overrides',
      'Time schedules',
      'Weekly email reports',
      'Push notifications',
      'Override request flow',
      'Priority support',
    ],
  },
  {
    name: 'Basic',
    price: '$9.99',
    period: 'mo',
    description: 'Small families or individual use.',
    cta: 'Start Basic plan',
    highlighted: false,
    features: [
      'Up to 3 profiles',
      'Up to 5 devices',
      'All category rules',
      'Time schedules',
      'Weekly reports',
      'Override request flow',
    ],
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-[#0D0D1A]/50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#F1F5F9] mb-4">
            Simple pricing
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-xl mx-auto">
            No credit card required. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-7 flex flex-col gap-6 ${
                plan.highlighted
                  ? 'border-[#0EA5E9] bg-[#0EA5E9]/5 relative'
                  : 'border-[#1A1A2E] bg-[#111120]'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-[#0EA5E9] px-3 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-[#94A3B8] mb-2">{plan.name}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-[#F1F5F9]">{plan.price}</span>
                  <span className="text-[#94A3B8]">/{plan.period}</span>
                </div>
                <p className="mt-2 text-sm text-[#94A3B8]">{plan.description}</p>
              </div>

              <ul className="flex flex-col gap-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-[#CBD5E1]">
                    <CheckCircle2 className="h-4 w-4 text-[#22C55E] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link href="/sign-up" className="mt-auto">
                <Button
                  variant={plan.highlighted ? 'primary' : 'secondary'}
                  size="lg"
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
