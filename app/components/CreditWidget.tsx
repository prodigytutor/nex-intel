'use client';

import React from "react";

export default function CreditWidget() {
  const [data, setData] = React.useState<{ used: number; limit: number } | null>(null);
  React.useEffect(() => {
    fetch('/api/credits/me').then(r => r.json()).then(setData).catch(() => setData({ used: 0, limit: 1000 }));
  }, []);
  const used = data?.used ?? 0;
  const limit = data?.limit ?? 1000;
  const pct = Math.min(100, Math.round((used / limit) * 100));
  const warn = pct >= 80;
  return (
    <div className="card p-3">
      <div className="text-xs text-gray-500">Credits this month</div>
      <div className="mt-1 h-2 bg-black/10 rounded">
        <div className={`h-2 rounded ${warn ? 'bg-amber-500' : 'bg-gradient-to-r from-indigo-500 to-fuchsia-600'}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1 text-xs">{used} / {limit}</div>
      {warn && <div className="mt-1 text-[11px] text-amber-700">Approaching limit. See Settings → Billing.</div>}
    </div>
  );
}