import { cache } from "react";
import { db } from "./db";
import { campoData } from "./format";

export const PERIODICIDADES = { SEMANAL: "por semana", MENSAL: "por mês", ANUAL: "por ano" } as const;

/** Média de dias úteis (segunda a sexta) por mês: 52 semanas × 5 dias ÷ 12. */
export const DIAS_UTEIS_MEDIA = (52 * 5) / 12;

export function valorMensal(valorCent: number, periodicidade: string) {
  if (periodicidade === "SEMANAL") return (valorCent * 52) / 12;
  if (periodicidade === "ANUAL") return valorCent / 12;
  return valorCent;
}

/** Dias de segunda a sexta no mês "aaaa-mm". */
export function diasUteis(mes: string) {
  const [ano, m] = mes.split("-").map(Number);
  const total = new Date(Date.UTC(ano, m, 0)).getUTCDate();
  let dias = 0;
  for (let d = 1; d <= total; d++) {
    const semana = new Date(Date.UTC(ano, m - 1, d)).getUTCDay();
    if (semana !== 0 && semana !== 6) dias++;
  }
  return dias;
}

/**
 * Rateio dos custos fixos entre as obras.
 * Custo fixo de um dia = (custos recorrentes do mês + gastos avulsos do mês) ÷ dias úteis do mês.
 * Cada dia com ponto registrado divide esse valor igualmente entre as obras trabalhadas no dia.
 * Usa os valores atuais dos custos recorrentes também para meses passados.
 * Fica em cache durante a requisição, porque cada resumo de obra precisa dele.
 */
export const rateioCustosFixos = cache(async () => {
  const [custos, avulsos, registros] = await Promise.all([
    db.custoFixo.findMany({ where: { ativo: true } }),
    db.gastoEmpresa.findMany({ select: { valorCent: true, data: true } }),
    db.registroPonto.findMany({ select: { obraId: true, entrada: true } }),
  ]);

  const recorrenteMensal = custos.reduce((s, c) => s + valorMensal(c.valorCent, c.periodicidade), 0);
  const avulsoPorMes = new Map<string, number>();
  for (const g of avulsos) {
    const mes = campoData(g.data).slice(0, 7);
    avulsoPorMes.set(mes, (avulsoPorMes.get(mes) ?? 0) + g.valorCent);
  }
  const custoDoMes = (mes: string) => recorrenteMensal + (avulsoPorMes.get(mes) ?? 0);
  const custoDoDia = (mes: string) => custoDoMes(mes) / diasUteis(mes);

  const obrasPorDia = new Map<string, Set<string>>();
  for (const r of registros) {
    const dia = campoData(r.entrada);
    if (!obrasPorDia.has(dia)) obrasPorDia.set(dia, new Set());
    obrasPorDia.get(dia)!.add(r.obraId);
  }

  // por obra: valor rateado e dias; por mês: quanto do custo fixo foi coberto por dias trabalhados
  const porObra = new Map<string, { valor: number; dias: number; porMes: Map<string, number> }>();
  const cobertoPorMes = new Map<string, number>();
  const diasTrabalhadosPorMes = new Map<string, number>();
  for (const [dia, obras] of obrasPorDia) {
    const mes = dia.slice(0, 7);
    const parte = custoDoDia(mes) / obras.size;
    cobertoPorMes.set(mes, (cobertoPorMes.get(mes) ?? 0) + custoDoDia(mes));
    diasTrabalhadosPorMes.set(mes, (diasTrabalhadosPorMes.get(mes) ?? 0) + 1);
    for (const obraId of obras) {
      const atual = porObra.get(obraId) ?? { valor: 0, dias: 0, porMes: new Map<string, number>() };
      atual.valor += parte;
      atual.dias += 1;
      atual.porMes.set(mes, (atual.porMes.get(mes) ?? 0) + parte);
      porObra.set(obraId, atual);
    }
  }

  return {
    recorrenteMensal: Math.round(recorrenteMensal),
    /** Custo fixo por dia útil num mês típico, sem gastos avulsos: base para orçar obras novas. */
    porDiaPadrao: Math.round(recorrenteMensal / DIAS_UTEIS_MEDIA),
    custoDoMes: (mes: string) => Math.round(custoDoMes(mes)),
    custoDoDia: (mes: string) => Math.round(custoDoDia(mes)),
    avulsoDoMes: (mes: string) => avulsoPorMes.get(mes) ?? 0,
    cobertoNoMes: (mes: string) => Math.round(cobertoPorMes.get(mes) ?? 0),
    diasTrabalhadosNoMes: (mes: string) => diasTrabalhadosPorMes.get(mes) ?? 0,
    daObra: (obraId: string) => {
      const r = porObra.get(obraId);
      return { valor: Math.round(r?.valor ?? 0), dias: r?.dias ?? 0, noMes: (mes: string) => Math.round(r?.porMes.get(mes) ?? 0) };
    },
  };
});
