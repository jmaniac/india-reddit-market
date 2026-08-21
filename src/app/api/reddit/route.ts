import { NextRequest, NextResponse } from 'next/server';

const VALID_PATH = /^\/r\/[\w_]+\/(new|hot|search)\.json/;

export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get('path');

  if (!path || !VALID_PATH.test(path)) {
    return NextResponse.json({ error: 'invalid path' }, { status: 400 });
  }

  const url = `https://www.reddit.com${path}`;

  try {
    const resp = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 IndiaRedditMarket/1.0 (personal, non-commercial browser app)',
        Accept: 'application/json',
      },
      next: { revalidate: 120 },
    });

    if (!resp.ok) {
      return NextResponse.json({ error: `Reddit responded ${resp.status}` }, { status: resp.status });
    }

    const data = await resp.json();
    return NextResponse.json(data, { headers: { 'Cache-Control': 'public, max-age=120' } });
  } catch (err) {
    console.error('[reddit proxy]', err);
    return NextResponse.json({ error: 'upstream failed' }, { status: 502 });
  }
}