import { createClient } from '@supabase/supabase-js';
console.log('key', process.env.NEXT_PUBLIC_SUPABASE_PROJECT);
if (
  !process.env.NEXT_PUBLIC_SUPABASE_PROJECT ||
  !process.env.NEXT_PUBLIC_SUPABASE_KEY
) {
  throw new Error(
    'Missing SUPABASE_PROJECT or SUPABASE_KEY environment variable'
  );
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_PROJECT,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
);
