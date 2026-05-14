import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const schema = z.object({ aId: z.string().min(1), bId: z.string().min(1) });

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "validation" }, { status: 400 });
  }
  const { aId, bId } = parsed.data;
  if (aId === bId) return NextResponse.json({ ok: true });

  const [a, b] = await Promise.all([
    prisma.video.findUnique({ where: { id: aId }, select: { sortOrder: true } }),
    prisma.video.findUnique({ where: { id: bId }, select: { sortOrder: true } }),
  ]);
  if (!a || !b) return NextResponse.json({ error: "not_found" }, { status: 404 });

  await prisma.$transaction([
    prisma.video.update({ where: { id: aId }, data: { sortOrder: b.sortOrder } }),
    prisma.video.update({ where: { id: bId }, data: { sortOrder: a.sortOrder } }),
  ]);

  return NextResponse.json({ ok: true });
}
