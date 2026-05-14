import { prisma } from "@/lib/db";

const DAY = 24 * 60 * 60 * 1000;

export type StatsBucket = { date: string; visits: number; unique: number };

export type StatsPayload = {
  total: number;
  totalUnique: number;
  last24h: { visits: number; unique: number };
  last7d: { visits: number; unique: number };
  last30d: { visits: number; unique: number };
  topPaths: { path: string; visits: number }[];
  topCountries: { country: string; visits: number }[];
  daily: StatsBucket[];
};

async function bucketCounts(sinceMs: number) {
  const since = new Date(Date.now() - sinceMs);
  const [visits, uniqueRows] = await Promise.all([
    prisma.visit.count({ where: { createdAt: { gte: since } } }),
    prisma.visit.findMany({
      where: { createdAt: { gte: since } },
      distinct: ["fingerprint"],
      select: { fingerprint: true },
    }),
  ]);
  return { visits, unique: uniqueRows.length };
}

export async function getStats(): Promise<StatsPayload> {
  const since30 = new Date(Date.now() - 30 * DAY);

  const [total, totalUniqueRows, last24h, last7d, last30d, topPathsRaw, topCountriesRaw, last30dRows] =
    await Promise.all([
      prisma.visit.count(),
      prisma.visit.findMany({ distinct: ["fingerprint"], select: { fingerprint: true } }),
      bucketCounts(DAY),
      bucketCounts(7 * DAY),
      bucketCounts(30 * DAY),
      prisma.visit.groupBy({
        by: ["path"],
        _count: { path: true },
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
    last24h,
    last7d,
    last30d,
    topPaths: topPathsRaw.map((r) => ({ path: r.path, visits: r._count.path })),
    topCountries: topCountriesRaw
      .filter((r) => r.country)
      .map((r) => ({ country: r.country as string, visits: r._count.country })),
    daily,
  };
}
