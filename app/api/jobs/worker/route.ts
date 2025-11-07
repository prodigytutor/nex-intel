import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { orchestrateRun } from '@/app/api/runs/orchestrator';

export async function GET(_req: NextRequest) {
  const job = await prisma.job.findFirst({ where: { status: 'PENDING' }, orderBy: { createdAt: 'asc' } });
  if (!job) return NextResponse.json({ ok: true, message: 'no jobs' });
  await prisma.job.update({ where: { id: job.id }, data: { status: 'RUNNING' } });
  try {
    if (job.kind === 'ORCHESTRATE_RUN') {
      await orchestrateRun((job.payload as any).runId);
    }
    await prisma.job.update({ where: { id: job.id }, data: { status: 'DONE' } });
  } catch (e: any) {
    await prisma.job.update({ where: { id: job.id }, data: { status: 'ERROR', lastError: e?.message ?? 'error' } });
  }
  return NextResponse.json({ ok: true, processed: job.id });
}