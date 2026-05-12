import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { profileSchema } from "@/lib/validators";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const row = await prisma.siteContent.findUnique({ where: { key: "profile" } });
  return NextResponse.json(row?.value ?? null);
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const parsed = profileSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "validation", details: parsed.error.flatten() }, { status: 400 });
  }

  const saved = await prisma.siteContent.upsert({
    where: { key: "profile" },
    create: { key: "profile", value: parsed.data },
    update: { value: parsed.data },
  });

  return NextResponse.json(saved.value);
}
