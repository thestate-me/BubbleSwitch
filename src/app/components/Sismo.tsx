'use client';

import {
  SismoConnectButton,
  SismoConnectResponse,
} from '@sismo-core/sismo-connect-react';

export default function Sismo({
  groupId,
  callback,
}: {
  groupId: string;
  callback: (response: SismoConnectResponse) => void;
}) {
  return (
    <SismoConnectButton
      config={{
        appId: process.env.NEXT_PUBLIC_SISMO_APP_ID || '',
      }}
      claims={[
        {
          groupId,
        },
      ]}
      onResponse={callback}
    />
  );
}
