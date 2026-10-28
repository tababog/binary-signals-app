import type { TrabalhoReferencia } from "@prisma/client";

export const META_MULTIPLICADOR = 2;

/**
 * Números de um trabalho do banco de preços. O custo fixo é estimado pelos dias de trabalho × custo fixo por dia
 * atual da empresa (para trabalhos antigos não há registro do custo fixo da época).
 */
export function analisarTrabalho(t: TrabalhoReferencia, custoFixoPorDia: number) {
  const custoDireto = t.custoMaterialCent + t.custoMaoObraCent + t.custoOutrosCent;
  const custoFixo = t.dias * custoFixoPorDia;
  const custoTotal = custoDireto + custoFixo;
  const porUnidade = t.unidade !== "SERVICO" && t.quantidade > 0;
  return {
    custoDireto,
    custoFixo,
    custoTotal,
    lucro: t.precoCobradoCent - custoTotal,
    multiplicador: custoTotal > 0 ? t.precoCobradoCent / custoTotal : null,
    precoPorUnidade: porUnidade ? t.precoCobradoCent / t.quantidade : null,
    custoPorUnidade: porUnidade ? custoTotal / t.quantidade : null,
    materialPorUnidade: porUnidade ? t.custoMaterialCent / t.quantidade : null,
  };
}

export type Analise = ReturnType<typeof analisarTrabalho>;

export function abaixoDaMeta(a: Analise) {
  return a.multiplicador !== null && a.multiplicador < META_MULTIPLICADOR;
}

/** Subserviços principais (sem os detalhes "INTERNA.TETO"), para agrupar trabalhos comparáveis. */
function subsPrincipais(subServicos: string | null) {
  return (subServicos ?? "").split(",").filter((c) => c && !c.includes(".")).sort().join(",");
}

/**
 * Resumo por tipo de serviço, subserviço principal (ex.: deck novo x só o piso) e unidade. Os valores por unidade são ponderados pela quantidade
 * (soma dos preços ÷ soma das quantidades), para um deck grande pesar mais que um pequeno.
 */
export function resumirPorServico(trabalhos: TrabalhoReferencia[], custoFixoPorDia: number) {
  const grupos = new Map<string, { tipo: string; subServicos: string; unidade: string; itens: { t: TrabalhoReferencia; a: Analise }[] }>();
  for (const t of trabalhos) {
    const subs = subsPrincipais(t.subServicos);
    const chave = `${t.tipoServico}|${subs}|${t.unidade}`;
    if (!grupos.has(chave)) grupos.set(chave, { tipo: t.tipoServico, subServicos: subs, unidade: t.unidade, itens: [] });
    grupos.get(chave)!.itens.push({ t, a: analisarTrabalho(t, custoFixoPorDia) });
  }

  return [...grupos.values()]
    .map(({ tipo, subServicos, unidade, itens }) => {
      const soma = (f: (x: (typeof itens)[number]) => number) => itens.reduce((s, x) => s + f(x), 0);
      const quantidade = soma((x) => x.t.quantidade);
      const preco = soma((x) => x.t.precoCobradoCent);
      const custo = soma((x) => x.a.custoTotal);
      const material = soma((x) => x.t.custoMaterialCent);
      const porUnidade = unidade !== "SERVICO" && quantidade > 0;
      const precosUnit = itens.map((x) => x.a.precoPorUnidade).filter((v): v is number => v !== null);
      return {
        tipo,
        subServicos,
        unidade,
        trabalhos: itens.length,
        abaixoDaMeta: itens.filter((x) => abaixoDaMeta(x.a)).length,
        quantidade,
        precoTotal: preco,
        custoTotal: custo,
        multiplicador: custo > 0 ? preco / custo : null,
        precoPorUnidade: porUnidade ? preco / quantidade : null,
        custoPorUnidade: porUnidade ? custo / quantidade : null,
        materialPorUnidade: porUnidade ? material / quantidade : null,
        // Preço mínimo para bater a meta: 2x o custo médio
        precoMinimoPorUnidade: porUnidade ? (META_MULTIPLICADOR * custo) / quantidade : null,
        faixaPreco: precosUnit.length ? { min: Math.min(...precosUnit), max: Math.max(...precosUnit) } : null,
      };
    })
    .sort((a, b) => b.trabalhos - a.trabalhos);
}
