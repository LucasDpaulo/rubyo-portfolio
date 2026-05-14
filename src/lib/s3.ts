import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = process.env.S3_REGION || "us-east-1";
const endpoint = process.env.S3_ENDPOINT || undefined;
const bucket = process.env.S3_BUCKET || "";
const accessKeyId = process.env.S3_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY || "";
const publicUrlBase = process.env.S3_PUBLIC_URL || "";

export const s3Configured =
  Boolean(bucket) && Boolean(accessKeyId) && Boolean(secretAccessKey);

let _client: S3Client | null = null;
function client() {
  if (!_client) {
    _client = new S3Client({
      region,
      endpoint,
      forcePathStyle: Boolean(endpoint),
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  return _client;
}

export async function createPresignedUpload(opts: {
  filename: string;
  contentType: string;
}) {
  if (!s3Configured) {
    throw new Error("S3 não configurado — defina S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY");
  }
  const ext = opts.filename.split(".").pop()?.toLowerCase() || "bin";
  const key = `avatars/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: opts.contentType,
  });

  const uploadUrl = await getSignedUrl(client(), command, { expiresIn: 300 });

  const publicUrl = publicUrlBase
    ? `${publicUrlBase.replace(/\/$/, "")}/${key}`
    : endpoint
      ? `${endpoint.replace(/\/$/, "")}/${bucket}/${key}`
      : `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

  return { uploadUrl, publicUrl, key };
}
