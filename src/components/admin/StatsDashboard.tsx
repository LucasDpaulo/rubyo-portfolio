import type { StatsPayload, StatsBucket } from "@/lib/stats";

function formatDuration(ms: number): string {
  if (!ms || ms < 1000) return "0s";
  const total = Math.round(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

const nf = (n: number) => n.toLocaleString("pt-BR");

const SOCIAL_ICON: Record<string, React.ReactNode> = {
  x: (
    <svg viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.261 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  discord: (
    <svg viewBox="0 0 24 24">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.034.055a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
    </svg>
  ),
  gmail: (
    <svg viewBox="0 0 24 24">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  ),
};

export function StatsDashboard({ data }: { data: StatsPayload }) {
  const s = data.socialClicks;

  return (
    <div className="analytics-body">
      <section>
        <div className="analytics-section-label">
          Este mês — {data.currentMonth.label}
        </div>
        <div className="analytics-grid analytics-grid-4">
          <Kpi
            label="Visitas"
            value={nf(data.currentMonth.visits)}
            sub={`${nf(data.currentMonth.unique)} visitantes únicos`}
          />
          <Kpi
            label="Tempo médio"
            value={formatDuration(data.currentMonth.avgDurationMs)}
            sub="por visita"
          />
          <Kpi
            label="Vídeos abertos"
            value={nf(data.currentMonth.videoClicks)}
            sub="cliques no play"
          />
          <Kpi
            label="Cliques em contato"
            value={nf(data.currentMonth.contactClicks)}
            sub="X · Discord · Gmail"
          />
        </div>
      </section>

      <section>
        <div className="analytics-section-label">Visitas</div>
        <div className="analytics-stack">
          <div className="analytics-grid analytics-grid-3">
            <Chip
              label="Últimas 24h"
              value={nf(data.last24h.visits)}
              sub={`${nf(data.last24h.unique)} únicos · ${formatDuration(data.last24h.avgDurationMs)}`}
            />
            <Chip
              label="Últimos 7 dias"
              value={nf(data.last7d.visits)}
              sub={`${nf(data.last7d.unique)} únicos · ${formatDuration(data.last7d.avgDurationMs)}`}
            />
            <Chip
              label="Últimos 30 dias"
              value={nf(data.last30d.visits)}
              sub={`${nf(data.last30d.unique)} únicos · ${formatDuration(data.last30d.avgDurationMs)}`}
            />
          </div>
          <div className="analytics-panel">
            <div className="analytics-panel-title">Visitas por dia — últimos 30 dias</div>
            <BarChart daily={data.daily} />
          </div>
        </div>
      </section>

      <section>
        <div className="analytics-section-label">Cliques em contato</div>
        <div className="analytics-grid analytics-grid-3">
          <SocialCard kind="x" label="X (Twitter)" value={s.x} />
          <SocialCard kind="discord" label="Discord" value={s.discord} />
          <SocialCard kind="gmail" label="Gmail" value={s.gmail} />
        </div>
      </section>

      <section>
        <div className="analytics-section-label">Páginas & conteúdo</div>
        <div className="analytics-stack">
          <div className="analytics-grid analytics-grid-2">
            <ListCard
              title="Páginas mais acessadas"
              items={data.topPaths.map((p) => ({
                label: p.path,
                value: p.visits,
                hint: formatDuration(p.avgDurationMs),
              }))}
              empty="Sem dados ainda"
            />
            <ListCard
              title="Vídeos mais clicados"
              items={data.videoClicks.top.map((v) => ({
                label: v.label,
                value: v.clicks,
              }))}
              empty="Nenhum clique em vídeo ainda"
            />
          </div>
          <ListCard
            title="Países dos visitantes"
            items={data.topCountries.map((c) => ({ label: c.country, value: c.visits }))}
            empty="Sem dados de localização"
          />
        </div>
      </section>

      <section>
        <div className="analytics-section-label">Histórico mensal</div>
        <div className="analytics-panel">
          {data.monthly.length === 0 ? (
            <p className="analytics-empty">
              Ainda não há meses anteriores. O primeiro histórico aparece quando
              virar o mês.
            </p>
          ) : (
            <div className="analytics-months">
              {data.monthly.map((m) => (
                <div className="analytics-month-row" key={m.month}>
                  <span className="analytics-month-name">{m.label}</span>
                  <span className="analytics-month-stats">
                    <span>
                      <strong>{nf(m.visits)}</strong> visitas
                    </span>
                    <span>{nf(m.unique)} únicos</span>
                    <span>{nf(m.videoClicks)} vídeos</span>
                    <span>{nf(m.contactClicks)} contatos</span>
                  </span>
                </div>
              ))}
            </div>
          )}
          <div className="analytics-month-total">
            Total acumulado desde o início:{" "}
            <strong>{nf(data.total)}</strong> visitas · {nf(data.totalUnique)} únicos
          </div>
        </div>
      </section>
    </div>
  );
}

function Kpi({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="analytics-kpi">
      <div className="analytics-kpi-label">{label}</div>
      <div className="analytics-kpi-value">{value}</div>
      {sub && <div className="analytics-kpi-sub">{sub}</div>}
    </div>
  );
}

function Chip({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="analytics-chip">
      <div className="analytics-chip-label">{label}</div>
      <div className="analytics-chip-value">{value}</div>
      <div className="analytics-chip-sub">{sub}</div>
    </div>
  );
}

function SocialCard({
  kind,
  label,
  value,
}: {
  kind: "x" | "discord" | "gmail";
  label: string;
  value: number;
}) {
  return (
    <div className="analytics-social">
      <span className="analytics-social-icon">{SOCIAL_ICON[kind]}</span>
      <div>
        <div className="analytics-social-value">{nf(value)}</div>
        <div className="analytics-social-label">{label}</div>
      </div>
    </div>
  );
}

function ListCard({
  title,
  items,
  empty,
}: {
  title: string;
  items: { label: string; value: number; hint?: string }[];
  empty: string;
}) {
  const visible = items.filter((i) => i.value > 0);
  const max = Math.max(1, ...visible.map((i) => i.value));

  return (
    <div className="analytics-listcard">
      <div className="analytics-listcard-title">{title}</div>
      {visible.length === 0 ? (
        <p className="analytics-empty">{empty}</p>
      ) : (
        <div className="analytics-list">
          {visible.map((i) => (
            <div key={i.label}>
              <div className="analytics-list-head">
                <span className="analytics-list-name">{i.label}</span>
                <span className="analytics-list-value">
                  {i.hint && <span className="analytics-list-hint">{i.hint}</span>}
                  {nf(i.value)}
                </span>
              </div>
              <div className="analytics-list-bar">
                <span style={{ width: `${(i.value / max) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BarChart({ daily }: { daily: StatsBucket[] }) {
  const max = Math.max(1, ...daily.map((d) => d.visits));
  const W = 800;
  const H = 170;
  const PAD = 26;
  const slot = (W - PAD * 2) / daily.length;
  const barW = slot * 0.5;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="analytics-chart">
      {daily.map((d, i) => {
        const h = (d.visits / max) * (H - PAD * 2);
        const x = PAD + i * slot + (slot - barW) / 2;
        const y = H - PAD - h;
        return (
          <rect
            key={d.date}
            x={x}
            y={y}
            width={barW}
            height={Math.max(0, h)}
            rx={1.5}
            fill="var(--color-accent)"
            opacity={d.visits > 0 ? 0.9 : 0.18}
          >
            <title>{`${d.date}: ${d.visits} visitas (${d.unique} únicos)`}</title>
          </rect>
        );
      })}
      <line
        x1={PAD}
        y1={H - PAD}
        x2={W - PAD}
        y2={H - PAD}
        stroke="rgba(196,149,106,0.25)"
      />
      <text x={PAD} y={H - 8} fill="rgba(164,147,132,0.7)" fontSize="11">
        {daily[0]?.date}
      </text>
      <text
        x={W - PAD}
        y={H - 8}
        fill="rgba(164,147,132,0.7)"
        fontSize="11"
        textAnchor="end"
      >
        {daily[daily.length - 1]?.date}
      </text>
      <text
        x={W - PAD}
        y={16}
        fill="rgba(164,147,132,0.7)"
        fontSize="11"
        textAnchor="end"
      >
        máx {max}
      </text>
    </svg>
  );
}
