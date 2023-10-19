import { AuthorizationRequestMessage } from '@0xpolygonid/js-sdk';
import { MediaType } from '@0xpolygonid/js-sdk/dist/types/iden3comm/constants';
import { NextResponse } from 'next/server';

import { verify } from '@/lib/polygonId';

export async function POST(req: Request) {
  const token = req.body?.toString() || '';
  console.log(token);

  const request: AuthorizationRequestMessage = {
    id: 'asdf',
    thid: 'asdf',
    from: '',
    typ: MediaType.PlainMessage,
    type: 'https://iden3-communication.io/authorization/1.0/request',
    body: {
      reason: 'text reason',
      message: '',
      callbackUrl: 'https://nomad-guild.vercel.app/api/polygon/callback',
      scope: [
        {
          id: 1,
          circuitId: 'credentialAtomicQuerySigV2',
          query: {
            allowedIssuers: ['*'],
            type: 'KYCAgeCredential',
            context:
              'https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v3.json-ld',
            credentialSubject: { birthday: { $lt: 20230101 } },
          },
        },
      ],
    },
  };

  const response = await verify(token, request);

  console.log(response);
  return NextResponse.json(response);
}
