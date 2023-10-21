'use client';

import { StripePack } from '@safe-global/onramp-kit';
import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    const stripePack = new StripePack({
      stripePublicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '',
      onRampBackendUrl: `${process.env.BASE_URL}/api/stripe/`,
    });

    (async () => {
      await stripePack.init();

      const sessionData = await stripePack.open({
        element: '#stripe-root',
        theme: 'light',
        defaultOptions: {
          transaction_details: {
            wallet_address: localStorage.getItem('userAddress') || '',
          },
        },
      });
    })();
  }, []);

  return <div id='stripe-root' />;
}
