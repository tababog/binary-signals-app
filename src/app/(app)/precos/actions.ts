"use server";

import { getT } from "@/i18n/servidor";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { lerData, paraCentavos, texto } from "@/lib/format";
import { CONDADOS_CT, PREFIXO_PERSONALIZADO, SUBSERVICOS, TIPOS_SERVICO, UNIDADES } from "@/lib/constantes";
import type { EstadoForm } from "@/components/Formulario";

/** Grava um trabalho no banco de preços (novo ou edição). `obraId` liga o trabalho à obra concluída de origem. */
export async function salvarTrabalho(id: string | null, obraId: string | null, _e: EstadoForm, form: FormData): Promise<EstadoForm> {
  await exigirAdmin();
  const t = getT();

  let tipo = String(form.get("tipoServico") ?? "");
  if (tipo === "OUTRO") {
    const nome = String(form.get("servicoOutro") ?? "").trim().slice(0, 60);
    if (!nome) return { erro: t("Escreva qual é o serviço em \"Outros\".") };
    await db.servicoPersonalizado.upsert({ where: { nome }, update: {}, create: { nome } });
    tipo = `${PREFIXO_PERSONALIZADO}${nome}`;
  }
  if (!(tipo in TIPOS_SERVICO) && !tipo.startsWith(PREFIXO_PERSONALIZADO)) return { erro: t("Escolha o tipo de serviço.") };
  const validos = new Set((SUBSERVICOS[tipo] ?? []).flatMap((s) => [s.k, ...(s.subs ?? []).map((f) => `${s.k}.${f.k}`)]));
  const subServicos = form.getAll("subServicos").map(String).filter((c) => validos.has(c)).join(",");

  const descricao = String(form.get("descricao") ?? "").trim();
  if (!descricao) return { erro: t("Descreva o trabalho.") };
  const quantidade = Number(String(form.get("quantidade") ?? "").replace(",", "."));
  if (!(quantidade > 0)) return { erro: t("Informe a quantidade (sq ft, ft linear, unidades ou 1 serviço).") };
  const precoCobradoCent = paraCentavos(form.get("preco"));
  if (precoCobradoCent <= 0) return { erro: t("Informe o preço cobrado do cliente.") };
  const unidade = String(form.get("unidade") ?? "");
  const condado = String(form.get("condado") ?? "");

  const dados = {
    tipoServico: tipo,
    subServicos: subServicos || null,
    descricao,
    cidade: texto(form.get("cidade")),
    condado: CONDADOS_CT.includes(condado) ? condado : null,
    quantidade,
    unidade: unidade in UNIDADES ? unidade : "SERVICO",
    data: lerData(form.get("data")),
    custoMaterialCent: paraCentavos(form.get("material")),
    custoMaoObraCent: paraCentavos(form.get("maoObra")),
    custoOutrosCent: paraCentavos(form.get("outros")),
    dias: Math.max(0, Math.round(Number(form.get("dias")) || 0)),
    horas: Math.max(0, Number(String(form.get("horas") ?? "").replace(",", ".")) || 0),
    precoCobradoCent,
    observacoes: texto(form.get("observacoes")),
  };

  if (id) await db.trabalhoReferencia.update({ where: { id }, data: dados });
  else {
    // Uma obra vira no máximo uma referência
    if (obraId && (await db.trabalhoReferencia.findUnique({ where: { obraId } }))) return { erro: t("Esta obra já está no banco de preços.") };
    await db.trabalhoReferencia.create({ data: { ...dados, obraId } });
  }
  revalidatePath("/precos");
  if (obraId) revalidatePath(`/obras/${obraId}`);
  redirect("/precos?salvo=1");
}

export async function excluirTrabalho(id: string) {
  await exigirAdmin();
  await db.trabalhoReferencia.delete({ where: { id } });
  revalidatePath("/precos");
  redirect("/precos");
}
