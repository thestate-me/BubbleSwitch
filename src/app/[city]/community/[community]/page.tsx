'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { SafeThemeProvider } from '@safe-global/safe-react-components';
import { SismoConnectResponse } from '@sismo-core/sismo-connect-react';
import { Loader2 } from 'lucide-react';
import * as React from 'react';

import { supabase } from '@/lib/supabase';

import Connect from '@/app/components/Connect';
import QrNSFW from '@/app/components/PolygonNSFW';
import Sismo from '@/app/components/Sismo';
import Ticket from '@/app/components/Ticket';

export default function Page({
  params,
}: {
  params: { city: string; community: string };
}) {
  const [loading, setLoading] = React.useState(false);
  const [city, setCity] = React.useState([] as any);
  const [guide, setguide] = React.useState([] as any);
  const [communities, setcommunities] = React.useState([] as any);
  const [community, setcommunity] = React.useState([] as any);
  React.useEffect(() => {
    if (!params.city) return;
    fetchCities();
  }, [params.city]);

  const fetchCities = async () => {
    try {
      console.log(params.city);
      setLoading(true);
      const { data: fetchedCity, error } = await supabase
        .from('cities')
        .select('*')
        .eq('slug', params.city);
      if (!city || !fetchedCity || !fetchedCity[0].id) return '404';
      setCity(fetchedCity[0]);
      console.log(fetchedCity);

      // setguide(guides);

      const { data: fetchedCommunities, error: error3 } = await supabase
        .from('community')
        .select('*')
        .eq('city', fetchedCity[0].id);

      const { data: currentFetchedCommunity, error: error4 } = await supabase
        .from('community')
        .select('*')
        .eq('slug', params.community);
      console.log('currentFetchedCommunity', currentFetchedCommunity);
      console.log('error4', error4);
      if (!fetchedCommunities || !fetchedCommunities[0]) return '404';
      if (!currentFetchedCommunity || !currentFetchedCommunity[0]) return '404';
      console.log('currentFetchedCommunity', currentFetchedCommunity);
      setcommunity(currentFetchedCommunity[0]);
      setcommunities(fetchedCommunities);
      console.log('error', error);
      if (error) throw error;
      console.log('cities', city);
    } finally {
      setLoading(false);
    }
  };
  const [userAddress, setuserAddress] = React.useState([] as any);
  React.useEffect(() => {
    const addr = localStorage.getItem('userAddress');
    if (addr) setuserAddress(addr);
  }, []);
  const [allowLink, setallowLink] = React.useState(false);
  return (
    <React.StrictMode>
      <SafeThemeProvider mode='light'>
        {(safeTheme) => (
          <ThemeProvider theme={safeTheme}>
            <CssBaseline />
            <Connect city={city} />
            <div className='m-auto flex w-full max-w-[1200px] p-5'>
              <div className='flex h-full w-full'>
                {loading && !community.name ? (
                  <div className='flex h-full w-full items-center justify-center'>
                    <Loader2 className='mr-2 mt-20 h-10 w-10 animate-spin' />
                  </div>
                ) : (
                  <div className='flex w-full flex-col pt-5 text-center'>
                    <h1 className='text-center text-3xl font-bold'>
                      {community.name}
                    </h1>
                    <div className='text-1xl text-center font-bold'>
                      {community.desc}
                    </div>
                    {/* link  */}
                    {community.isPaid ? (
                      <div className='text-center text-3xl font-bold'>
                        You should buy subscription to see the link
                      </div>
                    ) : community.sismo_group && !allowLink ? (
                      <div className='mt-5 flex flex-col text-center text-3xl font-bold'>
                        You should verify your identity to see the link
                        <div className='m-auto mt-5 max-w-[300px]'>
                          {userAddress ? (
                            <Sismo
                              groupId={community.sismo_group}
                              callback={async (
                                response: SismoConnectResponse
                              ) => {
                                const res = await fetch(`/api/sismo/verify`, {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    communityId: community.id,
                                    sismo: response,
                                  }),
                                }).then((res) => res.json());
                                if (res && res.result === 'success')
                                  setallowLink(true);

                                console.log(response);
                              }}
                            />
                          ) : (
                            'Login first'
                          )}
                        </div>
                      </div>
                    ) : allowLink ? (
                      <div className='mt-4 text-center'>
                        Great! Here is the link!
                        <Ticket url={community.url} />
                      </div>
                    ) : community.nsfw ? (
                      <div className='text-center text-3xl font-bold'>
                        You should be 18+ to see the link
                        {/* // TODO: прокинь сюда юзера  */}
                        {/* eslint-disable-next-line no-constant-condition */}
                        <div>
                          {userAddress ? (
                            <QrNSFW userAddr={userAddress} />
                          ) : (
                            'Login first'
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className='mt-4 text-center'>
                        {/* <a href={community.url} target='_blank'>
                          {community.url}
                        </a> */}
                        <Ticket url={community.url} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </ThemeProvider>
        )}
      </SafeThemeProvider>
    </React.StrictMode>
  );
}
