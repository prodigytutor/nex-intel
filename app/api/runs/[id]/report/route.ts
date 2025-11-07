import { prisma } from '@/lib/prisma';
import { json, HttpError } from '@/lib/http';

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const report = await prisma.report.findFirst({
    where: { runId: (await ctx.params).id, format: 'MARKDOWN' },
    orderBy: { createdAt: 'desc' },
  });
  if (!report) throw new HttpError(404, 'Report not ready');
  return json({ headline: report.headline, markdown: report.mdContent, createdAt: report.createdAt });
}