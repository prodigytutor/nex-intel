import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { projectIds } = await req.json();
  if (!Array.isArray(projectIds) || projectIds.length === 0) {
    return NextResponse.json({ error: 'projectIds required' }, { status: 400 });
  }

  // For each project, find the latest run and create a new run for that project.
  const latestByProject = await prisma.run.groupBy({
    by: ['projectId'],
    where: { projectId: { in: projectIds } },
    _max: { createdAt: true }
  });

  const projectsWithLatest = latestByProject.map(g => g.projectId);
  if (projectsWithLatest.length === 0) {
    return NextResponse.json({ ok: true, started: [], missing: projectIds });
  }

  const newRuns = await prisma.$transaction(
    projectsWithLatest.map(projectId => prisma.run.create({ data: { projectId, status: 'NEW' } }))
  );
  await prisma.$transaction(
    newRuns.map(r => prisma.job.create({ data: { kind: 'ORCHESTRATE_RUN', payload: { runId: r.id } } }))
  );

  const started = newRuns.map(r => r.projectId);
  const missing = projectIds.filter((id: string) => !started.includes(id));
  return NextResponse.json({ ok: true, startedRuns: newRuns.map(r => r.id), missing });
}