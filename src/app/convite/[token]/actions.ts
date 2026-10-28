"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { criarSessao } from "@/lib/auth";
import { usuarioDoConvite } from "@/lib/convite";

export async function criarSenhaPeloConvite(token: string, _e: { erro?: string } | undefined, form: FormData) {
  const usuario = await usuarioDoConvite(token);
  if (!usuario) return { erro: "Este link expirou ou já foi usado. Peça um novo link ao administrador." };

  const senha = String(form.get("senha") ?? "");
  if (senha.length < 6) return { erro: "A senha precisa ter pelo menos 6 caracteres." };
  if (senha !== form.get("confirmacao")) return { erro: "As duas senhas não são iguais." };

  // O link só vale uma vez
  await db.usuario.update({
    where: { id: usuario.id },
    data: { senhaHash: await bcrypt.hash(senha, 10), conviteHash: null, conviteExpira: null },
  });
  await criarSessao({ id: usuario.id, nome: usuario.nome, papel: usuario.papel as "ADMIN" | "FUNCIONARIO" });
  redirect(usuario.papel === "ADMIN" ? "/" : "/ponto");
}
