import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { parseVideoUrl } from "../src/lib/youtube";
import { DEFAULT_HERO, DEFAULT_PROFILE } from "../src/lib/content";

const prisma = new PrismaClient();

const PLACEHOLDER_VIDEOS = [
  {
    title: "Short — exemplo",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    aspectRatio: "9:16" as const,
    tag: "9:16 · Short",
  },
  {
    title: "Long form 01",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    aspectRatio: "16:9" as const,
    tag: "16:9 · Long",
  },
  {
    title: "Long form 02",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    aspectRatio: "16:9" as const,
    tag: "16:9 · Long",
  },
  {
    title: "Long form 03",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    aspectRatio: "16:9" as const,
    tag: "16:9 · Long",
  },
  {
    title: "Long form 04",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    aspectRatio: "16:9" as const,
    tag: "16:9 · Long",
  },
];

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? "admin@example.com").toLowerCase();
  const password = process.env.ADMIN_INITIAL_PASSWORD ?? "trocar123";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.create({ data: { email, passwordHash } });
    console.log(`✓ Admin criado: ${email}`);
  } else {
    console.log(`• Admin já existe: ${email}`);
  }

  await prisma.siteContent.upsert({
    where: { key: "hero" },
    create: { key: "hero", value: DEFAULT_HERO },
    update: {},
  });
  await prisma.siteContent.upsert({
    where: { key: "profile" },
    create: { key: "profile", value: DEFAULT_PROFILE },
    update: {},
  });
  console.log("✓ Hero e Profile prontos");

  const videoCount = await prisma.video.count();
  if (videoCount === 0) {
    for (let i = 0; i < PLACEHOLDER_VIDEOS.length; i++) {
      const v = PLACEHOLDER_VIDEOS[i];
      const info = parseVideoUrl(v.url);
      if (!info) continue;
      await prisma.video.create({
        data: {
          title: v.title,
          url: v.url,
          provider: info.provider,
          videoId: info.videoId,
          aspectRatio: v.aspectRatio,
          tag: v.tag,
          sortOrder: i,
        },
      });
    }
    console.log(`✓ ${PLACEHOLDER_VIDEOS.length} vídeos placeholder criados`);
  } else {
    console.log(`• Já existem ${videoCount} vídeos — não vou sobrescrever`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
