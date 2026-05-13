import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const hero = {
    titleLine1: "ROBERTO",
    titleLine2: "EDITOR",
    titleLine3: "",
    description:
      "20 years old, 1 year of editing experience. I focus on content editing and also have experience with sales videos.",
  };

  const profile = {
    name: "ROBERTO",
    role: "Content Editor",
    email: "roberto@gmail.com",
    socials: [
      { label: "@rubyoroberto", url: "https://x.com/rubyoroberto", icon: "x" },
      { label: "rubyroberto_editor", url: "#", icon: "discord" },
      { label: "roberto@gmail.com", url: "mailto:roberto@gmail.com", icon: "email" },
    ],
  };

  await prisma.siteContent.upsert({
    where: { key: "hero" },
    create: { key: "hero", value: hero },
    update: { value: hero },
  });

  await prisma.siteContent.upsert({
    where: { key: "profile" },
    create: { key: "profile", value: profile },
    update: { value: profile },
  });

  console.log("✓ Hero + Profile atualizados");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
