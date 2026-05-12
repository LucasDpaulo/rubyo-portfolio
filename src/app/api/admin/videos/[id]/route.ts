import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { videoUpdateSchema } from "@/lib/validators";
import { parseVideoUrl } from "@/lib/youtube";

export async function PUT(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const parsed = videoUpdateSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "validation", details: parsed.error.flatten() }, { status: 400 });
  }

  const data: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.url) {
    const info = parseVideoUrl(parsed.data.url);
    if (!info) {
      return NextResponse.json({ error: "URL precisa ser do YouTube ou Vimeo" }, { status: 400 });
    }
    data.provider = info.provider;
    data.videoId = info.videoId;
  }

  const updated = await prisma.video.update({ where: { id }, data });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  await prisma.video.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
