import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const TARGET_EMAIL = "roberto@gmail.com";
const TARGET_PASSWORD = "editor";

async function main() {
  const prisma = new PrismaClient();
  const passwordHash = await bcrypt.hash(TARGET_PASSWORD, 10);

  const existing = await prisma.user.findFirst();
  if (!existing) {
    await prisma.user.create({ data: { email: TARGET_EMAIL, passwordHash } });
    console.log(`✓ Criado: ${TARGET_EMAIL} / ${TARGET_PASSWORD}`);
  } else {
    await prisma.user.update({
      where: { id: existing.id },
      data: { email: TARGET_EMAIL, passwordHash },
    });
    console.log(`✓ Atualizado ${existing.email} → ${TARGET_EMAIL} / ${TARGET_PASSWORD}`);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
