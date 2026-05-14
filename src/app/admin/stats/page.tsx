import { getStats } from "@/lib/stats";
import { StatsDashboard } from "@/components/admin/StatsDashboard";

export const dynamic = "force-dynamic";

export default async function AdminStatsPage() {
  const data = await getStats();
  return <StatsDashboard data={data} />;
}
