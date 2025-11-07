import { prisma } from '@/lib/prisma';
import { createNotionPageFromMarkdown } from '@/lib/notion';
import { json } from '@/lib/http';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { runId, parentPageId = process.env.NOTION_PARENT_PAGE_ID } = body as { runId: string; parentPageId?: string };
  if (!runId) return json({ error: 'runId required' }, { status: 400 });
  if (!process.env.NOTION_TOKEN || !parentPageId) return json({ error: 'Notion not configured' }, { status: 400 });

  const report = await prisma.report.findFirst({
    where: { runId, format: 'MARKDOWN' },
    orderBy: { createdAt: 'desc' }
  });
  if (!report) return json({ error: 'Report not found' }, { status: 404 });

  const created = await createNotionPageFromMarkdown({
    token: process.env.NOTION_TOKEN!,
    parentPageId,
    title: report.headline,
    markdown: report.mdContent
  });

  // Log as a new report artifact
  await prisma.report.create({
    data: {
      projectId: report.projectId,
      runId,
      headline: `${report.headline} (Notion)`,
      mdContent: `Exported to Notion page: ${created.url ?? created.id}`,
      format: 'NOTION',
      approved: true
    }
  });

  return json({ ok: true, notion: created });
}