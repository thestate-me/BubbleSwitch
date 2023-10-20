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
          groupId: '0xab882512e97b60cb2295a1c190c47569',
        },
      ]}
      onResponse={(response: SismoConnectResponse) => {
        console.log(response);
      }}
    />
  );
}
