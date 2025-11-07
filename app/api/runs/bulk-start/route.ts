import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { projectIds } = await req.json();
  if (!Array.isArray(projectIds) || projectIds.length === 0) {
    return NextResponse.json({ error: 'projectIds required' }, { status: 400 });
  }

  const projects = await prisma.project.findMany({ where: { id: { in: projectIds } } });
  const idSet = new Set(projects.map(p => p.id));

  const runs = await prisma.$transaction(
    projects.map(p => prisma.run.create({ data: { projectId: p.id, status: 'NEW' } }))
  );

  await prisma.$transaction(
    runs.map(r => prisma.job.create({ data: { kind: 'ORCHESTRATE_RUN', payload: { runId: r.id } } }))
  );

  return NextResponse.json({
    ok: true,
    started: runs.map(r => r.id),
    missing: projectIds.filter((id: string) => !idSet.has(id))
  });
}