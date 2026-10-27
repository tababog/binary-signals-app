"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { lerData, paraCentavos, texto } from "@/lib/format";
import { CATEGORIAS_DESPESA, STATUS_OBRA } from "@/lib/constantes";
import { apagarComprovante, salvarComprovante } from "@/lib/uploads";
import type { EstadoForm } from "@/components/Formulario";

function coordenada(valor: FormDataEntryValue | null, limite: number) {
  const s = String(valor ?? "").trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) && Math.abs(n) <= limite ? n : null;
}

function atualizar(obraId: string) {
  revalidatePath(`/obras/${obraId}`);
  revalidatePath("/obras");
  revalidatePath("/");
}

export async function salvarObra(id: string | null, _e: EstadoForm, form: FormData): Promise<EstadoForm> {
  await exigirAdmin();
  const status = String(form.get("status") ?? "PLANEJADA");
  const dados = {
    nome: String(form.get("nome") ?? "").trim(),
    clienteId: String(form.get("clienteId") ?? ""),
    endereco: texto(form.get("endereco")),
    descricao: texto(form.get("descricao")),
    status: status in STATUS_OBRA ? status : "PLANEJADA",
    valorContratoCent: paraCentavos(form.get("valorContrato")),
    dataInicio: lerData(form.get("dataInicio")),
    dataPrevista: lerData(form.get("dataPrevista")),
    progresso: Math.min(100, Math.max(0, Number(form.get("progresso")) || 0)),
    latitude: coordenada(form.get("latitude"), 90),
    longitude: coordenada(form.get("longitude"), 180),
    raioMetros: Math.min(5000, Math.max(20, Number(form.get("raioMetros")) || 200)),
  };
  if (!dados.nome) return { erro: "Informe o nome da obra." };
  if ((dados.latitude == null) !== (dados.longitude == null)) return { erro: "Informe latitude e longitude da obra (ou deixe as duas em branco)." };
  if (!dados.clienteId) return { erro: "Escolha o cliente da obra." };

  const obra = id ? await db.obra.update({ where: { id }, data: dados }) : await db.obra.create({ data: dados });
  atualizar(obra.id);
  redirect(`/obras/${obra.id}`);
}

export async function atualizarProgresso(obraId: string, form: FormData) {
  await exigirAdmin();
  const progresso = Math.min(100, Math.max(0, Number(form.get("progresso")) || 0));
  await db.obra.update({ where: { id: obraId }, data: { progresso } });
  atualizar(obraId);
}

export async function excluirObra(id: string) {
  await exigirAdmin();
  const comprovantes = await db.lancamento.findMany({ where: { obraId: id, comprovante: { not: null } }, select: { comprovante: true } });
  await db.obra.delete({ where: { id } });
  await Promise.all(comprovantes.map((c) => apagarComprovante(c.comprovante)));
  revalidatePath("/obras");
  revalidatePath("/");
  redirect("/obras");
}

// ---------- Orçamento ----------

export async function adicionarItemOrcamento(obraId: string, _e: EstadoForm, form: FormData): Promise<EstadoForm> {
  await exigirAdmin();
  const categoria = String(form.get("categoria") ?? "");
  const descricao = String(form.get("descricao") ?? "").trim();
  const valorCent = paraCentavos(form.get("valor"));
  if (!(categoria in CATEGORIAS_DESPESA)) return { erro: "Escolha a categoria." };
  if (!descricao) return { erro: "Descreva o item do orçamento." };
  if (valorCent <= 0) return { erro: "Informe um valor maior que zero." };
  await db.itemOrcamento.create({ data: { obraId, categoria, descricao, valorCent } });
  atualizar(obraId);
  redirect(`/obras/${obraId}?aba=orcamento`);
}

export async function removerItemOrcamento(id: string) {
  await exigirAdmin();
  const item = await db.itemOrcamento.delete({ where: { id } });
  atualizar(item.obraId);
}

// ---------- Fluxo de caixa da obra ----------

export async function lancarDespesa(obraId: string, _e: EstadoForm, form: FormData): Promise<EstadoForm> {
  const usuario = await exigirAdmin();
  const categoria = String(form.get("categoria") ?? "MATERIAL");
  const descricao = String(form.get("descricao") ?? "").trim();
  const valorCent = paraCentavos(form.get("valor"));
  const dataLanc = lerData(form.get("data")) ?? new Date();
  if (!(categoria in CATEGORIAS_DESPESA)) return { erro: "Escolha a categoria." };
  if (!descricao) return { erro: "Descreva a despesa (ex.: 20 sacos de cimento)." };
  if (valorCent <= 0) return { erro: "Informe o valor da despesa." };

  let comprovante: string | null = null;
  try {
    comprovante = await salvarComprovante(form.get("comprovante"));
  } catch (e) {
    return { erro: (e as Error).message };
  }

  await db.lancamento.create({
    data: {
      obraId,
      tipo: "SAIDA",
      categoria,
      descricao,
      valorCent,
      data: dataLanc,
      formaPagamento: texto(form.get("formaPagamento")),
      fornecedorId: texto(form.get("fornecedorId")),
      comprovante,
      criadoPorId: usuario.id,
    },
  });
  atualizar(obraId);
  redirect(`/obras/${obraId}?aba=caixa`);
}

export async function lancarRecebimento(obraId: string, _e: EstadoForm, form: FormData): Promise<EstadoForm> {
  const usuario = await exigirAdmin();
  const valorCent = paraCentavos(form.get("valor"));
  if (valorCent <= 0) return { erro: "Informe o valor recebido." };

  let comprovante: string | null = null;
  try {
    comprovante = await salvarComprovante(form.get("comprovante"));
  } catch (e) {
    return { erro: (e as Error).message };
  }

  await db.lancamento.create({
    data: {
      obraId,
      tipo: "ENTRADA",
      categoria: "PAGAMENTO_CLIENTE",
      descricao: texto(form.get("descricao")) ?? "Pagamento do cliente",
      valorCent,
      data: lerData(form.get("data")) ?? new Date(),
      formaPagamento: texto(form.get("formaPagamento")),
      comprovante,
      criadoPorId: usuario.id,
    },
  });
  atualizar(obraId);
  redirect(`/obras/${obraId}?aba=caixa`);
}

export async function excluirLancamento(id: string) {
  await exigirAdmin();
  const lanc = await db.lancamento.delete({ where: { id } });
  await apagarComprovante(lanc.comprovante);
  atualizar(lanc.obraId);
}
