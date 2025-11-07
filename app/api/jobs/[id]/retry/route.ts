import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (job.status === 'RUNNING')
    return NextResponse.json({ error: 'Job running' }, { status: 400 });

  // Ensure payload is properly handled for InputJsonValue type compatibility
  const clone = await prisma.job.create({
    data: {
      kind: job.kind,
      payload: job.payload === null ? undefined : job.payload as any, // handles type-input restriction
      status: 'PENDING'
    }
  });
  return NextResponse.json({ ok: true, newJobId: clone.id });
}