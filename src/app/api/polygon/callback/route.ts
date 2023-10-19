import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  console.log(await req.text());
  return NextResponse.json({});
}

export async function GET(req: Request) {
  console.log(await req.text());
  return NextResponse.json({});
}
