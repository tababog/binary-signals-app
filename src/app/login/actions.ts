"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { criarSessao, encerrarSessao } from "@/lib/auth";

/** Login por e-mail ou pelo telefone (compara só os últimos 10 dígitos, então tanto faz o formato digitado). */
async function buscarPorLogin(login: string) {
  if (login.includes("@")) return db.usuario.findUnique({ where: { email: login } });
  const digitos = login.replace(/\D/g, "").slice(-10);
  if (digitos.length < 10) return null;
  const comTelefone = await db.usuario.findMany({ where: { telefone: { not: null } } });
  return comTelefone.find((u) => (u.telefone ?? "").replace(/\D/g, "").slice(-10) === digitos) ?? null;
}

export async function entrar(_estado: { erro?: string } | undefined, form: FormData) {
  const login = String(form.get("email") ?? "").trim().toLowerCase();
  const senha = String(form.get("senha") ?? "");
  const usuario = await buscarPorLogin(login);

  if (!usuario || !usuario.ativo || !(await bcrypt.compare(senha, usuario.senhaHash))) {
    return { erro: "Login ou senha incorretos." };
  }

  await criarSessao({ id: usuario.id, nome: usuario.nome, papel: usuario.papel as "ADMIN" | "FUNCIONARIO" });
  redirect(usuario.papel === "ADMIN" ? "/" : "/ponto");
}

export async function sair() {
  encerrarSessao();
  redirect("/login");
}
