import { NextResponse } from 'next/server';
import { setSettings } from '@/lib/config';
import { makeSearch } from '@/lib/search';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  // optionally accept provider/key overrides for a dry-run test
  await setSettings(body); // temporary set; could be avoided by a special tester
  const sp = await makeSearch();
  try {
    const r = await sp.search('test query', { num: 1, freshnessDays: 365 });
    return NextResponse.json({ ok: true, sample: r?.[0] ?? null });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'error' }, { status: 500 });
  }
}