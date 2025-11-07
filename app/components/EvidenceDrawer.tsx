'use client';
import { useEffect, useState } from 'react';

type Source = { id: string; url: string; title?: string | null; domain?: string | null };

export function EvidenceDrawer({
  open, onClose, citationIds
}: { open: boolean; onClose: () => void; citationIds: string[] }) {
  const [sources, setSources] = useState<Source[]>([]);
  useEffect(() => {
    if (!open || citationIds.length === 0) return;
    const params = citationIds.map(id => `id=${encodeURIComponent(id)}`).join('&');
    fetch(`/api/runs/${'dummy'}/citations?${params}`.replace('dummy', '')) // runId not needed for this route; kept path
      .then(r => r.json())
      .then(setSources)
      .catch(() => setSources([]));
  }, [open, citationIds]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose}>
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl p-6 overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Citations</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-black">✕</button>
        </div>
        <ul className="mt-4 space-y-3">
          {sources.length === 0 && <li className="text-sm text-gray-500">No sources linked.</li>}
          {sources.map(s => (
            <li key={s.id} className="text-sm">
              <a className="text-blue-600 underline break-words" href={s.url} target="_blank" rel="noreferrer">
                {s.title ?? s.url}
              </a>
              {s.domain ? <div className="text-xs text-gray-500">{s.domain}</div> : null}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}