'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { SafeThemeProvider } from '@safe-global/safe-react-components';
import { Loader2 } from 'lucide-react';
import * as React from 'react';

import { supabase } from '@/lib/supabase';

import CommunityCard from '@/components/ui/CommunityCard';
import GuideCard from '@/components/ui/GuideCard';

import Connect from '@/app/components/Connect';

export default function Page({ params }: { params: { city: string } }) {
  const [loading, setLoading] = React.useState(true);
  const [city, setCity] = React.useState([] as any);
  const [guide, setguide] = React.useState([] as any);
  const [communities, setcommunities] = React.useState([] as any);
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
      // if (!guides || !guides[0]) return '404';
      setguide(guides);

      const { data: fetchedCommunities, error: error3 } = await supabase
        .from('community')
        .select('*')
        .eq('city', fetchedCity[0].id);
      console.log('fetchedCommunities', fetchedCommunities);
      if (!fetchedCommunities || !fetchedCommunities[0]) return '404';
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
            {city && city.slug && !loading ? (
              <div className='m-auto flex w-full max-w-[1200px] p-5'>
                {/* <PlaceMap initLat={city.lat} initLng={city.lng} /> */}
                <div className='flex h-full w-full'>
                  {loading ? (
                    <div className='flex h-full w-full items-center justify-center'>
                      <Loader2 className='mr-2 mt-20 h-10 w-10 animate-spin' />
                    </div>
                  ) : (
                    <div className='flex w-full flex-col'>
                      {guide.length ? (
                        <div>
                          <h1 className='pb-4 text-center text-5xl font-bold'>
                            Guides
                          </h1>
                          <div className='grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3'>
                            {guide.map((item: any) => (
                              <GuideCard
                                key={item.id}
                                guide={item}
                                city={city}
                              />
                              // <div
                              //   key={item.id}
                              //   className='m-2 rounded-md border-2 border-gray-100 bg-[#D7E86C] p-2'
                              // >
                              //   <a href={`${city.slug}/guide/${item.slug}`}>
                              //     <h2 className='text-xl font-bold'>
                              //       {item.name}
                              //     </h2>
                              //     <p>{item.desc}</p>
                              //   </a>
                              // </div>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {communities.length ? (
                        <div>
                          <h1 className='pb-4 text-center text-5xl font-bold'>
                            Communities
                          </h1>
                          <div className='grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3'>
                            {communities.map((item: any) => (
                              <CommunityCard
                                key={item.id}
                                community={item}
                                city={city}
                              />
                              // <div
                              //   key={item.id}
                              //   className='m-2 rounded-md border-2 border-gray-100 bg-[#D7E86C] p-2'
                              // >
                              //   <a href={`${city.slug}/community/${item.slug}`}>
                              //     <h2 className='text-xl font-bold'>
                              //       {item.name}
                              //     </h2>
                              //     <p>{item.desc}</p>
                              //   </a>
                              // </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              !loading && (
                <div className='m-auto flex w-full max-w-[1200px] p-5'>
                  <div className='flex h-full w-full'>
                    <div className='flex h-full w-full items-center justify-center'>
                      <h1 className='text-center text-5xl font-bold'>404</h1>
                    </div>
                  </div>
                </div>
              )
            )}
          </ThemeProvider>
        )}
      </SafeThemeProvider>
    </React.StrictMode>
  );
}
