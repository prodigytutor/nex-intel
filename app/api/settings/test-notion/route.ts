import { NextResponse } from 'next/server';
import { loadSettings, setSettings } from '@/lib/config';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  await setSettings(body);
  const s = await loadSettings();
  if (!s.notionToken || !s.notionParentPageId) {
    return NextResponse.json({ ok: false, error: 'Missing Notion token or parent page id' }, { status: 400 });
  }
  const res = await fetch(`https://api.notion.com/v1/pages/${s.notionParentPageId}`, {
    headers: {
      Authorization: `Bearer ${s.notionToken}`,
      'Notion-Version': '2022-06-28'
    }
  });
  if (!res.ok) return NextResponse.json({ ok: false, status: res.status, body: await res.text() }, { status: 500 });
  const json = await res.json();
  return NextResponse.json({ ok: true, title: json.properties?.title ?? json.object });
}