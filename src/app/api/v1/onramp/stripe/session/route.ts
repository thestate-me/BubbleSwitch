import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// async function getStripeClientSecret() {
//   const data = await fetch(`${process.env.STRIPE_BASE_URL}/v1/crypto/onramp_sessions`, {
//     method: 'POST',
//     headers: {
//       Authorization: `Bearer ${process.env.STRIPE_PRIVATE_KEY}`,
//     "content-type": "application/x-www-form-urlencoded",
//     }
//   })

//   return data.json()
// }

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || '', {
  apiVersion: '2023-10-16',
});

const OnrampSessionResource = Stripe.StripeResource.extend({
  create: Stripe.StripeResource.method({
    method: 'POST',
    path: 'crypto/onramp_sessions',
  }),
});

export async function POST(req: Request) {
  // const result = await getStripeClientSecret()

  const onrampSession: any = await new OnrampSessionResource(stripe).create();

  return NextResponse.json({ clientSecret: onrampSession.client_secret });
}
