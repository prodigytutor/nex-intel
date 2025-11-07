import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const prior = await prisma.run.findUnique({ where: { id } });
  if (!prior) return NextResponse.json({ error: 'Run not found' }, { status: 404 });

  const run = await prisma.run.create({ data: { projectId: prior.projectId, status: 'NEW' } });
  await prisma.job.create({ data: { kind: 'ORCHESTRATE_RUN', payload: { runId: run.id } } });
  return NextResponse.json({ ok: true, runId: run.id });
}