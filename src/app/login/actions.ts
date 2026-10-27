"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { criarSessao, encerrarSessao } from "@/lib/auth";

export async function entrar(_estado: { erro?: string } | undefined, form: FormData) {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const senha = String(form.get("senha") ?? "");
  const usuario = await db.usuario.findUnique({ where: { email } });

  if (!usuario || !usuario.ativo || !(await bcrypt.compare(senha, usuario.senhaHash))) {
    return { erro: "E-mail ou senha incorretos." };
  }

  await criarSessao({ id: usuario.id, nome: usuario.nome, papel: usuario.papel as "ADMIN" | "FUNCIONARIO" });
  redirect(usuario.papel === "ADMIN" ? "/" : "/ponto");
}

export async function sair() {
  encerrarSessao();
  redirect("/login");
}
