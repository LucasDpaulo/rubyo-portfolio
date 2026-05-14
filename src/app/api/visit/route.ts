import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { prisma } from "@/lib/db";

const BOT_RE = /bot|crawler|spider|crawl|preview|monitor|googlebot|bingbot|yandex|baidu|duckduck|slurp|facebook|twitter|linkedin|whatsapp|telegram|discord|headlesschrome|lighthouse|pagespeed|vercel|axios|curl|wget|python|java|go-http/i;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawPath = typeof body?.path === "string" ? body.path : "/";
    const path = rawPath.split("?")[0].split("#")[0].slice(0, 200) || "/";

    if (path.startsWith("/admin") || path.startsWith("/api")) {
      return NextResponse.json({ ok: true, skipped: "admin" });
    }

    const ua = req.headers.get("user-agent") || "";
    if (BOT_RE.test(ua)) {
      return NextResponse.json({ ok: true, skipped: "bot" });
    }

    const xff = req.headers.get("x-forwarded-for") || "";
    const ip = xff.split(",")[0].trim() || req.headers.get("x-real-ip") || "0";
    const day = new Date().toISOString().slice(0, 10);

    const fp = crypto
      .createHash("sha256")
      .update(`${ip}|${ua}|${day}`)
      .digest("hex")
      .slice(0, 32);

    const country =
      req.headers.get("x-vercel-ip-country") ||
      req.headers.get("cf-ipcountry") ||
      null;

    const v = await prisma.visit.create({
      data: { path, fingerprint: fp, country },
      select: { id: true },
    });

    return NextResponse.json({ ok: true, id: v.id });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}

const MAX_DURATION_MS = 60 * 60 * 1000;

export async function PATCH(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const id = typeof body?.id === "string" ? body.id : "";
    const durationMs = Number(body?.durationMs);
    if (!id || !Number.isFinite(durationMs) || durationMs < 0) {
      return NextResponse.json({ ok: false }, { status: 200 });
    }
    const clamped = Math.min(MAX_DURATION_MS, Math.round(durationMs));
    await prisma.visit.update({
      where: { id },
      data: { durationMs: clamped },
    }).catch(() => {});
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
