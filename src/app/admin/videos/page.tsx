import { prisma } from "@/lib/db";
import { VideosManager } from "@/components/admin/VideosManager";

export const dynamic = "force-dynamic";

export default async function AdminVideosPage() {
  const videos = await prisma.video.findMany({ orderBy: { sortOrder: "asc" } });
  return <VideosManager initial={videos} />;
}
