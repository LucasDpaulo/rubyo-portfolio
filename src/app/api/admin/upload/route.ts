import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { uploadRequestSchema } from "@/lib/validators";

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB depois do resize client-side já é folgado

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const parsed = uploadRequestSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "validation", details: parsed.error.flatten() }, { status: 400 });
  }

  const { contentType, base64 } = parsed.data;
  const b64 = base64.includes(",") ? base64.split(",")[1] : base64;
  let buf: Buffer;
  try {
    buf = Buffer.from(b64, "base64");
  } catch {
    return NextResponse.json({ error: "invalid_base64" }, { status: 400 });
  }
  if (buf.length === 0) return NextResponse.json({ error: "empty" }, { status: 400 });
  if (buf.length > MAX_BYTES) {
    return NextResponse.json({ error: "too_large", maxBytes: MAX_BYTES }, { status: 413 });
  }

  const asset = await prisma.mediaAsset.create({
    data: { mimeType: contentType, data: new Uint8Array(buf) },
    select: { id: true },
  });

  return NextResponse.json({ url: `/api/assets/${asset.id}`, id: asset.id });
}
