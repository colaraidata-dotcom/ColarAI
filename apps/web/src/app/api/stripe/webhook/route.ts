import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { getStripe } from '@/lib/stripe';
import Stripe from 'stripe';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');
  if (!sig) return NextResponse.json({ error: 'No signature' }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createServiceClient();

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;
    const plan = session.metadata?.plan as 'basic' | 'family' | undefined;
    if (userId && plan) {
      await supabase
        .from('account_settings')
        .update({ subscription_tier: plan })
        .eq('id', userId);
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription;
    const customers = await getStripe().customers.list({ limit: 1 });
    const customer = customers.data.find((c) => c.id === sub.customer);
    if (customer?.email) {
      const { data: users } = await supabase.auth.admin.listUsers();
      const user = users?.users?.find((u) => u.email === customer.email);
      if (user) {
        await supabase
          .from('account_settings')
          .update({ subscription_tier: 'free' })
          .eq('id', user.id);
      }
    }
  }

  return NextResponse.json({ received: true });
}
