'use client';

import {
  AuthType,
  ClaimType,
  SismoConnectButton,
  SismoConnectResponse,
} from '@sismo-core/sismo-connect-react';

export default function Sismo() {
  return (
    <SismoConnectButton
      config={{
        appId: process.env.NEXT_PUBLIC_SISMO_APP_ID || '',
        vault: {
          // For development purposes insert the Data Sources that you want to impersonate here
          // Never use this in production
          impersonate: [
            // EVM
            'leo21.sismo.eth',
            '0xA4C94A6091545e40fc9c3E0982AEc8942E282F38',
            '0x1b9424ed517f7700e7368e34a9743295a225d889',
            '0x82fbed074f62386ed43bb816f748e8817bf46ff7',
            '0xc281bd4db5bf94f02a8525dca954db3895685700',
            // Github
            'github:leo21',
            // Twitter
            'twitter:leo21_eth',
            // Telegram
            'telegram:leo21',
          ],
        },
      }}
      auths={[{ authType: AuthType.GITHUB }]}
      claims={[
        {
          groupId: '0x1cde61966decb8600dfd0749bd371f12',
          value: 15,
          claimType: ClaimType.GTE,
        },
      ]}
      onResponse={(response: SismoConnectResponse) => {
        console.log(response);
      }}
    />
  );
}
