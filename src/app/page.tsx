'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { SafeThemeProvider } from '@safe-global/safe-react-components';
import * as React from 'react';

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
  return (
    <React.StrictMode>
      <SafeThemeProvider mode='light'>
        {(safeTheme) => (
          <ThemeProvider theme={safeTheme}>
            <CssBaseline />
            <Connect />
          </ThemeProvider>
        )}
      </SafeThemeProvider>
    </React.StrictMode>
  );
}
