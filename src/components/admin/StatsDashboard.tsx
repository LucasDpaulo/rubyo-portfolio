import type { StatsPayload, StatsBucket } from "@/lib/stats";
import { formatDuration } from "@/lib/stats";

export function StatsDashboard({ data }: { data: StatsPayload }) {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header>
        <h1 className="font-display text-3xl tracking-[2px] text-accent">STATS</h1>
        <p className="mt-1 text-[12px] uppercase tracking-[1.5px] text-dim">
          Tráfego do site (atualiza a cada visita)
        </p>
      </header>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card
          label="Total"
          value={data.total}
          sub={`${data.totalUnique} únicos · ${formatDuration(data.avgDurationMs)} médio`}
        />
        <Card
          label="Últimas 24h"
          value={data.last24h.visits}
          sub={`${data.last24h.unique} únicos · ${formatDuration(data.last24h.avgDurationMs)}`}
        />
        <Card
          label="Últimos 7d"
          value={data.last7d.visits}
          sub={`${data.last7d.unique} únicos · ${formatDuration(data.last7d.avgDurationMs)}`}
        />
        <Card
          label="Últimos 30d"
          value={data.last30d.visits}
          sub={`${data.last30d.unique} únicos · ${formatDuration(data.last30d.avgDurationMs)}`}
        />
      </section>

      <section className="rounded border border-accent/10 bg-black/20 p-5">
        <h2 className="mb-4 text-[11px] uppercase tracking-[2px] text-dim">
          Últimos 30 dias
        </h2>
        <BarChart daily={data.daily} />
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <TopList
          title="Páginas mais acessadas"
          items={data.topPaths.map((p) => ({
            label: p.path,
            value: p.visits,
            hint: formatDuration(p.avgDurationMs),
          }))}
          empty="Sem dados ainda"
        />
        <TopList
          title="Países"
          items={data.topCountries.map((c) => ({ label: c.country, value: c.visits }))}
          empty="Sem dados de localização"
        />
      </section>
    </div>
  );
}

function Card({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="rounded border border-accent/10 bg-black/20 p-4">
      <div className="text-[10px] uppercase tracking-[2px] text-dim">{label}</div>
      <div className="mt-2 font-display text-4xl tracking-wide text-cream">
        {value.toLocaleString("pt-BR")}
      </div>
      {sub && (
        <div className="mt-1 text-[11px] text-accent/70">{sub}</div>
      )}
    </div>
  );
}

function BarChart({ daily }: { daily: StatsBucket[] }) {
  const max = Math.max(1, ...daily.map((d) => d.visits));
  const W = 800;
  const H = 160;
  const PAD = 24;
  const barW = (W - PAD * 2) / daily.length;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="h-44 w-full"
    >
      {daily.map((d, i) => {
        const h = (d.visits / max) * (H - PAD * 2);
        const x = PAD + i * barW;
        const y = H - PAD - h;
        return (
          <g key={d.date}>
            <rect
              x={x + 1}
              y={y}
              width={Math.max(1, barW - 2)}
              height={h}
              fill="var(--color-accent)"
              opacity={0.85}
            >
              <title>{`${d.date}: ${d.visits} visitas (${d.unique} únicos)`}</title>
            </rect>
          </g>
        );
      })}
      <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="rgba(196,149,106,0.25)" />
      <text x={PAD} y={H - 6} fill="rgba(220,208,198,0.6)" fontSize="10">
        {daily[0]?.date}
      </text>
      <text x={W - PAD} y={H - 6} fill="rgba(220,208,198,0.6)" fontSize="10" textAnchor="end">
        {daily[daily.length - 1]?.date}
      </text>
      <text x={W - PAD} y={14} fill="rgba(220,208,198,0.6)" fontSize="10" textAnchor="end">
        máx {max}
      </text>
    </svg>
  );
}

function TopList({
  title,
  items,
  empty,
}: {
  title: string;
  items: { label: string; value: number; hint?: string }[];
  empty: string;
}) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <div className="rounded border border-accent/10 bg-black/20 p-5">
      <h2 className="mb-4 text-[11px] uppercase tracking-[2px] text-dim">{title}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-dim/70">{empty}</p>
      ) : (
        <ul className="space-y-2">
          {items.map((i) => (
            <li key={i.label}>
              <div className="flex justify-between text-sm">
                <span className="truncate text-cream">{i.label}</span>
                <span className="flex items-center gap-2 text-accent">
                  {i.hint && (
                    <span className="text-[10px] uppercase tracking-[1px] text-dim">
                      {i.hint}
                    </span>
                  )}
                  {i.value.toLocaleString("pt-BR")}
                </span>
              </div>
              <div className="mt-1 h-1 overflow-hidden rounded bg-accent/10">
                <div
                  className="h-full bg-accent/70"
                  style={{ width: `${(i.value / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
