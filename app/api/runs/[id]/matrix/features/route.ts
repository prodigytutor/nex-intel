import { prisma } from '@/lib/prisma';

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const runId = (await ctx.params).id;
  const [competitors, features] = await Promise.all([
    prisma.competitor.findMany({ where: { runId } }),
    prisma.feature.findMany({ where: { runId } }),
  ]);

  // Simple CSV: feature rows, competitor columns (presence=1)
  const header = ['Feature', ...competitors.map(c => c.name)].join(',');
  const rows = features.map(f => {
    const presence = competitors.map(() => Math.random() > 0.5 ? '1' : '0'); // placeholder until extractor
    return [f.normalized, ...presence].join(',');
  });
  const csv = [header, ...rows].join('\n');
  return new Response(csv, { headers: { 'content-type': 'text/csv' } });
}