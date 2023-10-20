import { SismoConnect } from '@sismo-core/sismo-connect-server';
import { NextResponse } from 'next/server';

import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  const { communityId, sismo } = await req.json();

  const { data, error } = await supabase
    .from('community')
    .select('sismo_group, url')
    .eq('id', communityId);

  if (error) {
    console.log(error);
    return NextResponse.json({ error });
  }

  const url = data[0]?.url;
  const sismo_group = data[0]?.sismo_group;

  if (sismo_group && url) {
    const sismoConnect = SismoConnect({
      config: {
        appId: process.env.NEXT_PUBLIC_SISMO_APP_ID || '',
      },
    });

    try {
      await sismoConnect.verify(sismo, {
        claims: [
          {
            groupId: sismo_group,
          },
        ],
      });
    } catch (error) {
      console.log(error);
      return NextResponse.json({ result: 'Invalid proofs' });
    }

    return NextResponse.json({ result: 'success', url });
  }

  console.log({ result: 'Incorrect communityId', communityId, sismo });
  return NextResponse.json({ result: 'Incorrect communityId' });
}
