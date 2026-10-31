"use server";

import { getT } from "@/i18n/servidor";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { lerDataHora, texto } from "@/lib/format";
import type { EstadoForm } from "@/components/Formulario";
import { recalcularCustosDoDia, valoresDoRegistro } from "@/lib/custo-ponto";

function atualizar() {
  revalidatePath("/registros");
  revalidatePath("/ponto");
}

export async function corrigirRegistro(id: string, _e: EstadoForm, form: FormData): Promise<EstadoForm> {
  await exigirAdmin();
  const entrada = lerDataHora(form.get("entrada"));
  const saida = lerDataHora(form.get("saida"));
  if (!entrada) return { erro: getT()("Informe a entrada.") };
  if (saida && saida <= entrada) return { erro: getT()("A saída precisa ser depois da entrada.") };
  const antes = await db.registroPonto.findUniqueOrThrow({ where: { id } });
  // Obra errada (o funcionário escolheu outra ao bater o ponto): o administrador troca aqui
  const obraId = String(form.get("obraId") ?? "") || antes.obraId;
  if (obraId !== antes.obraId && !(await db.obra.findUnique({ where: { id: obraId } }))) return { erro: getT()("Escolha uma obra ativa.") };
  await db.registroPonto.update({ where: { id }, data: { obraId, entrada, saida, custoCent: saida ? undefined : null, observacao: texto(form.get("observacao")) } });
  // A correção pode mudar o dia do registro: recalcula o dia antigo e o novo
  await recalcularCustosDoDia(antes.usuarioId, antes.entrada);
  await recalcularCustosDoDia(antes.usuarioId, entrada);
  atualizar();
  return {};
}

export async function lancarRegistroManual(_e: EstadoForm, form: FormData): Promise<EstadoForm> {
  await exigirAdmin();
  const usuarioId = String(form.get("usuarioId") ?? "");
  const obraId = String(form.get("obraId") ?? "");
  const entrada = lerDataHora(form.get("entrada"));
  const saida = lerDataHora(form.get("saida"));
  if (!usuarioId || !obraId) return { erro: getT()("Escolha o funcionário e a obra.") };
  if (!entrada) return { erro: getT()("Informe a entrada.") };
  if (saida && saida <= entrada) return { erro: getT()("A saída precisa ser depois da entrada.") };
  if (entrada.getTime() > Date.now() + 5 * 60_000 || (saida && saida.getTime() > Date.now() + 5 * 60_000)) return { erro: getT()("O horário não pode ser no futuro.") };
  // Sem saída = ponto aberto (o funcionário esqueceu de marcar a entrada): só um aberto por pessoa
  if (!saida && (await db.registroPonto.findFirst({ where: { usuarioId, saida: null } }))) {
    return { erro: getT()("Este funcionário já está com um ponto aberto. Feche esse primeiro.") };
  }

  const usuario = await db.usuario.findUniqueOrThrow({ where: { id: usuarioId } });
  await db.registroPonto.create({
    data: { usuarioId, obraId, entrada, saida, manual: true, ...valoresDoRegistro(usuario), observacao: texto(form.get("observacao")) ?? "Lançado pelo administrador" },
  });
  if (saida) await recalcularCustosDoDia(usuarioId, entrada);
  atualizar();
  revalidatePath("/");
  return {};
}

/** Troca a obra de um registro (no Painel, para quem está trabalhando agora e marcou a obra errada). */
export async function trocarObraRegistro(id: string, form: FormData) {
  await exigirAdmin();
  const obraId = String(form.get("obraId") ?? "");
  const obra = obraId ? await db.obra.findUnique({ where: { id: obraId } }) : null;
  if (!obra) return;
  const r = await db.registroPonto.update({ where: { id }, data: { obraId } });
  // Com a saída já marcada, o custo do dia muda de obra junto
  if (r.saida) await recalcularCustosDoDia(r.usuarioId, r.entrada);
  atualizar();
  revalidatePath("/");
}

/** O funcionário esqueceu de marcar a saída: o administrador fecha o ponto no Painel com a hora que ele saiu. */
export async function fecharPonto(id: string, _e: EstadoForm, form: FormData): Promise<EstadoForm> {
  await exigirAdmin();
  const saida = lerDataHora(form.get("saida"));
  if (!saida) return { erro: getT()("Informe a hora da saída.") };
  const r = await db.registroPonto.findUniqueOrThrow({ where: { id } });
  if (r.saida) return { erro: getT()("Este ponto já foi fechado.") };
  if (saida <= r.entrada) return { erro: getT()("A saída precisa ser depois da entrada.") };
  if (saida.getTime() > Date.now() + 5 * 60_000) return { erro: getT()("A saída não pode ser no futuro.") };
  await db.registroPonto.update({
    where: { id },
    data: { saida, observacao: [r.observacao, "Saída lançada pelo administrador"].filter(Boolean).join(" · ") },
  });
  await recalcularCustosDoDia(r.usuarioId, r.entrada);
  atualizar();
  revalidatePath("/");
  return {};
}

export async function excluirRegistro(id: string) {
  await exigirAdmin();
  const r = await db.registroPonto.delete({ where: { id } });
  await recalcularCustosDoDia(r.usuarioId, r.entrada);
  atualizar();
}
