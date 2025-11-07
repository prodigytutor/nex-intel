type Block = any;

// Extremely simple MD → blocks (H1/H2/H3, list, paragraph)
export function markdownToBlocks(md: string): Block[] {
  const lines = md.split(/\r?\n/);
  const blocks: Block[] = [];
  let listBuffer: string[] = [];

  function flushList() {
    if (!listBuffer.length) return;
    blocks.push({
      object: 'block',
      type: 'bulleted_list',
      bulleted_list: {
        children: listBuffer.map(item => ({
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: { rich_text: [{ type: 'text', text: { content: item } }] }
        }))
      }
    });
    listBuffer = [];
  }

  for (const l of lines) {
    if (/^\s*#\s+/.test(l)) { flushList(); blocks.push(hBlock(1, l.replace(/^#\s+/, ''))); continue; }
    if (/^\s*##\s+/.test(l)) { flushList(); blocks.push(hBlock(2, l.replace(/^##\s+/, ''))); continue; }
    if (/^\s*###\s+/.test(l)) { flushList(); blocks.push(hBlock(3, l.replace(/^###\s+/, ''))); continue; }
    if (/^\s*-\s+/.test(l)) { listBuffer.push(l.replace(/^\s*-\s+/, '')); continue; }
    if (!l.trim()) { flushList(); continue; }
    flushList();
    blocks.push(pBlock(l));
  }
  flushList();
  return blocks;
}

function hBlock(level: number, text: string) {
  const key = level === 1 ? 'heading_1' : level === 2 ? 'heading_2' : 'heading_3';
  return { object: 'block', type: key, [key]: { rich_text: [{ type: 'text', text: { content: text } }] } };
}
function pBlock(text: string) {
  return { object: 'block', type: 'paragraph', paragraph: { rich_text: [{ type: 'text', text: { content: text } }] } };
}