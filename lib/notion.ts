import { markdownToBlocks } from './notion_blocks';
const NOTION_API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

export async function createNotionPageFromMarkdown({
  token, parentPageId, title, markdown
}: { token: string; parentPageId: string; title: string; markdown: string }) {
  const children = markdownToBlocks(markdown);
  const res = await fetch(`${NOTION_API}/pages`, {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${token}`,
      'content-type': 'application/json',
      'Notion-Version': NOTION_VERSION
    },
    body: JSON.stringify({
      parent: { page_id: parentPageId },
      properties: { title: { title: [{ type: 'text', text: { content: title } }] } },
      children
    })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}