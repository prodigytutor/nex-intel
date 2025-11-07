import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

export async function fetchHtml(url: string) {
  const res = await fetch(url, { redirect: 'follow' as any });
  if (!res.ok) throw new Error(`Fetch failed ${res.status} for ${url}`);
  const html = await res.text();
  const $ = cheerio.load(html);
  const title = $('title').first().text().trim();
  const text = $('body').text().replace(/\s+/g, ' ').trim();
  return { title, text, html };
}

export function extractDomain(url: string) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return undefined; }
}