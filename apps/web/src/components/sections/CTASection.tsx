import Link from 'next/link';
import { ArrowRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function CTASection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <div className="rounded-3xl border border-[#0EA5E9]/25 bg-gradient-to-br from-[#0EA5E9]/8 to-[#38BDF8]/4 p-12">
          <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0EA5E9]">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-[#0F172A] mb-4">
            Start protecting your family
          </h2>
          <p className="text-[#475569] text-lg mb-8 max-w-xl mx-auto">
            Set up in 5 minutes. No credit card required. First profile free forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="lg">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="secondary" size="lg">
                View plans
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
