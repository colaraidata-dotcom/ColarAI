import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getStripe, PLANS } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { plan } = await request.json();
  if (!plan || !(plan in PLANS)) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://guardian.io';
  const planConfig = PLANS[plan as keyof typeof PLANS];

  if (!planConfig.priceId) {
    return NextResponse.json({ error: 'Price not configured' }, { status: 503 });
  }

  const session = await getStripe().checkout.sessions.create({
    mode: 'subscription',
    customer_email: user.email,
    line_items: [{ price: planConfig.priceId, quantity: 1 }],
    metadata: { user_id: user.id, plan },
    success_url: `${appUrl}/settings?upgraded=1`,
    cancel_url: `${appUrl}/settings`,
  });

  return NextResponse.json({ url: session.url });
}
