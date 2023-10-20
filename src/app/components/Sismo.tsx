'use client';

import {
  SismoConnectButton,
  SismoConnectResponse,
} from '@sismo-core/sismo-connect-react';

export default function Sismo() {
  return (
    <SismoConnectButton
      config={{
        appId: process.env.NEXT_PUBLIC_SISMO_APP_ID || '',
      }}
      claims={[
        {
          groupId: '0x0f800ff28a426924cbe66b67b9f837e2',
        },
      ]}
      onResponse={(response: SismoConnectResponse) => {
        console.log(response);
      }}
    />
  );
}
