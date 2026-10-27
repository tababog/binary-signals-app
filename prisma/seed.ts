import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function criarAdmin(nome: string, email: string, senha: string) {
  const existente = await prisma.usuario.findUnique({ where: { email } });
  if (existente) {
    console.log(`Administrador já existe: ${email}`);
    return;
  }
  await prisma.usuario.create({
    data: { nome, email, senhaHash: await bcrypt.hash(senha, 10), papel: "ADMIN" },
  });
  console.log(`Administrador criado: ${email}`);
}

async function main() {
  await criarAdmin(
    process.env.ADMIN1_NOME ?? "Administrador",
    (process.env.ADMIN1_EMAIL ?? "admin@tababog.com").toLowerCase(),
    process.env.ADMIN1_SENHA ?? "trocar123",
  );
  await criarAdmin(
    process.env.ADMIN2_NOME ?? "Emanuel",
    (process.env.ADMIN2_EMAIL ?? "emanuel@tababog.com").toLowerCase(),
    process.env.ADMIN2_SENHA ?? "trocar123",
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
