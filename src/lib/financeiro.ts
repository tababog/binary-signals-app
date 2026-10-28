import { db } from "./db";
import { CATEGORIAS_DESPESA } from "./constantes";
import { rateioCustosFixos } from "./custos-fixos";

type Registro = { entrada: Date; saida: Date | null; valorHoraCent: number; custoCent?: number | null };

export function duracaoMs(r: { entrada: Date; saida: Date | null }, agora = new Date()) {
  return Math.max(0, (r.saida ?? agora).getTime() - r.entrada.getTime());
}

/**
 * Custo da mão de obra própria dos registros fechados. Usa o custo calculado ao fechar o ponto
 * (src/lib/custo-ponto.ts, que trata diaristas); registros antigos sem ele usam horas × valor/hora.
 */
export function custoPonto(registros: Registro[]) {
  return registros
    .filter((r) => r.saida)
    .reduce((soma, r) => soma + (r.custoCent ?? Math.round((duracaoMs(r) / 3_600_000) * r.valorHoraCent)), 0);
}

export type ResumoObra = Awaited<ReturnType<typeof resumoObra>>;

/** Tudo o que a obra recebeu, gastou e orçou, separado por categoria. */
export async function resumoObra(obraId: string) {
  const [obra, lancamentos, orcamento, registros, rateio] = await Promise.all([
    db.obra.findUniqueOrThrow({ where: { id: obraId }, include: { cliente: true } }),
    db.lancamento.findMany({ where: { obraId } }),
    db.itemOrcamento.findMany({ where: { obraId } }),
    db.registroPonto.findMany({ where: { obraId } }),
    rateioCustosFixos(),
  ]);

  const recebido = lancamentos.filter((l) => l.tipo === "ENTRADA").reduce((s, l) => s + l.valorCent, 0);
  const custoEquipe = custoPonto(registros);
  const horasEquipeMs = registros.filter((r) => r.saida).reduce((s, r) => s + duracaoMs(r), 0);

  const porCategoria = Object.keys(CATEGORIAS_DESPESA).map((categoria) => {
    const gasto = lancamentos
      .filter((l) => l.tipo === "SAIDA" && l.categoria === categoria)
      .reduce((s, l) => s + l.valorCent, 0);
    const realizado = gasto + (categoria === "MAO_DE_OBRA" ? custoEquipe : 0);
    const orcado = orcamento.filter((i) => i.categoria === categoria).reduce((s, i) => s + i.valorCent, 0);
    return { categoria, orcado, realizado, diferenca: orcado - realizado };
  });

  // Parte da obra nos custos fixos da empresa: previsto pelos dias planejados, realizado pelos dias com ponto
  const fixo = rateio.daObra(obra.id);
  const fixoPrevisto = obra.diasPrevistos * rateio.porDiaPadrao;
  const custoDireto = porCategoria.reduce((s, c) => s + c.realizado, 0);
  porCategoria.push({ categoria: "CUSTO_FIXO", orcado: fixoPrevisto, realizado: fixo.valor, diferenca: fixoPrevisto - fixo.valor });

  const custoTotal = custoDireto + fixo.valor;
  const orcadoTotal = porCategoria.reduce((s, c) => s + c.orcado, 0);

  return {
    obra,
    recebido,
    aReceber: obra.valorContratoCent - recebido,
    custoEquipe,
    horasEquipeMs,
    custoDireto,
    custoFixo: fixo.valor,
    diasTrabalhados: fixo.dias,
    custoFixoPorDia: rateio.porDiaPadrao,
    custoTotal,
    orcadoTotal,
    // Caixa da obra: só o que saiu de verdade por esta obra (o custo fixo é pago pelo caixa da empresa)
    saldoCaixa: recebido - custoDireto,
    lucroPrevisto: obra.valorContratoCent - orcadoTotal,
    lucroAtual: obra.valorContratoCent - custoTotal,
    porCategoria,
  };
}
