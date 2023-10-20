'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { SafeThemeProvider } from '@safe-global/safe-react-components';
import { Loader2 } from 'lucide-react';
import * as React from 'react';

import { supabase } from '@/lib/supabase';

import Connect from '@/app/components/Connect';

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

      const { data: guides, error: error2 } = await supabase
        .from('guides')
        .select('*')
        .eq('city', fetchedCity[0].id);
      if (!guides || !guides[0]) return '404';
      setguide(guides);

      const { data: fetchedCommunities, error: error3 } = await supabase
        .from('community')
        .select('*')
        .eq('city', fetchedCity[0].id);

      const { data: currentFetchedCommunity, error: error4 } = await supabase
        .from('community')
        .select('*')
        .eq('slug', params.community);
      if (!fetchedCommunities || !fetchedCommunities[0]) return '404';
      if (!currentFetchedCommunity || !currentFetchedCommunity[0]) return '404';
      console.log('currentFetchedCommunity', currentFetchedCommunity);
      setcommunity(currentFetchedCommunity[0]);
      setcommunities(fetchedCommunities);
      console.log('error', error);
      console.log('guides', guides);
      if (error) throw error;
      console.log('cities', city);
    } finally {
      setLoading(false);
    }
  };
  return (
    <React.StrictMode>
      <SafeThemeProvider mode='light'>
        {(safeTheme) => (
          <ThemeProvider theme={safeTheme}>
            <CssBaseline />
            <Connect city={city} />
            <div className='m-auto flex w-full max-w-[1200px] p-5'>
              <div className='flex h-full w-full'>
                {loading ? (
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
                    ) : community.nsfw ? (
                      <div className='text-center text-3xl font-bold'>
                        You should be 18+ to see the link
                      </div>
                    ) : (
                      <div className='mt-4 text-center'>
                        <a href={community.url} target='_blank'>
                          {community.url}
                        </a>
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
