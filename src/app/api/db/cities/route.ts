// import type { NextApiRequest, NextApiResponse } from 'next';

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   console.log(process.env);
//   res.status(200).json({ is_available: true, dt: new Date().toISOString() });
// }

import { NextResponse } from 'next/server';

import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase.from('cities').select('*');
  if (error) {
    console.log(error);
    return NextResponse.json({ error });
  }
  return NextResponse.json({ data });
}
