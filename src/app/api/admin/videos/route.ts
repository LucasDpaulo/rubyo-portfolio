import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { videoCreateSchema } from "@/lib/validators";
import { parseVideoUrl } from "@/lib/youtube";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const videos = await prisma.video.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(videos);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const parsed = videoCreateSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "validation", details: parsed.error.flatten() }, { status: 400 });
  }

  const info = parseVideoUrl(parsed.data.url);
  if (!info) {
    return NextResponse.json({ error: "URL precisa ser do YouTube ou Vimeo" }, { status: 400 });
  }

  const last = await prisma.video.findFirst({ orderBy: { sortOrder: "desc" } });
  const nextOrder = (last?.sortOrder ?? -1) + 1;

  const created = await prisma.video.create({
    data: {
      title: parsed.data.title,
      url: parsed.data.url,
      provider: info.provider,
      videoId: info.videoId,
      aspectRatio: parsed.data.aspectRatio,
      tag: parsed.data.tag ?? null,
      sortOrder: nextOrder,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
