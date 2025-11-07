'use client';
import { useEffect, useMemo, useState } from 'react';

type Finding = { id: string; kind: string; text: string; citations: string[]; confidence: number; approved: boolean; notes?: string | null };
type Source = { id: string; url: string; title?: string | null; domain?: string | null; fetchedAt: string };

export default function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const [runId, setRunId] = useState<string | null>(null);
  useEffect(() => {
    async function setRunIdAsync() {
      setRunId((await params).id);
    }
    setRunIdAsync();
  }, [params]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [saving, setSaving] = useState(false);
  const [rebuilding, setRebuilding] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/runs/${runId}/findings`).then(r => r.json()),
      fetch(`/api/runs/${runId}/citations?id=all`).then(async r => {
        // We didn't define id=all; fetch sources directly:
        if (!r.ok) return fetch(`/api/runs/${runId}/status`).then(() => fetch(`/api/runs/${runId}/sources`).then(r2 => r2.json()).catch(() => []));
        return r.json();
      })
    ]).then(([fds, srcs]) => {
      setFindings(fds);
      if (Array.isArray(srcs) && srcs.length) setSources(srcs);
      else fetch(`/api/runs/${runId}/sources`).then(r => r.json()).then(setSources);
    }).catch(() => {});
  }, [runId]);

  // helper: write-only API for sources
  async function loadSources() {
    const s = await fetch(`/api/runs/${runId}/sources`).then(r => r.json());
    setSources(s);
  }

  async function toggleApprove(f: Finding, approved: boolean) {
    setSaving(true);
    await fetch(`/api/findings/${f.id}/approve`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ approved })
    });
    setFindings(prev => prev.map(x => x.id === f.id ? { ...x, approved } : x));
    setSaving(false);
  }

  async function setCitations(f: Finding, citationIds: string[]) {
    setSaving(true);
    await fetch(`/api/findings/${f.id}/citations`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ citations: citationIds })
    });
    setFindings(prev => prev.map(x => x.id === f.id ? { ...x, citations: citationIds } : x));
    setSaving(false);
  }

  async function rebuild() {
    setRebuilding(true);
    await fetch(`/api/runs/${runId}/rebuild-report`, { method: 'POST' });
    setRebuilding(false);
    alert('Report rebuilt and run marked COMPLETE.');
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Review Findings</h1>
      <div className="text-sm text-gray-600 mt-1">Run {runId}</div>

      <section className="mt-6 grid gap-4">
        {findings.map(f => (
          <div key={f.id} className="border rounded p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-500">{f.kind}</div>
                <div className="font-medium">{f.text}</div>
                <div className="text-[11px] text-gray-500 mt-1">Confidence: {(f.confidence*100).toFixed(0)}%</div>
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={f.approved} onChange={e => toggleApprove(f, e.target.checked)} />
                <span className="text-sm">Approved</span>
              </label>
            </div>
            <div className="mt-3">
              <div className="text-xs text-gray-600">Citations</div>
              <div className="flex flex-wrap gap-2 mt-2">
                {sources.map(s => {
                  const checked = f.citations.includes(s.id);
                  return (
                    <div>
                    <span className={`badge ${f.kind === 'GAP' ? 'bg-amber-100 text-amber-800' : f.kind === 'DIFFERENTIATOR' ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'}`}>
  {f.kind}
</span>
<span className="text-xs text-gray-500">{f.citations.length} cites</span>
                    <label key={s.id} className={`text-xs border px-2 py-1 rounded cursor-pointer ${checked ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'}`}>
                      <input
                        className="mr-1"
                        type="checkbox"
                        checked={checked}
                        onChange={e => {
                          const next = new Set(f.citations);
                          if (e.target.checked) next.add(s.id); else next.delete(s.id);
                          setCitations(f, Array.from(next));
                        }}
                      />
                      {s.title ?? s.url}
                    </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </section>

      <div className="mt-6 flex gap-3">
        <button disabled={saving || rebuilding} onClick={rebuild} className="px-3 py-2 border rounded bg-black text-white">
          {rebuilding ? 'Rebuilding…' : 'Rebuild Report from Approved'}
        </button>
        <button className="px-3 py-2 border rounded" onClick={loadSources}>Reload Sources</button>
      </div>
    </main>
  );
}