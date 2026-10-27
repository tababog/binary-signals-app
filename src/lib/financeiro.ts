import { db } from "./db";
import { CATEGORIAS_DESPESA } from "./constantes";

type Registro = { entrada: Date; saida: Date | null; valorHoraCent: number };

export function duracaoMs(r: { entrada: Date; saida: Date | null }, agora = new Date()) {
  return Math.max(0, (r.saida ?? agora).getTime() - r.entrada.getTime());
}

/** Custo da mão de obra própria: horas trabalhadas x valor/hora de cada registro fechado. */
export function custoPonto(registros: Registro[]) {
  return registros
    .filter((r) => r.saida)
    .reduce((soma, r) => soma + Math.round((duracaoMs(r) / 3_600_000) * r.valorHoraCent), 0);
}

export type ResumoObra = Awaited<ReturnType<typeof resumoObra>>;

/** Tudo o que a obra recebeu, gastou e orçou, separado por categoria. */
export async function resumoObra(obraId: string) {
  const [obra, lancamentos, orcamento, registros] = await Promise.all([
    db.obra.findUniqueOrThrow({ where: { id: obraId }, include: { cliente: true } }),
    db.lancamento.findMany({ where: { obraId } }),
    db.itemOrcamento.findMany({ where: { obraId } }),
    db.registroPonto.findMany({ where: { obraId } }),
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

  const custoTotal = porCategoria.reduce((s, c) => s + c.realizado, 0);
  const orcadoTotal = porCategoria.reduce((s, c) => s + c.orcado, 0);

  return {
    obra,
    recebido,
    aReceber: obra.valorContratoCent - recebido,
    custoEquipe,
    horasEquipeMs,
    custoTotal,
    orcadoTotal,
    saldoCaixa: recebido - custoTotal,
    lucroPrevisto: obra.valorContratoCent - orcadoTotal,
    lucroAtual: obra.valorContratoCent - custoTotal,
    porCategoria,
  };
}
