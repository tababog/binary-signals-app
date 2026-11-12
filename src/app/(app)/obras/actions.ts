"use server";

import { getT } from "@/i18n/servidor";
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
    latitude: coordenada(form.get("latitude"), 90),
    longitude: coordenada(form.get("longitude"), 180),
    raioMetros: Math.min(5000, Math.max(20, Number(form.get("raioMetros")) || 200)),
    diasPrevistos: Math.min(1000, Math.max(0, Math.round(Number(form.get("diasPrevistos")) || 0))),
  };
  if (!dados.nome) return { erro: getT()("Informe o nome da obra.") };
  if ((dados.latitude == null) !== (dados.longitude == null)) return { erro: getT()("Informe latitude e longitude da obra (ou deixe as duas em branco).") };
  if (!dados.clienteId) return { erro: getT()("Escolha o cliente da obra.") };

  const obra = id ? await db.obra.update({ where: { id }, data: dados }) : await db.obra.create({ data: dados });
  atualizar(obra.id);
  redirect(`/obras/${obra.id}`);
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
  if (!(categoria in CATEGORIAS_DESPESA)) return { erro: getT()("Escolha a categoria.") };
  if (!descricao) return { erro: getT()("Descreva o item do orçamento.") };
  if (valorCent <= 0) return { erro: getT()("Informe um valor maior que zero.") };
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
  if (!(categoria in CATEGORIAS_DESPESA)) return { erro: getT()("Escolha a categoria.") };
  if (!descricao) return { erro: getT()("Descreva a despesa (ex.: 20 sacos de cimento).") };
  if (valorCent <= 0) return { erro: getT()("Informe o valor da despesa.") };

  let comprovante: string | null = null;
  try {
    comprovante = await salvarComprovante(form.get("comprovante"));
  } catch (e) {
    return { erro: getT()((e as Error).message) };
  }
  // Despesa lançada a partir do recibo que um funcionário mandou: usa a foto dele (se não tirou outra) e marca como lançado
  const reciboId = texto(form.get("reciboId"));
  const recibo = reciboId ? await db.reciboFuncionario.findUnique({ where: { id: reciboId } }) : null;
  if (recibo && !comprovante) comprovante = recibo.arquivo;

  // Fornecedor/subcontratado novo cadastrado no próprio lançamento
  let fornecedorId = texto(form.get("fornecedorId"));
  if (fornecedorId === "NOVO_FORNECEDOR" || fornecedorId === "NOVO_SUBCONTRATADO") {
    const nome = String(form.get("fornecedorNome") ?? "").trim();
    if (!nome) return { erro: getT()("Informe o nome do fornecedor ou subcontratado novo.") };
    const novo = await db.fornecedor.create({ data: { nome, tipo: fornecedorId === "NOVO_SUBCONTRATADO" ? "SUBCONTRATADO" : "FORNECEDOR" } });
    fornecedorId = novo.id;
  }

  const lancamento = await db.lancamento.create({
    data: {
      obraId,
      tipo: "SAIDA",
      categoria,
      descricao,
      valorCent,
      data: dataLanc,
      formaPagamento: texto(form.get("formaPagamento")),
      fornecedorId,
      comprovante,
      criadoPorId: usuario.id,
    },
  });
  if (recibo) {
    await db.reciboFuncionario.update({ where: { id: recibo.id }, data: { lancamentoId: lancamento.id, lancadoEm: new Date(), obraId } });
    revalidatePath("/");
    revalidatePath("/recibos");
  }
  atualizar(obraId);
  redirect(`/obras/${obraId}?aba=caixa`);
}

export async function lancarRecebimento(obraId: string, _e: EstadoForm, form: FormData): Promise<EstadoForm> {
  const usuario = await exigirAdmin();
  const valorCent = paraCentavos(form.get("valor"));
  if (valorCent <= 0) return { erro: getT()("Informe o valor recebido.") };

  let comprovante: string | null = null;
  try {
    comprovante = await salvarComprovante(form.get("comprovante"));
  } catch (e) {
    return { erro: getT()((e as Error).message) };
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

/** Corrige um lançamento do caixa da obra (despesa ou pagamento do cliente): valor, data, descrição, categoria,
 * fornecedor, forma de pagamento e a foto do recibo (trocar ou tirar). */
export async function editarLancamento(id: string, _e: EstadoForm, form: FormData): Promise<EstadoForm> {
  await exigirAdmin();
  const t = getT();
  const lanc = await db.lancamento.findUnique({ where: { id } });
  if (!lanc) return { erro: t("Lançamento não encontrado.") };
  const valorCent = paraCentavos(form.get("valor"));
  if (valorCent <= 0) return { erro: t("Informe o valor.") };
  const dataLanc = lerData(form.get("data")) ?? lanc.data;
  const despesa = lanc.tipo === "SAIDA";
  const descricao = String(form.get("descricao") ?? "").trim() || (despesa ? "" : "Pagamento do cliente");
  if (!descricao) return { erro: t("Descreva a despesa (ex.: 20 sacos de cimento).") };
  const categoria = despesa ? String(form.get("categoria") ?? "") : lanc.categoria;
  if (despesa && !(categoria in CATEGORIAS_DESPESA)) return { erro: t("Escolha a categoria.") };

  let fornecedorId = despesa ? texto(form.get("fornecedorId")) : null;
  if (fornecedorId === "NOVO_FORNECEDOR" || fornecedorId === "NOVO_SUBCONTRATADO") {
    const nome = String(form.get("fornecedorNome") ?? "").trim();
    if (!nome) return { erro: t("Informe o nome do fornecedor ou subcontratado novo.") };
    const novo = await db.fornecedor.create({ data: { nome, tipo: fornecedorId === "NOVO_SUBCONTRATADO" ? "SUBCONTRATADO" : "FORNECEDOR" } });
    fornecedorId = novo.id;
  }

  // Foto: uma nova substitui a antiga; "tirar a foto" deixa sem. A foto de um recibo de funcionário não é apagada.
  let comprovante = lanc.comprovante;
  let novaFoto: string | null = null;
  try {
    novaFoto = await salvarComprovante(form.get("comprovante"));
  } catch (e) {
    return { erro: t((e as Error).message) };
  }
  if (novaFoto) comprovante = novaFoto;
  else if (form.get("tirarFoto") === "on") comprovante = null;

  await db.lancamento.update({
    where: { id },
    data: { valorCent, data: dataLanc, descricao, categoria, fornecedorId, formaPagamento: texto(form.get("formaPagamento")), comprovante },
  });
  if (lanc.comprovante && comprovante !== lanc.comprovante) {
    const deRecibo = await db.reciboFuncionario.count({ where: { arquivo: lanc.comprovante } });
    if (!deRecibo) await apagarComprovante(lanc.comprovante);
  }
  revalidatePath("/fornecedores");
  atualizar(lanc.obraId);
  redirect(`/obras/${lanc.obraId}?aba=caixa`);
}

export async function excluirLancamento(id: string, voltarParaCaixa = false) {
  await exigirAdmin();
  const lanc = await db.lancamento.delete({ where: { id } });
  // Despesa que veio do recibo de um funcionário: o recibo volta para "a lançar" e a foto fica guardada
  const recibos = await db.reciboFuncionario.updateMany({ where: { lancamentoId: id }, data: { lancamentoId: null, lancadoEm: null } });
  if (!recibos.count) await apagarComprovante(lanc.comprovante);
  revalidatePath("/");
  revalidatePath("/fornecedores");
  atualizar(lanc.obraId);
  if (voltarParaCaixa) redirect(`/obras/${lanc.obraId}?aba=caixa`);
}
