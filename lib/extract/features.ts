import { normalizeFeature } from '../normalize';

const CANON_HINTS: Record<string, string[]> = {
  'Fast checkout': ['1-click checkout','1 tap checkout','instant checkout'],
  '1:1 bookings': ['booking','appointments','schedule','calendar'],
  'Course builder': ['courses','lessons','curriculum','modules'],
  'Email automation': ['email automations','drip','sequences','broadcasts'],
  'Memberships': ['memberships','subscriptions','paywalled'],
  'Tips/Donations': ['tips','donations','support me'],
  'Media kit': ['media kit','press kit','brand deals'],
  'Analytics': ['analytics','dashboard','insights','metrics'],
};

export function extractFeatures(text: string): Array<{ name: string; normalized: string }> {
  const found = new Map<string, { name: string; normalized: string }>();
  const lower = text.toLowerCase();

  for (const [canon, hints] of Object.entries(CANON_HINTS)) {
    for (const h of hints) {
      if (lower.includes(h.toLowerCase())) {
        const normalized = canon;
        const name = h;
        found.set(h, { name, normalized });
        break;
      }
    }
  }
  // Also pick proper nouns with “Feature” phrase
  const re = /\b([A-Z][A-Za-z0-9\-\s]{2,18})\s+(feature|tool|module)\b/g;
  const extras = new Set<string>();
  let m;
  while ((m = re.exec(text)) !== null) {
    extras.add(m[1].trim());
  }
  for (const e of extras) {
    found.set(e, { name: e, normalized: normalizeFeature(e) });
  }
  return Array.from(found.values());
}