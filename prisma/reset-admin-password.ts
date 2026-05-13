import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const newUsername = (process.argv[2] ?? "roberto").toLowerCase();
  const newPassword = process.argv[3] ?? "editor";

  const existing = await prisma.user.findFirst({ orderBy: { id: "asc" } });
  if (!existing) {
    throw new Error("Nenhum usuário admin encontrado. Rode `npm run db:seed` primeiro.");
  }

  const hash = await bcrypt.hash(newPassword, 10);
  const updated = await prisma.user.update({
    where: { id: existing.id },
    data: { email: newUsername, passwordHash: hash },
  });

  console.log(`Admin atualizado: usuário="${updated.email}", senha redefinida.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
