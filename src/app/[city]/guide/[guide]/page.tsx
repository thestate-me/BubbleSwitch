'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { SafeThemeProvider } from '@safe-global/safe-react-components';
import { Loader2 } from 'lucide-react';
import * as React from 'react';
import ReactMarkdown from 'react-markdown';

import { supabase } from '@/lib/supabase';

import Connect from '@/app/components/Connect';

export default function Page({
  params,
}: {
  params: { city: string; guide: string };
}) {
  const [loading, setLoading] = React.useState(false);
  const [city, setCity] = React.useState([] as any);
  const [currentguide, setcurrentguide] = React.useState([] as any);
  const [communities, setcommunities] = React.useState([] as any);
  React.useEffect(() => {
    if (!params.city) return;
    fetchCities();
  }, [params.city]);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const { data: fetchedCity, error } = await supabase
        .from('cities')
        .select('*')
        .eq('slug', params.city);
      if (!city || !fetchedCity || !fetchedCity[0].id) return '404';
      setCity(fetchedCity[0]);
      console.log(fetchedCity);

      const { data: fetchedGuide, error: error2 } = await supabase
        .from('guides')
        .select('*')
        .eq('slug', params.guide);
      if (!fetchedGuide || !fetchedGuide[0]) return '404';
      setcurrentguide(fetchedGuide[0]);
      console.log(fetchedGuide);

      const { data: fetchedCommunities, error: error3 } = await supabase
        .from('community')
        .select('*')
        .eq('city', fetchedCity[0].id);
      if (!fetchedCommunities || !fetchedCommunities[0]) return '404';
      setcommunities(fetchedCommunities);
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
                  <div className='flex w-full flex-col'>
                    {/* <a href={`/${city.slug}`}>
                      <span className='text-left font-bold underline'>
                        {city.name}
                      </span>
                    </a> */}
                    <h1 className='text-left text-5xl font-bold'>
                      {currentguide.name}
                    </h1>
                    <ReactMarkdown className='prose max-w-fullc mt-4'>
                      {currentguide.body}
                    </ReactMarkdown>
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
