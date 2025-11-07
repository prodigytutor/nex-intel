export default function Landing() {
  return (
    <div className="container">
      <section className="py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          Competitor analysis that cites itself
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Drop your product. Get a report with sources, roadmaps, and GTM angles—ready for your deck.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <a className="btn-primary btn" href="/projects/new">Generate my report</a>
          <a className="btn" href="/demo">See demo</a>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        {[
          ['Evidence Drawer', 'Every claim has a receipt. Click superscripts to see sources.'],
          ['Auto Roadmaps', 'Feature gaps and differentiators surfaced automatically.'],
          ['One-click Export', 'Push to Notion and PDF. Share responsibly.'],
        ].map(([title, desc]) => (
          <div key={title} className="card p-6 hover:shadow-soft transition">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-600 animate-floaty" />
            <h3 className="mt-4 font-semibold">{title}</h3>
            <p className="text-gray-600 text-sm mt-1">{desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}