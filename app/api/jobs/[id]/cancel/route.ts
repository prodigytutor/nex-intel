import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (job.status !== 'PENDING') return NextResponse.json({ error: 'Only pending jobs can be cancelled' }, { status: 400 });
  await prisma.job.update({ where: { id: job.id }, data: { status: 'SKIPPED' } });
  return NextResponse.json({ ok: true });
}