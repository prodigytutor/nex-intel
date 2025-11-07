import { prisma } from '@/lib/prisma';
import { json } from '@/lib/http';

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const runId = (await ctx.params).id;
  const sources = await prisma.source.findMany({ where: { runId }, orderBy: { fetchedAt: 'desc' } });
  return json(sources);
}