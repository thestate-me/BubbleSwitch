'use client';

import { SismoConnectResponse } from '@sismo-core/sismo-connect-react';
import * as React from 'react';

import Sismo from '@/app/components/Sismo';

export default function HomePage() {
  return (
    <Sismo
      groupId='0x0f800ff28a426924cbe66b67b9f837e2'
      callback={(response: SismoConnectResponse) => {
        console.log(response);
      }}
    ></Sismo>
  );
}
