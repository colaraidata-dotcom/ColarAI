import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/sections/Footer';
import { CheckCircle2, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Try Guardian with one profile.',
    cta: 'Start for free',
    href: '/sign-up',
    highlighted: false,
    features: [
      '1 profile',
      'Up to 2 devices',
      '10 content category rules',
      'Basic dashboard',
      'Manual override approval',
      '30-day log retention',
    ],
    missing: ['Time schedules', 'Weekly reports', 'Push notifications', 'Site overrides'],
  },
  {
    name: 'Family',
    price: '$14.99',
    period: '/mo',
    description: 'Full protection for the whole household.',
    cta: 'Start Family plan',
    href: '/sign-up?plan=family',
    highlighted: true,
    features: [
      'Unlimited profiles',
      'Up to 20 devices',
      'All category rules + site overrides',
      'Time schedules by day',
      'Weekly email reports',
      'Push notifications (iOS & Android)',
      'Override request flow',
      '90-day log retention',
      'Priority support',
    ],
    missing: [],
  },
  {
    name: 'Basic',
    price: '$9.99',
    period: '/mo',
    description: 'For small families or personal use.',
    cta: 'Start Basic plan',
    href: '/sign-up?plan=basic',
    highlighted: false,
    features: [
      'Up to 3 profiles',
      'Up to 5 devices',
      'All category rules',
      'Site overrides',
      'Time schedules',
      'Weekly reports',
      'Override request flow',
      '90-day log retention',
    ],
    missing: ['Push notifications', 'Priority support'],
  },
];

const faqs = [
  {
    q: 'Can I switch plans at any time?',
    a: 'Yes. Upgrade or downgrade anytime from your account settings. Changes take effect immediately.',
  },
  {
    q: 'Is there a free trial for paid plans?',
    a: 'The Free plan gives you unlimited time to test Guardian with one profile. Paid plans are available without a trial period but can be cancelled anytime.',
  },
  {
    q: 'What happens if I exceed device limits?',
    a: 'You\'ll need to remove an existing device or upgrade your plan to add a new one. Existing devices continue working.',
  },
  {
    q: 'Do mobile apps cost extra?',
    a: 'No. iOS and Android apps are included in all plans at no additional cost.',
  },
  {
    q: 'Is payment secure?',
    a: 'Payments are processed by Stripe. Guardian never stores your card details.',
  },
];

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        {/* Header */}
        <section className="py-20 text-center border-b border-[#DBEAFE]">
          <div className="mx-auto max-w-3xl px-6">
            <p className="text-xs font-semibold text-[#0EA5E9] uppercase tracking-widest mb-4">Pricing</p>
            <h1 className="text-5xl font-bold text-[#0F172A] mb-4">Simple, transparent pricing</h1>
            <p className="text-[#94A3B8] text-lg">No credit card required. Cancel anytime.</p>
          </div>
        </section>

        {/* Plans */}
        <section className="py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid md:grid-cols-3 gap-6 items-start">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-2xl border flex flex-col gap-6 p-7 relative ${
                    plan.highlighted
                      ? 'border-[#0EA5E9] bg-[#0EA5E9]/5'
                      : 'border-[#DBEAFE] bg-[#EEF3FF]'
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-[#0EA5E9] px-4 py-1 text-xs font-bold text-white">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium text-[#94A3B8] mb-3">{plan.name}</p>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-4xl font-bold text-[#0F172A]">{plan.price}</span>
                      <span className="text-[#94A3B8] text-sm ml-0.5">{plan.period}</span>
                    </div>
                    <p className="mt-2 text-sm text-[#94A3B8]">{plan.description}</p>
                  </div>

                  <Link href={plan.href}>
                    <Button
                      variant={plan.highlighted ? 'primary' : 'secondary'}
                      size="lg"
                      className="w-full"
                    >
                      {plan.cta}
                    </Button>
                  </Link>

                  <div className="flex flex-col gap-2.5">
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-start gap-2.5 text-sm text-[#334155]">
                        <CheckCircle2 className="h-4 w-4 text-[#22C55E] shrink-0 mt-0.5" />
                        {f}
                      </div>
                    ))}
                    {plan.missing.map((f) => (
                      <div key={f} className="flex items-start gap-2.5 text-sm text-[#2A2A40] line-through">
                        <div className="h-4 w-4 shrink-0 mt-0.5" />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 border-t border-[#DBEAFE] bg-[#EEF3FF]">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-3xl font-bold text-[#0F172A] mb-12">Frequently asked questions</h2>
            <div className="flex flex-col gap-0">
              {faqs.map((faq, i) => (
                <div
                  key={faq.q}
                  className={`py-7 ${i < faqs.length - 1 ? 'border-b border-[#DBEAFE]' : ''}`}
                >
                  <p className="font-semibold text-[#0F172A] mb-2">{faq.q}</p>
                  <p className="text-[#94A3B8] text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
