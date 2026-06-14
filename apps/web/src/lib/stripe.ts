import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const PLANS = {
  basic: {
    name: 'Basic',
    priceId: process.env.STRIPE_PRICE_BASIC ?? '',
    price: 4.99,
    profiles: 3,
    devices: 5,
  },
  family: {
    name: 'Family',
    priceId: process.env.STRIPE_PRICE_FAMILY ?? '',
    price: 9.99,
    profiles: 10,
    devices: 20,
  },
} as const;
