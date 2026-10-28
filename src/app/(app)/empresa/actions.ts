"use server";

import { getT } from "@/i18n/servidor";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { lerData, paraCentavos } from "@/lib/format";
import { PERIODICIDADES } from "@/lib/custos-fixos";
import { apagarComprovante, salvarComprovante } from "@/lib/uploads";
import type { EstadoForm } from "@/components/Formulario";
import { lerFluxoCaixa, mediasCustosFixos } from "@/lib/planilha-fluxo";

function atualizar() {
  // O rateio muda o custo de todas as obras
  revalidatePath("/", "layout");
}

export async function salvarCustoFixo(id: string | null, _e: EstadoForm, form: FormData): Promise<EstadoForm> {
  await exigirAdmin();
  const nome = String(form.get("nome") ?? "").trim();
  const valorCent = paraCentavos(form.get("valor"));
  const periodicidade = String(form.get("periodicidade") ?? "MENSAL");
  if (!nome) return { erro: getT()("Informe o nome do custo.") };
  if (valorCent <= 0) return { erro: getT()("Informe um valor maior que zero.") };
  if (!(periodicidade in PERIODICIDADES)) return { erro: getT()("Escolha a periodicidade.") };

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

/**
 * Troca os custos fixos pela média real da planilha de fluxo de caixa do Drive.
 * Os itens marcados viram custos mensais (origem PLANILHA) e os cadastrados à mão marcados em "desativar" deixam de contar.
 */
export async function importarCustosFixos(_e: EstadoForm, form: FormData): Promise<EstadoForm> {
  await exigirAdmin();
  const t = getT();
  const lido = await lerFluxoCaixa();
  if (!lido.ok) return { erro: t("Não consegui ler a planilha do Drive.") };
  const medias = mediasCustosFixos(lido.fluxo);
  const escolhidos = new Set(form.getAll("item").map(String));
  const desativar = form.getAll("desativar").map(String);

  await db.$transaction(async (tx) => {
    const daPlanilha = await tx.custoFixo.findMany({ where: { origem: { startsWith: "PLANILHA:" } } });
    for (const m of medias.itens) {
      const origem = `PLANILHA:${m.item}`;
      const existente = daPlanilha.find((c) => c.origem === origem);
      const dados = { nome: m.item, valorCent: m.mediaCent, periodicidade: "MENSAL", ativo: escolhidos.has(m.item), origem };
      if (existente) await tx.custoFixo.update({ where: { id: existente.id }, data: dados });
      else if (escolhidos.has(m.item)) await tx.custoFixo.create({ data: dados });
    }
    if (desativar.length) await tx.custoFixo.updateMany({ where: { id: { in: desativar }, origem: null }, data: { ativo: false } });
  });
  atualizar();
  return { ok: t("Custos fixos atualizados com a média de {n} meses da planilha.", { n: medias.meses }) };
}
