import { prisma } from "@/lib/db";

const DAY = 24 * 60 * 60 * 1000;

export type StatsBucket = { date: string; visits: number; unique: number };

export type PeriodStats = { visits: number; unique: number; avgDurationMs: number };

export type StatsPayload = {
  total: number;
  totalUnique: number;
  avgDurationMs: number;
  last24h: PeriodStats;
  last7d: PeriodStats;
  last30d: PeriodStats;
  topPaths: { path: string; visits: number; avgDurationMs: number }[];
  topCountries: { country: string; visits: number }[];
  daily: StatsBucket[];
};

async function bucketStats(sinceMs: number): Promise<PeriodStats> {
  const since = new Date(Date.now() - sinceMs);
  const [visits, uniqueRows, durAgg] = await Promise.all([
    prisma.visit.count({ where: { createdAt: { gte: since } } }),
    prisma.visit.findMany({
      where: { createdAt: { gte: since } },
      distinct: ["fingerprint"],
      select: { fingerprint: true },
    }),
    prisma.visit.aggregate({
      where: { createdAt: { gte: since }, durationMs: { not: null } },
      _avg: { durationMs: true },
    }),
  ]);
  return {
    visits,
    unique: uniqueRows.length,
    avgDurationMs: Math.round(durAgg._avg.durationMs ?? 0),
  };
}

export async function getStats(): Promise<StatsPayload> {
  const since30 = new Date(Date.now() - 30 * DAY);

  const [
    total,
    totalUniqueRows,
    durAvgAll,
    last24h,
    last7d,
    last30d,
    topPathsRaw,
    topCountriesRaw,
    last30dRows,
  ] = await Promise.all([
    prisma.visit.count(),
    prisma.visit.findMany({ distinct: ["fingerprint"], select: { fingerprint: true } }),
    prisma.visit.aggregate({
      where: { durationMs: { not: null } },
      _avg: { durationMs: true },
    }),
    bucketStats(DAY),
    bucketStats(7 * DAY),
    bucketStats(30 * DAY),
    prisma.visit.groupBy({
      by: ["path"],
      _count: { path: true },
      _avg: { durationMs: true },
      orderBy: { _count: { path: "desc" } },
      take: 10,
    }),
    prisma.visit.groupBy({
      by: ["country"],
      _count: { country: true },
      where: { country: { not: null } },
      orderBy: { _count: { country: "desc" } },
      take: 5,
    }),
    prisma.visit.findMany({
      where: { createdAt: { gte: since30 } },
      select: { createdAt: true, fingerprint: true },
    }),
  ]);

  const byDay = new Map<string, { visits: number; fps: Set<string> }>();
  for (let i = 0; i < 30; i++) {
    const d = new Date(Date.now() - i * DAY).toISOString().slice(0, 10);
    byDay.set(d, { visits: 0, fps: new Set() });
  }
  for (const row of last30dRows) {
    const d = row.createdAt.toISOString().slice(0, 10);
    const slot = byDay.get(d);
    if (!slot) continue;
    slot.visits++;
    slot.fps.add(row.fingerprint);
  }

  const daily: StatsBucket[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * DAY).toISOString().slice(0, 10);
    const slot = byDay.get(d)!;
    daily.push({ date: d, visits: slot.visits, unique: slot.fps.size });
  }

  return {
    total,
    totalUnique: totalUniqueRows.length,
    avgDurationMs: Math.round(durAvgAll._avg.durationMs ?? 0),
    last24h,
    last7d,
    last30d,
    topPaths: topPathsRaw.map((r) => ({
      path: r.path,
      visits: r._count.path,
      avgDurationMs: Math.round(r._avg.durationMs ?? 0),
    })),
    topCountries: topCountriesRaw
      .filter((r) => r.country)
      .map((r) => ({ country: r.country as string, visits: r._count.country })),
    daily,
  };
}

export function formatDuration(ms: number): string {
  if (!ms || ms < 1000) return "0s";
  const total = Math.round(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}
