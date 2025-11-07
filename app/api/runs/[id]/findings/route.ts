import { prisma } from '@/lib/prisma';
import { json } from '@/lib/http';

export async function GET(_: Request, ctx: { params: { id: string } }) {
  const runId = ctx.params.id;
  const findings = await prisma.finding.findMany({ where: { runId }, orderBy: { kind: 'asc' } });
  return json(findings);
}