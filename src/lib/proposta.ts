import { randomBytes } from "crypto";
import type { Cliente, ItemOpcao, OpcaoOrcamento, Orcamento } from "@prisma/client";
import { getT } from "@/i18n/servidor";
import { descreverServicos, descreverSubservicos, nomesServicos, todosServicos } from "./constantes";
import { traduzirTextos } from "./traducao";
import { db } from "./db";
import { formasDaOpcao, type FormaPagamentoProposta } from "./pagamento-proposta";

export * from "./pagamento-proposta";

/** Categorias de item que aparecem para o cliente no escopo (mão de obra, frete, seguro e custos internos ficam de fora). */
export const CATEGORIAS_ESCOPO = ["MATERIAL", "INSTALACAO", "SERVICO", "EQUIPAMENTO", "DESCARTE", "LICENCA"];

/** Forma de pagamento do contrato quando não há proposta aprovada (texto original do contrato da Tababog). */
export const PAGAMENTO_PADRAO = "50% payable at the beginning of the work (at the end of the first day worked) and 50% upon completion of the work.";

/** A proposta vale por 30 dias; depois o link mostra o aviso e não aceita mais aprovação. */
export const VALIDADE_DIAS = 30;

export type OpcaoProposta = {
  ordem: number;
  nome: string;
  descricao: string | null;
  dias: number;
  precoCent: number;
  itens: string[];
  pagamentos: FormaPagamentoProposta[];
};
export type ConteudoProposta = {
  cliente: string;
  endereco: string;
  projeto: string;
  numero: string;
  opcoes: OpcaoProposta[];
};

export const RESPOSTAS_PROPOSTA = {
  APROVADA: "Aprovada",
  RECUSADA: "Recusada",
  FALAR: "Quer conversar",
} as const;

export function novoToken() {
  return randomBytes(18).toString("base64url");
}

export function lerConteudo(json: string): ConteudoProposta {
  return JSON.parse(json) as ConteudoProposta;
}

export function vencida(criadaEm: Date, agora = new Date()) {
  return agora.getTime() - criadaEm.getTime() > VALIDADE_DIAS * 24 * 60 * 60 * 1000;
}

/** Já existe um link mais novo para o mesmo orçamento (o antigo para de aceitar resposta, porque o preço pode ter mudado). */
export async function substituida(id: string, orcamentoId: string) {
  const ultima = await db.proposta.findFirst({ where: { orcamentoId }, orderBy: { criadaEm: "desc" }, select: { id: true } });
  return !!ultima && ultima.id !== id;
}

export function itemEscopo(i: ItemOpcao) {
  return `${i.descricao}${i.quantidade && i.unidade ? ` (${i.quantidade.toLocaleString("en-US")} ${i.unidade})` : ""}`;
}

/**
 * Cópia do orçamento como o cliente vai ver, toda em inglês (regra 9): os textos digitados (descrição das opções e
 * itens) passam pela tradução guardada; se a tradução falhar, vão como estão.
 */
export async function montarConteudo(
  orc: Orcamento & { cliente: Cliente; opcoes: (OpcaoOrcamento & { itens: ItemOpcao[] })[] },
): Promise<ConteudoProposta> {
  const en = getT("en");
  const servico = orc.tipoServico ? nomesServicos(orc, en) : "Home improvement";
  const detalhes = todosServicos(orc).length > 1 ? descreverServicos(orc, en) : descreverSubservicos(orc.tipoServico, orc.subServicos, en);
  const projeto = `${servico}${detalhes ? ` (${detalhes})` : ""}${orc.cidade ? ` - ${orc.cidade}, CT` : ""}`;

  const opcoes = orc.opcoes.map((o) => ({
    ordem: o.ordem,
    nome: o.nome,
    descricao: o.descricao?.trim() || null,
    dias: o.diasPrevistos,
    precoCent: o.precoCent,
    itens: o.itens.filter((i) => CATEGORIAS_ESCOPO.includes(i.categoria)).map(itemEscopo),
    pagamentos: formasDaOpcao(o.precoCent, o.diasPrevistos),
  }));

  const textos = opcoes.flatMap((o) => [o.descricao ?? "", ...o.itens]);
  const traduzidos = await traduzirTextos(textos, "en").catch(() => textos);
  let k = 0;
  for (const o of opcoes) {
    o.descricao = o.descricao ? traduzidos[k] : null;
    k++;
    o.itens = o.itens.map(() => traduzidos[k++]);
  }

  return {
    cliente: orc.cliente.nome,
    endereco: orc.endereco ?? orc.cliente.endereco ?? "",
    projeto,
    numero: `${orc.criadoEm.getFullYear()}-${orc.id.slice(-5).toUpperCase()}`,
    opcoes,
  };
}

/** Mensagem que acompanha o link (sempre em inglês, regra 9). */
export function mensagemProposta(nomeCliente: string, link: string) {
  const primeiro = nomeCliente.trim().split(/\s+/)[0] ?? "";
  return [
    `Hi ${primeiro},`,
    "",
    "Thank you for the opportunity to quote your project. Here is your proposal from Tababog Construction, with our portfolio and two options for you to choose from:",
    link,
    "",
    "You can approve the option you prefer and sign right on the page, or let us know if you would like to talk.",
    "",
    "Best regards,",
    "Alessandro and Emmanuel",
    "Tababog Construction LLC",
  ].join("\n");
}
