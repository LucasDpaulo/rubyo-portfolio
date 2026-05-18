import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getStats } from "@/lib/stats";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const data = await getStats();
  return NextResponse.json(data);
}
