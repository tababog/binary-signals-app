"use server";

import { getT, idiomaAtual } from "@/i18n/servidor";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { paraCentavos, texto } from "@/lib/format";
import { CATEGORIAS_DESPESA, CONDADOS_CT, PREFIXO_PERSONALIZADO, SUBSERVICOS, TIPOS_SERVICO, UNIDADES, descreverSubservicos, nomeTipoServico } from "@/lib/constantes";
import { rateioCustosFixos } from "@/lib/custos-fixos";
import { OPCOES_PADRAO, STATUS_ORCAMENTO, referenciaHistorico } from "@/lib/orcamento";
import { gerarPerguntas, precosDeMaterial, sugerirOrcamento, type DadosPrecificacao } from "@/lib/precificacao-ia";
import { dinheiro } from "@/lib/format";
import type { EstadoForm } from "@/components/Formulario";

type Pergunta = { pergunta: string; opcoes: string[]; resposta?: string };

function atualizar(id: string) {
  revalidatePath("/orcamentos");
  revalidatePath(`/orcamentos/${id}`);
}

const numero = (v: FormDataEntryValue | null) => {
  const n = Number(String(v ?? "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};

/** Lê serviço, subserviços e dados do trabalho do formulário (os mesmos campos da visita). */
async function lerTrabalho(form: FormData) {
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
  const condado = String(form.get("condado") ?? "");
  const unidade = String(form.get("unidade") ?? "");
  return {
    dados: {
      tipoServico: tipo,
      subServicos: form.getAll("subServicos").map(String).filter((c) => validos.has(c)).join(",") || null,
      descricao: texto(form.get("descricao")),
      endereco: texto(form.get("endereco")),
      cidade: texto(form.get("cidade")),
      condado: CONDADOS_CT.includes(condado) ? condado : null,
      quantidade: Math.max(0, numero(form.get("quantidade"))),
      unidade: unidade in UNIDADES ? unidade : "SERVICO",
    },
  };
}

export async function criarOrcamento(_e: EstadoForm, form: FormData): Promise<EstadoForm> {
  await exigirAdmin();
  const t = getT();
  const lido = await lerTrabalho(form);
  if ("erro" in lido) return { erro: lido.erro };

  let clienteId = String(form.get("clienteId") ?? "");
  if (clienteId === "NOVO" || !clienteId) {
    const nome = String(form.get("clienteNome") ?? "").trim();
    if (!nome) return { erro: t("Escolha o cliente ou informe o nome do cliente novo.") };
    const novo = await db.cliente.create({ data: { nome, telefone: texto(form.get("clienteTelefone")), endereco: lido.dados.endereco } });
    clienteId = novo.id;
  }
  const visitaId = texto(form.get("visitaId"));

  const orc = await db.orcamento.create({
    data: {
      ...lido.dados,
      clienteId,
      visitaId,
      opcoes: { create: OPCOES_PADRAO.map((nome, ordem) => ({ nome, ordem })) },
    },
  });
  revalidatePath("/orcamentos");
  redirect(`/orcamentos/${orc.id}`);
}

export async function salvarDadosOrcamento(id: string, _e: EstadoForm, form: FormData): Promise<EstadoForm> {
  await exigirAdmin();
  const lido = await lerTrabalho(form);
  if ("erro" in lido) return { erro: lido.erro };
  await db.orcamento.update({ where: { id }, data: lido.dados });
  atualizar(id);
  redirect(`/orcamentos/${id}`);
}

export async function mudarStatusOrcamento(id: string, status: string) {
  await exigirAdmin();
  if (!(status in STATUS_ORCAMENTO)) return;
  await db.orcamento.update({ where: { id }, data: { status } });
  atualizar(id);
}

export async function excluirOrcamento(id: string) {
  await exigirAdmin();
  await db.orcamento.delete({ where: { id } });
  revalidatePath("/orcamentos");
  redirect("/orcamentos");
}

// ---------- opções e itens ----------

async function orcamentoDaOpcao(opcaoId: string) {
  const o = await db.opcaoOrcamento.findUniqueOrThrow({ where: { id: opcaoId }, select: { orcamentoId: true } });
  return o.orcamentoId;
}

export async function salvarOpcao(opcaoId: string, _e: EstadoForm, form: FormData): Promise<EstadoForm> {
  await exigirAdmin();
  const nome = String(form.get("nome") ?? "").trim();
  if (!nome) return { erro: getT()("Dê um nome para a opção.") };
  await db.opcaoOrcamento.update({
    where: { id: opcaoId },
    data: {
      nome,
      descricao: texto(form.get("descricao")),
      diasPrevistos: Math.max(0, Math.round(numero(form.get("dias")))),
      precoCent: paraCentavos(form.get("preco")),
    },
  });
  atualizar(await orcamentoDaOpcao(opcaoId));
  return { ok: getT()("Opção salva.") };
}

function lerItem(form: FormData) {
  const categoria = String(form.get("categoria") ?? "");
  return {
    categoria: categoria in CATEGORIAS_DESPESA ? categoria : "OUTROS",
    descricao: String(form.get("descricao") ?? "").trim(),
    quantidade: Math.max(0, numero(form.get("quantidade")) || 0),
    unidade: texto(form.get("unidade")),
    custoUnitCent: paraCentavos(form.get("custo")),
  };
}

export async function adicionarItem(opcaoId: string, _e: EstadoForm, form: FormData): Promise<EstadoForm> {
  await exigirAdmin();
  const item = lerItem(form);
  if (!item.descricao) return { erro: getT()("Descreva o item.") };
  const ultimo = await db.itemOpcao.findFirst({ where: { opcaoId }, orderBy: { ordem: "desc" } });
  await db.itemOpcao.create({ data: { ...item, opcaoId, ordem: (ultimo?.ordem ?? 0) + 1 } });
  atualizar(await orcamentoDaOpcao(opcaoId));
  return {};
}

export async function salvarItem(itemId: string, _e: EstadoForm, form: FormData): Promise<EstadoForm> {
  await exigirAdmin();
  const item = lerItem(form);
  if (!item.descricao) return { erro: getT()("Descreva o item.") };
  const salvo = await db.itemOpcao.update({ where: { id: itemId }, data: item });
  atualizar(await orcamentoDaOpcao(salvo.opcaoId));
  return {};
}

export async function excluirItem(itemId: string) {
  await exigirAdmin();
  const item = await db.itemOpcao.delete({ where: { id: itemId } });
  atualizar(await orcamentoDaOpcao(item.opcaoId));
}

/** Copia os itens de uma opção para a outra (ex.: montar a Premium a partir da Essential e trocar o material). */
export async function copiarItens(deOpcaoId: string, paraOpcaoId: string) {
  await exigirAdmin();
  const [de, para] = await Promise.all([
    db.opcaoOrcamento.findUniqueOrThrow({ where: { id: deOpcaoId }, include: { itens: true } }),
    db.opcaoOrcamento.findUniqueOrThrow({ where: { id: paraOpcaoId } }),
  ]);
  if (de.orcamentoId !== para.orcamentoId) return;
  await db.$transaction([
    db.itemOpcao.deleteMany({ where: { opcaoId: paraOpcaoId } }),
    db.itemOpcao.createMany({
      data: de.itens.map(({ categoria, descricao, quantidade, unidade, custoUnitCent, ordem, fonte, fonteUrl }) => ({
        opcaoId: paraOpcaoId, categoria, descricao, quantidade, unidade, custoUnitCent, ordem, fonte, fonteUrl,
      })),
    }),
    db.opcaoOrcamento.update({ where: { id: paraOpcaoId }, data: { diasPrevistos: de.diasPrevistos } }),
  ]);
  atualizar(de.orcamentoId);
}

// ---------- IA: perguntas, preço do material e pesquisa de mercado ----------

/** Dados do orçamento no formato que a IA usa (textos em inglês, histórico do banco de preços). */
async function dadosParaIA(id: string): Promise<DadosPrecificacao> {
  const [orc, trabalhos, rateio] = await Promise.all([
    db.orcamento.findUniqueOrThrow({ where: { id }, include: { cliente: true } }),
    db.trabalhoReferencia.findMany(),
    rateioCustosFixos(),
  ]);
  const en = getT("en");
  const ref = referenciaHistorico(orc, trabalhos, rateio.porDiaPadrao);
  const perguntas: Pergunta[] = orc.perguntas ? JSON.parse(orc.perguntas) : [];
  const unidade = en((UNIDADES as Record<string, string>)[orc.unidade] ?? orc.unidade);
  return {
    servico: orc.tipoServico ? en(nomeTipoServico(orc.tipoServico)) : "Remodeling",
    detalhes: descreverSubservicos(orc.tipoServico, orc.subServicos, en),
    descricao: orc.descricao ?? "",
    cidade: orc.cidade ?? orc.endereco ?? "",
    condado: orc.condado,
    quantidade: orc.quantidade,
    unidade: orc.unidade,
    respostas: perguntas.filter((p) => p.resposta).map((p) => ({ pergunta: p.pergunta, resposta: p.resposta! })),
    historico: ref
      ? `${ref.grupo.trabalhos} past job(s) in ${ref.regiao}: charged ${dinheiro(Math.round(ref.grupo.precoPorUnidade ?? 0))} per ${unidade}, ` +
        `cost ${dinheiro(Math.round(ref.grupo.custoPorUnidade ?? 0))} per ${unidade} (material ${dinheiro(Math.round(ref.grupo.materialPorUnidade ?? 0))}), ` +
        `average multiplier ${ref.grupo.multiplicador?.toFixed(2) ?? "—"}x`
      : null,
    custoFixoPorDia: rateio.porDiaPadrao,
  };
}

export async function prepararPerguntas(id: string, _e: EstadoForm): Promise<EstadoForm> {
  await exigirAdmin();
  const t = getT();
  try {
    const perguntas = await gerarPerguntas(await dadosParaIA(id), idiomaAtual());
    if (!perguntas) return { erro: t("A IA não está ligada: falta a chave ANTHROPIC_API_KEY na Vercel.") };
    await db.orcamento.update({ where: { id }, data: { perguntas: JSON.stringify(perguntas) } });
  } catch (e) {
    return { erro: t((e as Error).message) };
  }
  atualizar(id);
  return {};
}

export async function salvarRespostas(id: string, _e: EstadoForm, form: FormData): Promise<EstadoForm> {
  await exigirAdmin();
  const orc = await db.orcamento.findUniqueOrThrow({ where: { id } });
  const perguntas: Pergunta[] = orc.perguntas ? JSON.parse(orc.perguntas) : [];
  perguntas.forEach((p, i) => {
    const outra = String(form.get(`outra_${i}`) ?? "").trim();
    p.resposta = outra || String(form.get(`resposta_${i}`) ?? "").trim() || undefined;
  });
  await db.orcamento.update({ where: { id }, data: { perguntas: JSON.stringify(perguntas) } });
  atualizar(id);
  return { ok: getT()("Respostas salvas.") };
}

/** Pesquisa o mercado e troca os itens das duas opções pela sugestão da IA. */
export async function sugerirOpcoes(id: string, _e: EstadoForm): Promise<EstadoForm> {
  await exigirAdmin();
  const t = getT();
  try {
    const s = await sugerirOrcamento(await dadosParaIA(id));
    if (!s) return { erro: t("A IA não está ligada: falta a chave ANTHROPIC_API_KEY na Vercel.") };
    const opcoes = await db.opcaoOrcamento.findMany({ where: { orcamentoId: id }, orderBy: { ordem: "asc" } });
    await db.$transaction([
      db.orcamento.update({ where: { id }, data: { mercado: JSON.stringify(s.mercado) } }),
      ...opcoes.slice(0, 2).flatMap((o, i) => [
        db.itemOpcao.deleteMany({ where: { opcaoId: o.id } }),
        db.opcaoOrcamento.update({
          where: { id: o.id },
          data: {
            nome: s.opcoes[i].nome || o.nome,
            descricao: s.opcoes[i].descricao,
            diasPrevistos: s.opcoes[i].diasPrevistos,
            precoCent: 0,
            itens: { create: s.opcoes[i].itens.map((item, ordem) => ({ ...item, ordem, fonte: t("Sugestão da IA") })) },
          },
        }),
      ]),
    ]);
  } catch (e) {
    return { erro: t((e as Error).message) };
  }
  atualizar(id);
  return { ok: t("Pronto: mercado pesquisado e as duas opções sugeridas. Confira os itens e os preços.") };
}

/** Busca na Home Depot e na Lowe's o preço da lista de material digitada e lança como itens de material. */
export async function precificarMaterial(opcaoId: string, _e: EstadoForm, form: FormData): Promise<EstadoForm> {
  await exigirAdmin();
  const t = getT();
  const lista = String(form.get("lista") ?? "").trim();
  if (!lista) return { erro: t("Escreva a lista de material: um item por linha, com a quantidade.") };
  const opcao = await db.opcaoOrcamento.findUniqueOrThrow({ where: { id: opcaoId }, include: { orcamento: true } });
  try {
    const itens = await precosDeMaterial(lista, opcao.orcamento.cidade ?? opcao.orcamento.endereco ?? "");
    if (!itens) return { erro: t("A IA não está ligada: falta a chave ANTHROPIC_API_KEY na Vercel.") };
    const hoje = new Date().toISOString().slice(0, 10);
    const ultimo = await db.itemOpcao.findFirst({ where: { opcaoId }, orderBy: { ordem: "desc" } });
    await db.$transaction([
      ...(form.get("substituir") === "on" ? [db.itemOpcao.deleteMany({ where: { opcaoId, categoria: "MATERIAL" } })] : []),
      db.itemOpcao.createMany({
        data: itens.map((i, n) => {
          // Usa a loja mais barata; guarda os dois preços para conferência
          const lojas = [
            { nome: "Home Depot", preco: i.homeDepotCent, url: i.homeDepotUrl },
            { nome: "Lowe's", preco: i.lowesCent, url: i.lowesUrl },
          ].filter((l): l is { nome: string; preco: number; url: string | null } => l.preco !== null && l.preco > 0);
          const melhor = lojas.sort((a, b) => a.preco - b.preco)[0];
          const fonte = [...lojas.map((l) => `${l.nome} ${dinheiro(l.preco)}`), hoje, i.observacao].filter(Boolean).join(" · ");
          return {
            opcaoId,
            ordem: (ultimo?.ordem ?? 0) + n + 1,
            categoria: "MATERIAL",
            descricao: i.descricao,
            quantidade: i.quantidade,
            unidade: i.unidade,
            custoUnitCent: melhor?.preco ?? 0,
            fonte: lojas.length ? fonte : t("Preço não encontrado na Home Depot nem na Lowe's: informe à mão."),
            fonteUrl: melhor?.url ?? null,
          };
        }),
      }),
    ]);
  } catch (e) {
    return { erro: t((e as Error).message) };
  }
  atualizar(opcao.orcamentoId);
  return { ok: t("Preços do material lançados. Confira cada item.") };
}
