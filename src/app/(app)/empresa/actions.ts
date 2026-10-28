"use server";

import { getT } from "@/i18n/servidor";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { lerData, paraCentavos } from "@/lib/format";
import { apagarComprovante, salvarComprovante } from "@/lib/uploads";
import type { EstadoForm } from "@/components/Formulario";

function atualizar() {
  // O rateio muda o custo de todas as obras
  revalidatePath("/", "layout");
}

export async function lancarGastoEmpresa(_e: EstadoForm, form: FormData): Promise<EstadoForm> {
  await exigirAdmin();
  const descricao = String(form.get("descricao") ?? "").trim();
  const valorCent = paraCentavos(form.get("valor"));
  if (!descricao) return { erro: getT()("Descreva o gasto (ex.: serra circular).") };
  if (valorCent <= 0) return { erro: getT()("Informe o valor.") };

  let comprovante: string | null = null;
  try {
    comprovante = await salvarComprovante(form.get("comprovante"));
  } catch (e) {
    return { erro: getT()((e as Error).message) };
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

