import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const projectId = url.searchParams.get('projectId') || undefined;
  const status = url.searchParams.get('status') || undefined;
  const q = url.searchParams.get('q') || undefined;
  const from = url.searchParams.get('from') ? new Date(url.searchParams.get('from')!) : undefined;
  const to = url.searchParams.get('to') ? new Date(url.searchParams.get('to')!) : undefined;
  const page = Math.max(1, Number(url.searchParams.get('page') ?? 1));
  const pageSize = Math.min(100, Math.max(10, Number(url.searchParams.get('pageSize') ?? 25)));

  const where: any = {};
  if (projectId) where.projectId = projectId;
  if (status) where.status = status;
  if (from || to) where.createdAt = { gte: from ?? undefined, lte: to ?? undefined };
  if (q) where.id = { contains: q };

  const [rows, total] = await Promise.all([
    prisma.run.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { project: { select: { id: true, name: true } } },
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    prisma.run.count({ where })
  ]);

  return NextResponse.json({ rows, total, page, pageSize });
}