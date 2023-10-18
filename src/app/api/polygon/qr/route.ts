import { NextResponse } from 'next/server';

import { generateQr } from '@/lib/polygonId';

export async function POST(req: Request) {
  const { userId } = await req.json();

  if (typeof userId != 'string') return;

  const qr = await generateQr(userId, 'text reason', {
    birthday: {
      // users must be born before this year
      // birthday is less than Jan 1, 2023
      $lt: 20230101,
    },
  });

  return NextResponse.json(qr);
}
