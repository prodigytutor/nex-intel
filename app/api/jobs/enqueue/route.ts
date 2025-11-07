import { prisma } from '@/lib/prisma';
import { json } from '@/lib/http';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { kind, payload } = body as { kind: string; payload: any };
  const job = await prisma.job.create({ data: { kind, payload } });
  return json({ ok: true, id: job.id });
}