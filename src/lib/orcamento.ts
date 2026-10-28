import type { ItemOpcao, OpcaoOrcamento, TrabalhoReferencia } from "@prisma/client";
import { CATEGORIAS_DESPESA } from "./constantes";
import { META_MULTIPLICADOR, resumirPorServico } from "./precos";

export const STATUS_ORCAMENTO = {
  RASCUNHO: "Rascunho",
  ENVIADO: "Enviado",
  APROVADO: "Aprovado",
  RECUSADO: "Recusado",
} as const;

/** Nomes padrão das duas opções (regra 3: todo orçamento tem duas opções). */
export const OPCOES_PADRAO = ["Essential", "Premium"];

/** Arredonda o preço sugerido para cima, em dezenas de dólares (fica com cara de preço de proposta). */
function arredondarPreco(centavos: number) {
  return Math.ceil(centavos / 1000) * 1000;
}

/**
 * Números de uma opção: custo por categoria, custo fixo (dias × custo fixo por dia da empresa), custo total,
 * preço sugerido (meta 2x), preço final, lucro e multiplicador.
 */
export function calcularOpcao(opcao: OpcaoOrcamento & { itens: ItemOpcao[] }, custoFixoPorDia: number) {
  const porCategoria = Object.keys(CATEGORIAS_DESPESA)
    .map((categoria) => ({
      categoria,
      valor: Math.round(opcao.itens.filter((i) => i.categoria === categoria).reduce((s, i) => s + i.quantidade * i.custoUnitCent, 0)),
    }))
    .filter((c) => c.valor > 0);
  const custoDireto = porCategoria.reduce((s, c) => s + c.valor, 0);
  const custoFixo = opcao.diasPrevistos * custoFixoPorDia;
  const custoTotal = custoDireto + custoFixo;
  const precoSugerido = arredondarPreco(custoTotal * META_MULTIPLICADOR);
  const preco = opcao.precoCent > 0 ? opcao.precoCent : precoSugerido;
  return {
    porCategoria,
    custoDireto,
    custoFixo,
    custoTotal,
    precoSugerido,
    preco,
    precoDefinido: opcao.precoCent > 0,
    lucro: preco - custoTotal,
    multiplicador: custoTotal > 0 ? preco / custoTotal : null,
  };
}

export type CalculoOpcao = ReturnType<typeof calcularOpcao>;

/**
 * O que o banco de preços diz para este orçamento (regra 4: histórico primeiro): o grupo de trabalhos do mesmo
 * serviço, subserviço e unidade, de preferência na mesma região (Fairfield County x resto de CT).
 */
export function referenciaHistorico(
  orc: { tipoServico: string | null; subServicos: string | null; unidade: string; quantidade: number; condado: string | null },
  trabalhos: TrabalhoReferencia[],
  custoFixoPorDia: number,
) {
  if (!orc.tipoServico) return null;
  const doServico = trabalhos.filter((t) => t.tipoServico === orc.tipoServico && t.unidade === orc.unidade);
  const fairfield = orc.condado === "Fairfield";
  const daRegiao = orc.condado ? doServico.filter((t) => t.condado && (t.condado === "Fairfield") === fairfield) : [];
  const base = daRegiao.length ? daRegiao : doServico;
  if (!base.length) return null;

  const principais = (s: string | null) => (s ?? "").split(",").filter((c) => c && !c.includes(".")).sort().join(",");
  const grupos = resumirPorServico(base, custoFixoPorDia);
  const grupo = grupos.find((g) => g.subServicos === principais(orc.subServicos)) ?? (grupos.length === 1 ? grupos[0] : null);
  if (!grupo) return null;
  const q = orc.quantidade;
  return {
    grupo,
    regiao: daRegiao.length ? (fairfield ? "Fairfield County" : "Resto de CT") : "Todo Connecticut",
    // Valores do histórico aplicados à quantidade deste orçamento
    precoEstimado: grupo.precoPorUnidade !== null && q > 0 ? Math.round(grupo.precoPorUnidade * q) : null,
    custoEstimado: grupo.custoPorUnidade !== null && q > 0 ? Math.round(grupo.custoPorUnidade * q) : null,
    precoMinimo: grupo.precoMinimoPorUnidade !== null && q > 0 ? Math.round(grupo.precoMinimoPorUnidade * q) : null,
  };
}

/** Resultado da pesquisa de preço de mercado guardado no orçamento (campo `mercado`, em JSON). */
export type Mercado = {
  consultadoEm: string;
  cidade: string;
  faixaBaixaCent: number;
  faixaAltaCent: number;
  porUnidade: { baixaCent: number; altaCent: number; unidade: string } | null;
  resumo: string;
  fontes: { nome: string; url: string; valor: string }[];
};

export function lerMercado(json: string | null): Mercado | null {
  if (!json) return null;
  try {
    return JSON.parse(json) as Mercado;
  } catch {
    return null;
  }
}
