'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { SafeThemeProvider } from '@safe-global/safe-react-components';
import { Loader2 } from 'lucide-react';
import * as React from 'react';

import { supabase } from '@/lib/supabase';

import CityCard from '@/components/ui/CityCard';

import Connect from '@/app/components/Connect';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.
export default function HomePage() {
  const [loading, setLoading] = React.useState(true);
  const [cities, setCities] = React.useState([] as any);
  React.useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      setLoading(true);
      console.log('supabase', supabase);
      const { data: cities, error } = await supabase.from('cities').select('*');
      // .eq("user_id", user?.id);
      console.log('error', error);
      if (error) throw error;
      setCities(cities);
      console.log('cities', cities);
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
            <Connect />

            <div className='m-auto flex w-full max-w-[1200px] p-5'>
              <div className='flex h-full w-full'>
                {loading ? (
                  <div className='flex h-full w-full items-center justify-center'>
                    <Loader2 className='mr-2 mt-20 h-10 w-10 animate-spin' />
                  </div>
                ) : (
                  <div className='flex w-full flex-col'>
                    {cities.map((city: any) => (
                      <CityCard key={city.id} city={city} />
                    ))}
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
