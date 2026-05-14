import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createPresignedUpload, s3Configured } from "@/lib/s3";
import { uploadRequestSchema } from "@/lib/validators";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  if (!s3Configured) {
    return NextResponse.json(
      { error: "s3_not_configured", message: "Defina S3_BUCKET, S3_ACCESS_KEY_ID e S3_SECRET_ACCESS_KEY no ambiente." },
      { status: 503 },
    );
  }

  const parsed = uploadRequestSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "validation", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const result = await createPresignedUpload(parsed.data);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: "s3_error", message: err instanceof Error ? err.message : "unknown" },
      { status: 500 },
    );
  }
}
