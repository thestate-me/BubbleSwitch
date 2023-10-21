import { utils } from 'ethers';
import { NextResponse } from 'next/server';

import { generateRequest } from '@/lib/polygonNSFW';

export async function POST(req: Request) {
  const { userAddr } = await req.json();

  if (typeof userAddr != 'string' || !utils.isAddress(userAddr))
    return NextResponse.json({ result: 'Invalid params' });

  const qr = generateRequest(userAddr, 'Data required to get further access');

  return NextResponse.json({ result: 'success', qr });
}
