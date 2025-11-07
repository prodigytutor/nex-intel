import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get('status') || undefined;
  const where = status ? { status } : {};
  const jobs = await prisma.job.findMany({ where, orderBy: { createdAt: 'desc' }, take: 200 });
  return NextResponse.json(jobs);
}