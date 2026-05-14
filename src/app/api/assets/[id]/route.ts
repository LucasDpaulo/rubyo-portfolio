import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  if (!id) return new NextResponse("not found", { status: 404 });

  const asset = await prisma.mediaAsset.findUnique({
    where: { id },
    select: { mimeType: true, data: true },
  });
  if (!asset) return new NextResponse("not found", { status: 404 });

  return new NextResponse(new Uint8Array(asset.data), {
    status: 200,
    headers: {
      "content-type": asset.mimeType,
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
