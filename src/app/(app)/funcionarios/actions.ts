"use server";

import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { exigirAdmin, exigirUsuario } from "@/lib/auth";
import { paraCentavos, texto } from "@/lib/format";
import { gerarConvite } from "@/lib/convite";
import type { EstadoForm } from "@/components/Formulario";

function dadosFuncionario(form: FormData) {
  const valor = paraCentavos(form.get("valor"));
  const diaria = form.get("tipoPagamento") === "DIARIA";
  return {
    nome: String(form.get("nome") ?? "").trim(),
    email: texto(form.get("email"))?.toLowerCase() ?? null,
    telefone: texto(form.get("telefone")),
    funcao: texto(form.get("funcao")),
    tipoPagamento: diaria ? "DIARIA" : "HORA",
    valorHoraCent: diaria ? 0 : valor,
    valorDiariaCent: diaria ? valor : 0,
    vinculo: form.get("vinculo") === "HELPER" ? "HELPER" : "FIXO",
    papel: form.get("papel") === "ADMIN" ? "ADMIN" : "FUNCIONARIO",
  };
}

const soDigitos = (t: string | null) => (t ?? "").replace(/\D/g, "").slice(-10);

/** O login é por e-mail ou telefone, então os dois precisam ser únicos entre os usuários. */
async function conferirLogin(dados: ReturnType<typeof dadosFuncionario>, id?: string): Promise<string | null> {
  if (!dados.nome) return "Informe o nome.";
  if (!dados.email && soDigitos(dados.telefone).length < 10) return "Informe o telefone (com DDD) ou o e-mail: é por ele que a pessoa entra no app.";
  if (dados.email) {
    const outro = await db.usuario.findUnique({ where: { email: dados.email } });
    if (outro && outro.id !== id) return "Já existe um usuário com este e-mail.";
  }
  if (dados.telefone) {
    const comTelefone = await db.usuario.findMany({ where: { telefone: { not: null }, NOT: id ? { id } : undefined } });
    if (comTelefone.some((u) => soDigitos(u.telefone) === soDigitos(dados.telefone) && soDigitos(dados.telefone).length >= 10)) {
      return "Já existe um usuário com este telefone.";
    }
  }
  return null;
}

export async function criarFuncionario(_e: EstadoForm, form: FormData): Promise<EstadoForm> {
  await exigirAdmin();
  const dados = dadosFuncionario(form);
  const senha = String(form.get("senha") ?? "");
  const problema = await conferirLogin(dados);
  if (problema) return { erro: problema };
  if (senha && senha.length < 6) return { erro: "A senha precisa ter pelo menos 6 caracteres." };

  // Sem senha: o funcionário cria a dele pelo link de convite. Até lá a conta tem uma senha aleatória que ninguém conhece.
  const senhaHash = await bcrypt.hash(senha || randomBytes(32).toString("hex"), 10);
  const usuario = await db.usuario.create({ data: { ...dados, senhaHash } });
  revalidatePath("/funcionarios");
  if (senha) redirect(`/funcionarios/${usuario.id}`);
  const token = await gerarConvite(usuario.id);
  redirect(`/funcionarios/${usuario.id}?convite=${token}`);
}

export async function atualizarFuncionario(id: string, _e: EstadoForm, form: FormData): Promise<EstadoForm> {
  const admin = await exigirAdmin();
  const dados = dadosFuncionario(form);
  const ativo = form.get("ativo") === "on";
  const problema = await conferirLogin(dados, id);
  if (problema) return { erro: problema };
  if (id === admin.id && (dados.papel !== "ADMIN" || !ativo)) {
    return { erro: "Você não pode remover o seu próprio acesso de administrador." };
  }

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

export async function novoConvite(id: string) {
  await exigirAdmin();
  const token = await gerarConvite(id);
  redirect(`/funcionarios/${id}?convite=${token}`);
}
