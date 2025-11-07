'use client';
import { useEffect, useState } from 'react';

type Job = { id: string; kind: string; status: string; createdAt: string; updatedAt: string; lastError?: string | null; payload: any };

export default function JobsPage() {
  const [rows, setRows] = useState<Job[]>([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const params = status ? `?status=${encodeURIComponent(status)}` : '';
    const data = await fetch(`/api/jobs/list${params}`).then(r => r.json());
    setRows(data);
    setLoading(false);
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [status]);

  async function retry(id: string) {
    await fetch(`/api/jobs/${id}/retry`, { method: 'POST' });
    await load();
  }
  async function cancel(id: string) {
    const res = await fetch(`/api/jobs/${id}/cancel`, { method: 'POST' });
    const json = await res.json();
    if (!res.ok) alert(json.error ?? 'Failed'); else await load();
  }

  return (
    <main className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Jobs</h1>
        <select className="border rounded px-2 py-1" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">All</option>
          {['PENDING','RUNNING','DONE','ERROR','SKIPPED'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </header>

      <div className="card overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-black/5">
            <tr>
              <th className="p-2 text-left">Job</th>
              <th className="p-2 text-left">Kind</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Created</th>
              <th className="p-2 text-left">Updated</th>
              <th className="p-2 text-left">Error</th>
              <th className="p-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="p-4 text-center">Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={7} className="p-4 text-center text-gray-500">No jobs.</td></tr>
            ) : rows.map(j => (
              <tr key={j.id} className="border-b">
                <td className="p-2">{j.id}</td>
                <td className="p-2">{j.kind}</td>
                <td className="p-2"><span className="badge bg-indigo-100 text-indigo-800">{j.status}</span></td>
                <td className="p-2">{new Date(j.createdAt).toLocaleString()}</td>
                <td className="p-2">{new Date(j.updatedAt).toLocaleString()}</td>
                <td className="p-2">{j.lastError ? <span className="text-rose-600">{j.lastError}</span> : '—'}</td>
                <td className="p-2 text-right">
                  <div className="inline-flex gap-2">
                    <button className="btn" onClick={() => retry(j.id)}>Retry</button>
                    <button className="btn" onClick={() => cancel(j.id)} disabled={j.status !== 'PENDING'}>Cancel</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}