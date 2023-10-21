import { AuthorizationRequestMessage } from '@0xpolygonid/js-sdk';
import { format, subYears } from 'date-fns';
import { isAddress } from 'ethers';
import { NextResponse } from 'next/server';

import { generateRequest, verify } from '@/lib/polygonNSFW';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  const token = Buffer.from(await req.arrayBuffer()).toString() || '';

  const { searchParams } = new URL(req.url);
  const userAddr = searchParams.get('userAddr');
  const birthday = parseInt(searchParams.get('birthday') || '0');

  if (typeof userAddr != 'string' || isAddress(userAddr) || birthday == 0)
    return NextResponse.json({ result: 'Invalid params' });

  if (birthday > parseInt(format(subYears(new Date(), 18), 'yyyyMMdd')))
    return NextResponse.json({ result: 'Invalid birthday' });

  try {
    const request: AuthorizationRequestMessage = generateRequest(
      userAddr,
      'Data required to get further access',
      birthday
    );

    const response = await verify(token, request);

    await supabase.from('user').update({ adult: true }).eq('address', userAddr);

    console.log(response);
    return NextResponse.json({ result: 'success' });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ result: 'Invalid proof' });
  }
}
