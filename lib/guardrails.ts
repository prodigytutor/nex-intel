import { Source, Finding } from '@/app/generated/prisma/client';

export type QaIssue = {
  findingId?: string;
  level: 'ERROR' | 'WARN';
  code: 'NO_CITATIONS' | 'INSUFFICIENT_CITATIONS_PRICING' | 'STALE_SOURCES' | 'LOW_CONFIDENCE';
  message: string;
  details?: any;
};

const STALE_DAYS = Number(process.env.STALENESS_DAYS ?? 180);

export function isStale(date: Date) {
  const ageMs = Date.now() - date.getTime();
  const days = ageMs / (1000 * 60 * 60 * 24);
  return days > STALE_DAYS;
}

export function isPricingFinding(f: Finding) {
  // Simple heuristic: kind flagged as PRICING or text mentions pricing/fees
  return f.kind === 'PRICING' || /price|pricing|fee|%\s*fee|transaction/i.test(f.text);
}

export function evaluateGuardrails(findings: Finding[], sources: Source[]): QaIssue[] {
  const srcById = new Map(sources.map(s => [s.id, s]));
  const issues: QaIssue[] = [];

  // Staleness warnings across all sources (warn once if > 50% stale)
  const staleCount = sources.filter(s => s.fetchedAt && isStale(new Date(s.fetchedAt))).length;
  if (sources.length > 0 && staleCount / sources.length > 0.5) {
    issues.push({
      level: 'WARN',
      code: 'STALE_SOURCES',
      message: `More than 50% of sources older than ${STALE_DAYS} days (${staleCount}/${sources.length}).`,
    });
  }

  for (const f of findings) {
    const citeCount = f.citations.filter(id => srcById.has(id)).length;

    if (citeCount === 0) {
      issues.push({
        findingId: f.id,
        level: 'ERROR',
        code: 'NO_CITATIONS',
        message: `Finding "${f.text}" has no valid citations.`,
      });
    }

    if (isPricingFinding(f) && citeCount < 2) {
      issues.push({
        findingId: f.id,
        level: 'ERROR',
        code: 'INSUFFICIENT_CITATIONS_PRICING',
        message: `Pricing-related finding "${f.text}" requires ≥ 2 citations (${citeCount} found).`,
      });
    }

    if (f.confidence < 0.5) {
      issues.push({
        findingId: f.id,
        level: 'WARN',
        code: 'LOW_CONFIDENCE',
        message: `Finding "${f.text}" has low confidence (${(f.confidence*100).toFixed(0)}%).`,
      });
    }
  }

  return issues;
}