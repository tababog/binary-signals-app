import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Carrega o .env quando existir (no computador). Na Vercel as variáveis já vêm do painel.
try {
  process.loadEnvFile();
} catch {}

const prisma = new PrismaClient();

// Textos de exemplo que podem ficar nas variáveis se o modelo for colado sem preencher.
const PARECE_EXEMPLO = /seu_?email|email_do|exemplo|SUA_SENHA|SENHA_INICIAL|COLE_AQUI|trocar123/i;

async function criarAdmin(nome: string, email: string, senha: string) {
  // Nunca cria administrador com e-mail inválido ou senha de exemplo: seria uma porta aberta no app publicado.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || PARECE_EXEMPLO.test(email) || PARECE_EXEMPLO.test(senha) || senha.length < 6) {
    console.warn(`Administrador NÃO criado: e-mail ou senha inválidos/de exemplo (${email}). Corrija ADMIN*_EMAIL e ADMIN*_SENHA.`);
    return;
  }
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

// Custos fixos informados pelo Alessandro em 28/10/2026. Só são criados se ainda não houver nenhum.
const CUSTOS_FIXOS_INICIAIS = [
  { nome: "Pró-labore Alessandro", valorCent: 100_000, periodicidade: "SEMANAL" },
  { nome: "Pró-labore Emanuel", valorCent: 100_000, periodicidade: "SEMANAL" },
  { nome: "Combustível", valorCent: 30_000, periodicidade: "SEMANAL" },
  { nome: "Aluguel do galpão", valorCent: 110_000, periodicidade: "MENSAL" },
  { nome: "General liability", valorCent: 25_000, periodicidade: "MENSAL" },
  { nome: "Energia elétrica", valorCent: 12_000, periodicidade: "MENSAL" },
];

async function criarCustosFixos() {
  if ((await prisma.custoFixo.count()) > 0) return;
  await prisma.custoFixo.createMany({ data: CUSTOS_FIXOS_INICIAIS });
  console.log(`Custos fixos iniciais criados: ${CUSTOS_FIXOS_INICIAIS.length}`);
}

async function main() {
  await criarAdmin(
    process.env.ADMIN1_NOME ?? "Alessandro de Oliveira",
    (process.env.ADMIN1_EMAIL ?? "").trim().toLowerCase(),
    (process.env.ADMIN1_SENHA ?? "").trim(),
  );
  await criarAdmin(
    process.env.ADMIN2_NOME ?? "Emanuel Lopez",
    (process.env.ADMIN2_EMAIL ?? "").trim().toLowerCase(),
    (process.env.ADMIN2_SENHA ?? "").trim(),
  );
  await criarCustosFixos();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
