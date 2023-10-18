'use client';

import { Box, Divider, Grid, Typography } from '@mui/material';
import {
  AuthKitSignInData,
  Web3AuthConfig,
  Web3AuthEventListener,
  Web3AuthModalPack,
} from '@safe-global/auth-kit';
import { EthHashInfo } from '@safe-global/safe-react-components';
import type { SafeEventEmitterProvider, UserInfo } from '@web3auth/base';
import {
  ADAPTER_EVENTS,
  CHAIN_NAMESPACES,
  WALLET_ADAPTERS,
} from '@web3auth/base';
import { Web3AuthOptions } from '@web3auth/modal';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { useEffect, useState } from 'react';

import AppBar from '@/app/components/AppBar';

export default function Connect() {
  const [web3AuthModalPack, setWeb3AuthModalPack] =
    useState<Web3AuthModalPack>();
  const [safeAuthSignInResponse, setSafeAuthSignInResponse] =
    useState<AuthKitSignInData | null>(null);
  const [userInfo, setUserInfo] = useState<Partial<UserInfo>>();
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );

  useEffect(() => {
    (async () => {
      // https://web3auth.io/docs/sdk/pnp/web/modal/initialize#arguments
      const options: Web3AuthOptions = {
        clientId: process.env.NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID || '', // https://dashboard.web3auth.io/
        web3AuthNetwork:
          process.env.NEXT_PUBLIC_WEB3_AUTH_NETWORK == 'mainnet'
            ? 'mainnet'
            : 'testnet',
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: process.env.NEXT_PUBLIC_NETWORK_ID || '0x13881',
          rpcTarget:
            process.env.NEXT_PUBLIC_RPC_URL ||
            'https://polygon-mumbai-bor.publicnode.com',
        },
        uiConfig: {
          theme: 'dark',
          loginMethodsOrder: ['google', 'facebook'],
        },
      };

      // https://web3auth.io/docs/sdk/pnp/web/modal/initialize#configuring-adapters
      const modalConfig = {
        [WALLET_ADAPTERS.TORUS_EVM]: {
          label: 'torus',
          showOnModal: false,
        },
        [WALLET_ADAPTERS.METAMASK]: {
          label: 'metamask',
          showOnDesktop: true,
          showOnMobile: false,
        },
      };

      // https://web3auth.io/docs/sdk/pnp/web/modal/whitelabel#whitelabeling-while-modal-initialization
      const openloginAdapter = new OpenloginAdapter({
        loginSettings: {
          mfaLevel: 'mandatory',
        },
        adapterSettings: {
          uxMode: 'popup',
          whiteLabel: {
            name: 'Safe',
          },
        },
      });

      const web3AuthConfig: Web3AuthConfig = {
        txServiceUrl: process.env.NEXT_PUBLIC_WEB3_AUTH_TX_SERVICES,
      };

      const connectedHandler: Web3AuthEventListener = (data) =>
        console.log('CONNECTED', data);
      const disconnectedHandler: Web3AuthEventListener = (data) =>
        console.log('DISCONNECTED', data);

      // Instantiate and initialize the pack
      const web3AuthModalPack = new Web3AuthModalPack(web3AuthConfig);

      await web3AuthModalPack.init({
        options,
        adapters: [openloginAdapter],
        modalConfig,
      });

      web3AuthModalPack.subscribe(ADAPTER_EVENTS.CONNECTED, connectedHandler);
      web3AuthModalPack.subscribe(
        ADAPTER_EVENTS.DISCONNECTED,
        disconnectedHandler
      );

      setWeb3AuthModalPack(web3AuthModalPack);

      return () => {
        web3AuthModalPack.unsubscribe(
          ADAPTER_EVENTS.CONNECTED,
          connectedHandler
        );
        web3AuthModalPack.unsubscribe(
          ADAPTER_EVENTS.DISCONNECTED,
          disconnectedHandler
        );
      };
    })();
  }, []);

  const login = async () => {
    if (!web3AuthModalPack) return;

    const signInInfo = await web3AuthModalPack.signIn();
    console.log('SIGN IN RESPONSE: ', signInInfo);

    const userInfo = await web3AuthModalPack.getUserInfo();
    console.log('USER INFO: ', userInfo);

    setSafeAuthSignInResponse(signInInfo);
    setUserInfo(userInfo || undefined);
    setProvider(web3AuthModalPack.getProvider() as SafeEventEmitterProvider);
  };

  const logout = async () => {
    if (!web3AuthModalPack) return;

    await web3AuthModalPack.signOut();

    setProvider(null);
    setSafeAuthSignInResponse(null);
  };

  useEffect(() => {
    if (web3AuthModalPack && web3AuthModalPack.getProvider()) {
      (async () => {
        await login();
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3AuthModalPack]);

  return (
    <>
      <AppBar
        onLogin={login}
        onLogout={logout}
        userInfo={userInfo}
        isLoggedIn={!!provider}
      />
      {safeAuthSignInResponse?.eoa && (
        <Grid container>
          <Grid item md={4} p={4}>
            <Typography variant='h3' color='secondary' fontWeight={700}>
              Owner account
            </Typography>
            <Divider sx={{ my: 3 }} />
            <EthHashInfo
              address={safeAuthSignInResponse.eoa}
              showCopyButton
              showPrefix
              prefix='eth'
            />
          </Grid>
          <Grid item md={8} p={4}>
            <>
              <Typography variant='h3' color='secondary' fontWeight={700}>
                Available Safes
              </Typography>
              <Divider sx={{ my: 3 }} />
              {safeAuthSignInResponse?.safes?.length ? (
                safeAuthSignInResponse?.safes?.map((safe, index) => (
                  <Box sx={{ my: 3 }} key={index}>
                    <EthHashInfo
                      address={safe}
                      showCopyButton
                      shortAddress={false}
                    />
                  </Box>
                ))
              ) : (
                <Typography variant='body1' color='secondary' fontWeight={700}>
                  No Available Safes
                </Typography>
              )}
            </>
          </Grid>
        </Grid>
      )}
    </>
  );
}
