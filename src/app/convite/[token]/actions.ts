"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { criarSessao } from "@/lib/auth";
import { usuarioDoConvite } from "@/lib/convite";
import { idiomaAtual, getT } from "@/i18n/servidor";

export async function criarSenhaPeloConvite(token: string, _e: { erro?: string } | undefined, form: FormData) {
  const usuario = await usuarioDoConvite(token);
  const t = getT();
  if (!usuario) return { erro: t("Este link expirou ou já foi usado. Peça um novo link ao administrador.") };

  const senha = String(form.get("senha") ?? "");
  if (senha.length < 6) return { erro: t("A senha precisa ter pelo menos 6 caracteres.") };
  if (senha !== form.get("confirmacao")) return { erro: t("As duas senhas não são iguais.") };

  // O link só vale uma vez
  await db.usuario.update({
    where: { id: usuario.id },
    data: { senhaHash: await bcrypt.hash(senha, 10), conviteHash: null, conviteExpira: null, idioma: idiomaAtual() },
  });
  await criarSessao({ id: usuario.id, nome: usuario.nome, papel: usuario.papel as "ADMIN" | "FUNCIONARIO" });
  redirect(usuario.papel === "ADMIN" ? "/" : "/ponto");
}
