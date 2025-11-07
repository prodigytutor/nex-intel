import { NextResponse } from 'next/server';
import { loadSettings, setSettings } from '@/lib/config';

export async function GET() {
  const s = await loadSettings();
  const redacted = { ...s, tavilyKey: s.tavilyKey ? '•••' : '', serpapiKey: s.serpapiKey ? '•••' : '', notionToken: s.notionToken ? '•••' : '' };
  return NextResponse.json(redacted);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  await setSettings(body);
  return NextResponse.json({ ok: true });
}