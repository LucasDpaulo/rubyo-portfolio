import { prisma } from "@/lib/db";

const DAY = 24 * 60 * 60 * 1000;

export type StatsBucket = { date: string; visits: number; unique: number };

export type PeriodStats = { visits: number; unique: number; avgDurationMs: number };

export type MonthBucket = {
  month: string; // "2026-05"
  label: string; // "Maio 2026"
  visits: number;
  unique: number;
  videoClicks: number;
  contactClicks: number;
  avgDurationMs: number;
};

export type StatsPayload = {
  total: number;
  totalUnique: number;
  avgDurationMs: number;
  currentMonth: MonthBucket;
  monthly: MonthBucket[];
  last24h: PeriodStats;
  last7d: PeriodStats;
  last30d: PeriodStats;
  topPaths: { path: string; visits: number; avgDurationMs: number }[];
  topCountries: { country: string; visits: number }[];
  daily: StatsBucket[];
  videoClicks: { total: number; top: { label: string; clicks: number }[] };
  socialClicks: { x: number; discord: number; gmail: number; total: number };
};

const MONTHS_PT = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function monthLabel(key: string): string {
  const [y, m] = key.split("-").map(Number);
  return `${MONTHS_PT[m - 1] ?? key} ${y}`;
}

function emptyMonth(key: string): MonthBucket {
  return {
    month: key,
    label: monthLabel(key),
    visits: 0,
    unique: 0,
    videoClicks: 0,
    contactClicks: 0,
    avgDurationMs: 0,
  };
}

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
    videoClicksTotal,
    videoTopRaw,
    socialGroupRaw,
    visitsByMonthRaw,
    clicksByMonthRaw,
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
    }),
    prisma.visit.findMany({
      where: { createdAt: { gte: since30 } },
      select: { createdAt: true, fingerprint: true },
    }),
    prisma.clickEvent.count({ where: { kind: "video" } }),
    prisma.clickEvent.groupBy({
      by: ["label"],
      where: { kind: "video" },
      _count: { label: true },
      orderBy: { _count: { label: "desc" } },
      take: 10,
    }),
    prisma.clickEvent.groupBy({
      by: ["label"],
      where: { kind: "social" },
      _count: { label: true },
    }),
    prisma.$queryRaw<
      { month: string; visits: number; uniques: number; avgduration: number }[]
    >`
      SELECT to_char(date_trunc('month', "createdAt"), 'YYYY-MM') AS month,
             count(*)::int AS visits,
             count(DISTINCT "fingerprint")::int AS uniques,
             COALESCE(round(avg("durationMs")), 0)::int AS avgduration
      FROM "Visit"
      GROUP BY 1
      ORDER BY 1 DESC
    `,
    prisma.$queryRaw<{ month: string; kind: string; c: number }[]>`
      SELECT to_char(date_trunc('month', "createdAt"), 'YYYY-MM') AS month,
             "kind",
             count(*)::int AS c
      FROM "ClickEvent"
      GROUP BY 1, 2
    `,
  ]);

  const clickByMonth = new Map<string, { video: number; social: number }>();
  for (const r of clicksByMonthRaw) {
    const e = clickByMonth.get(r.month) ?? { video: 0, social: 0 };
    if (r.kind === "video") e.video += r.c;
    else if (r.kind === "social") e.social += r.c;
    clickByMonth.set(r.month, e);
  }

  const allMonths: MonthBucket[] = visitsByMonthRaw.map((r) => {
    const clicks = clickByMonth.get(r.month) ?? { video: 0, social: 0 };
    return {
      month: r.month,
      label: monthLabel(r.month),
      visits: r.visits,
      unique: r.uniques,
      videoClicks: clicks.video,
      contactClicks: clicks.social,
      avgDurationMs: r.avgduration,
    };
  });

  const currentKey = new Date().toISOString().slice(0, 7);
  const currentMonth =
    allMonths.find((m) => m.month === currentKey) ?? emptyMonth(currentKey);
  const monthly = allMonths.filter((m) => m.month !== currentKey);

  const socialMap = new Map(socialGroupRaw.map((r) => [r.label, r._count.label]));
  const socialClicks = {
    x: socialMap.get("x") ?? 0,
    discord: socialMap.get("discord") ?? 0,
    gmail: socialMap.get("gmail") ?? 0,
    total: 0,
  };
  socialClicks.total = socialClicks.x + socialClicks.discord + socialClicks.gmail;

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
    currentMonth,
    monthly,
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
    videoClicks: {
      total: videoClicksTotal,
      top: videoTopRaw.map((r) => ({ label: r.label, clicks: r._count.label })),
    },
    socialClicks,
  };
}
