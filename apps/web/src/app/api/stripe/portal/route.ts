import { NextResponse } from 'next/server';
import { createClient, getAuthenticatedUser, unauthorized } from '@/lib/supabase/server';
import { getStripe } from '@/lib/stripe';

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://guardian.io';

  // Find or look up Stripe customer by email
  const s = getStripe();
  const customers = await s.customers.list({ email: user.email, limit: 1 });
  const customer = customers.data[0];
  if (!customer) return NextResponse.json({ error: 'No subscription found' }, { status: 404 });

  const session = await s.billingPortal.sessions.create({
    customer: customer.id,
    return_url: `${appUrl}/settings`,
  });

  return NextResponse.json({ url: session.url });
}
