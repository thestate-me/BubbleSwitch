import {
  AuthType,
  ClaimType,
  SismoConnect,
  SismoConnectVerifiedResult,
} from '@sismo-core/sismo-connect-server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const sismoConnectResponse = await req.json();

  const config = {
    appId: process.env.NEXT_PUBLIC_SISMO_APP_ID || '',
    vault: {
      impersonate: [
        'leo21.sismo.eth',
        '0xA4C94A6091545e40fc9c3E0982AEc8942E282F38',
        '0x1b9424ed517f7700e7368e34a9743295a225d889',
        '0x82fbed074f62386ed43bb816f748e8817bf46ff7',
        '0xc281bd4db5bf94f02a8525dca954db3895685700',
        'github:leo21',
        'twitter:leo21_eth',
        'telegram:leo21',
      ],
    },
  };

  const auths = [{ authType: AuthType.GITHUB }];

  const claims = [
    {
      groupId: '0x1cde61966decb8600dfd0749bd371f12',
      value: 15,
      claimType: ClaimType.GTE,
    },
  ];

  const sismoConnect = SismoConnect({
    config,
  });

  const result: SismoConnectVerifiedResult = await sismoConnect.verify(
    sismoConnectResponse,
    {
      auths,
      claims,
    }
  );

  console.log(result.getUserIds(AuthType.VAULT));
  // vault anonymous identifier = hash(vaultSecret, AppId)
  // ['0x225c5b67c39778b40ef2528707c9fbdfed96f31b9a50826b95c2ac40e15e4c6b']
  console.log(result.getUserIds(AuthType.GITHUB));
  // [ '35774097' ] GitHub id of @dhadrien
  console.log(result.getUserIds(AuthType.TWITTER));
  // [ '2390703980' ] Twitter id of @dhadrien_
  console.log(result.getUserIds(AuthType.EVM_ACCOUNT));
  // [
  //   '0x8ab1760889f26cbbf33a75fd2cf1696bfccdc9e6', // dhadrien.sismo.eth
  //   '0xa4c94a6091545e40fc9c3e0982aec8942e282f38' // requested wallet auth
  // ]
  console.log(result.getUserIds(AuthType.TELEGRAM));
  // [ '875608110' ] // Telegram id of @dhadrien

  return NextResponse.json(result);
}
