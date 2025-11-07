import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import puppeteer from 'puppeteer';
import { marked } from 'marked';

function mdToHtml(md: string) {
  // Convert markdown to HTML using marked
  const html = marked(md, { breaks: true });
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, Helvetica, sans-serif; padding: 40px; line-height: 1.6; max-width: 800px; margin: 0 auto; }
    h1, h2, h3 { margin-top: 1.5em; color: #333; }
    h1 { border-bottom: 2px solid #eee; padding-bottom: 0.3em; }
    ul, ol { margin: 1em 0; padding-left: 2em; }
    li { margin: 0.5em 0; }
    code { background: #f6f8fa; padding: 2px 6px; border-radius: 3px; font-family: monospace; }
    pre { background: #f6f8fa; padding: 16px; border-radius: 6px; overflow-x: auto; }
    blockquote { border-left: 4px solid #ddd; padding-left: 1em; margin: 1em 0; color: #666; }
    a { color: #0366d6; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
${html}
</body>
</html>`;
}

export async function POST(req: Request) {
  try {
    await requireAuth(); // Ensure user is authenticated
    const form = await req.formData();
    const runId = String(form.get('runId') ?? '');
    
    const report = await prisma.report.findFirst({ 
      where: { runId, format: 'MARKDOWN' }, 
      orderBy: { createdAt: 'desc' } 
    });
    if (!report) return new Response('Report not found', { status: 404 });

    const html = mdToHtml(report.mdContent);
    
    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ 
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' }
    });
    await browser.close();

    return new Response(pdf, {
      headers: {
        'content-type': 'application/pdf',
        'content-disposition': `attachment; filename="report-${runId}.pdf"`
      }
    });
  } catch (error: any) {
    console.error('PDF generation error:', error);
    return new Response(`Error generating PDF: ${error.message}`, { status: 500 });
  }
}