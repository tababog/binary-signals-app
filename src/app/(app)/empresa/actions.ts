"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { lerData, paraCentavos } from "@/lib/format";
import { PERIODICIDADES } from "@/lib/custos-fixos";
import { apagarComprovante, salvarComprovante } from "@/lib/uploads";
import type { EstadoForm } from "@/components/Formulario";

function atualizar() {
  // O rateio muda o custo de todas as obras
  revalidatePath("/", "layout");
}

export async function salvarCustoFixo(id: string | null, _e: EstadoForm, form: FormData): Promise<EstadoForm> {
  await exigirAdmin();
  const nome = String(form.get("nome") ?? "").trim();
  const valorCent = paraCentavos(form.get("valor"));
  const periodicidade = String(form.get("periodicidade") ?? "MENSAL");
  if (!nome) return { erro: "Informe o nome do custo." };
  if (valorCent <= 0) return { erro: "Informe um valor maior que zero." };
  if (!(periodicidade in PERIODICIDADES)) return { erro: "Escolha a periodicidade." };

  const dados = { nome, valorCent, periodicidade, ativo: id ? form.get("ativo") === "on" : true };
  if (id) await db.custoFixo.update({ where: { id }, data: dados });
  else await db.custoFixo.create({ data: dados });
  atualizar();
  return {};
}

export async function excluirCustoFixo(id: string) {
  await exigirAdmin();
  await db.custoFixo.delete({ where: { id } });
  atualizar();
}

export async function lancarGastoEmpresa(_e: EstadoForm, form: FormData): Promise<EstadoForm> {
  await exigirAdmin();
  const descricao = String(form.get("descricao") ?? "").trim();
  const valorCent = paraCentavos(form.get("valor"));
  if (!descricao) return { erro: "Descreva o gasto (ex.: serra circular)." };
  if (valorCent <= 0) return { erro: "Informe o valor." };

  let comprovante: string | null = null;
  try {
    comprovante = await salvarComprovante(form.get("comprovante"));
  } catch (e) {
    return { erro: (e as Error).message };
  }
  await db.gastoEmpresa.create({ data: { descricao, valorCent, data: lerData(form.get("data")) ?? new Date(), comprovante } });
  atualizar();
  return {};
}

export async function excluirGastoEmpresa(id: string) {
  await exigirAdmin();
  const gasto = await db.gastoEmpresa.delete({ where: { id } });
  await apagarComprovante(gasto.comprovante);
  atualizar();
}
