'use client';

import { Divider, Grid, Typography } from '@mui/material';
import { AuthKitSignInData, Web3AuthModalPack } from '@safe-global/auth-kit';
import { EthHashInfo } from '@safe-global/safe-react-components';
import type { SafeEventEmitterProvider, UserInfo } from '@web3auth/base';
import { useEffect, useState } from 'react';

import { getWeb3AuthModalPack } from '@/lib/safeAuth';

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
      const web3AuthModalPack = await getWeb3AuthModalPack();
      setWeb3AuthModalPack(web3AuthModalPack);
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
          {/* <Grid item md={8} p={4}>
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
          </Grid> */}
        </Grid>
      )}
    </>
  );
}
