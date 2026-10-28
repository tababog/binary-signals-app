"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { exigirAdmin, exigirUsuario } from "@/lib/auth";
import { paraCentavos, texto } from "@/lib/format";
import type { EstadoForm } from "@/components/Formulario";

function dadosFuncionario(form: FormData) {
  return {
    nome: String(form.get("nome") ?? "").trim(),
    email: String(form.get("email") ?? "").trim().toLowerCase(),
    telefone: texto(form.get("telefone")),
    funcao: texto(form.get("funcao")),
    valorHoraCent: paraCentavos(form.get("valorHora")),
    papel: form.get("papel") === "ADMIN" ? "ADMIN" : "FUNCIONARIO",
  };
}

export async function criarFuncionario(_e: EstadoForm, form: FormData): Promise<EstadoForm> {
  await exigirAdmin();
  const dados = dadosFuncionario(form);
  const senha = String(form.get("senha") ?? "");
  if (!dados.nome || !dados.email) return { erro: "Informe nome e e-mail." };
  if (senha.length < 6) return { erro: "A senha precisa ter pelo menos 6 caracteres." };
  if (await db.usuario.findUnique({ where: { email: dados.email } })) return { erro: "Já existe um usuário com este e-mail." };

  const usuario = await db.usuario.create({ data: { ...dados, senhaHash: await bcrypt.hash(senha, 10) } });
  revalidatePath("/funcionarios");
  redirect(`/funcionarios/${usuario.id}`);
}

export async function atualizarFuncionario(id: string, _e: EstadoForm, form: FormData): Promise<EstadoForm> {
  const admin = await exigirAdmin();
  const dados = dadosFuncionario(form);
  const ativo = form.get("ativo") === "on";
  if (!dados.nome || !dados.email) return { erro: "Informe nome e e-mail." };
  if (id === admin.id && (dados.papel !== "ADMIN" || !ativo)) {
    return { erro: "Você não pode remover o seu próprio acesso de administrador." };
  }
  const mesmoEmail = await db.usuario.findUnique({ where: { email: dados.email } });
  if (mesmoEmail && mesmoEmail.id !== id) return { erro: "Já existe um usuário com este e-mail." };

  const novaSenha = String(form.get("senha") ?? "");
  if (novaSenha && novaSenha.length < 6) return { erro: "A nova senha precisa ter pelo menos 6 caracteres." };

  await db.usuario.update({
    where: { id },
    data: { ...dados, ativo, ...(novaSenha ? { senhaHash: await bcrypt.hash(novaSenha, 10) } : {}) },
  });
  revalidatePath("/funcionarios");
  redirect(`/funcionarios/${id}?salvo=1`);
}

export async function trocarMinhaSenha(_e: EstadoForm, form: FormData): Promise<EstadoForm> {
  const usuario = await exigirUsuario();
  const atual = String(form.get("atual") ?? "");
  const nova = String(form.get("nova") ?? "");
  if (!(await bcrypt.compare(atual, usuario.senhaHash))) return { erro: "Senha atual incorreta." };
  if (nova.length < 6) return { erro: "A nova senha precisa ter pelo menos 6 caracteres." };
  if (nova !== form.get("confirmacao")) return { erro: "A confirmação não confere com a nova senha." };
  await db.usuario.update({ where: { id: usuario.id }, data: { senhaHash: await bcrypt.hash(nova, 10) } });
  redirect("/conta?ok=1");
}
