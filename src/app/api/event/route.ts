import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const BOT_RE = /bot|crawler|spider|crawl|preview|monitor|googlebot|bingbot|yandex|baidu|duckduck|slurp|facebook|twitter|linkedin|whatsapp|telegram|discord|headlesschrome|lighthouse|pagespeed|vercel|axios|curl|wget|python|java|go-http/i;

const KINDS = new Set(["video", "social"]);

export async function POST(req: Request) {
  try {
    const ua = req.headers.get("user-agent") || "";
    if (BOT_RE.test(ua)) {
      return NextResponse.json({ ok: true, skipped: "bot" });
    }

    const body = await req.json().catch(() => ({}));
    const kind = typeof body?.kind === "string" ? body.kind : "";
    const label = typeof body?.label === "string" ? body.label.trim().slice(0, 200) : "";
    if (!KINDS.has(kind) || !label) {
      return NextResponse.json({ ok: false }, { status: 200 });
    }

    await prisma.clickEvent.create({ data: { kind, label } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
