import { prisma } from '@/lib/prisma';
import { json } from '@/lib/http';

export async function GET(req: Request, ctx: { params: { id: string } }) {
  const url = new URL(req.url);
  const ids = url.searchParams.getAll('id'); // /citations?id=SRC1&id=SRC2
  if (!ids.length) return json([]);
  const sources = await prisma.source.findMany({ where: { id: { in: ids } } });
  return json(sources);
}