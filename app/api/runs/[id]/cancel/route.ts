import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const run = await prisma.run.findUnique({ where: { id } });
  if (!run) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (['COMPLETE','QA','ERROR'].includes(run.status)) {
    return NextResponse.json({ error: 'Cannot cancel at this stage' }, { status: 400 });
  }
  await prisma.run.update({ where: { id: run.id }, data: { status: 'SKIPPED', completedAt: new Date() } });
  return NextResponse.json({ ok: true });
}