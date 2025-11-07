Kick jobs from your “start run” path instead of calling orchestrate directly:

ts
Copy
await fetch('/api/jobs/enqueue', { method: 'POST', body: JSON.stringify({ kind: 'ORCHESTRATE_RUN', payload: { runId } }) });
Then ping /api/jobs/worker via a serverless cron (Vercel cron, GitHub Actions, or a simple external ping every minute).

Credits and billing guardrail (lightweight)
Track per-user or per-workspace credits; block or warn when reached.