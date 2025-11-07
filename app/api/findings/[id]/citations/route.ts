import { prisma } from '@/lib/prisma';
import { json } from '@/lib/http';
import { z } from 'zod';

const schema = z.object({ citations: z.array(z.string()).min(1) });

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const body = await req.json().catch(() => ({}));
  const { citations } = schema.parse(body);
  const f = await prisma.finding.update({
    where: { id: (await ctx.params).id },
    data: { citations }
  });
  return json(f);
}