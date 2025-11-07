import { prisma } from '@/lib/prisma';
import { json } from '@/lib/http';

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const body = await req.json().catch(() => ({}));
  const { approved = true, notes } = body as { approved?: boolean; notes?: string };
  const f = await prisma.finding.update({
    where: { id: (await ctx.params).id },
    data: { approved, notes }
  });
  return json(f);
}