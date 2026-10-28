import { cache } from "react";
import { db } from "./db";
import { campoData } from "./format";
import { grupoDoItem, lerFluxoCaixa, mediasCustosFixos, type Grupo } from "./planilha-fluxo";

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

export type CustoFixoItem = { nome: string; mensalCent: number; grupo: Grupo };

const ORIGEM = "PLANILHA:";

/**
 * Custos fixos da empresa = média mensal real da planilha de fluxo de caixa do Drive (despesas fixas + retiradas
 * dos sócios, que são o pró-labore). Cada leitura guarda uma cópia em CustoFixo, usada se o Drive estiver fora do ar.
 * Sem planilha ligada, usa o que estiver cadastrado em CustoFixo.
 */
export const custosFixosAtuais = cache(async () => {
  const lido = await lerFluxoCaixa();
  if (lido.ok) {
    const m = mediasCustosFixos(lido.fluxo);
    const itens: CustoFixoItem[] = m.itens.map((i) => ({ nome: i.item, mensalCent: i.mediaCent, grupo: i.grupo }));
    await guardarCopia(itens);
    return { fonte: "PLANILHA" as const, meses: m.meses, planilha: lido.fluxo.planilha.nome, itens };
  }
  const salvos = await db.custoFixo.findMany({ where: { ativo: true }, orderBy: { valorCent: "desc" } });
  const itens: CustoFixoItem[] = salvos.map((c) => ({
    nome: c.nome,
    mensalCent: Math.round(valorMensal(c.valorCent, c.periodicidade)),
    grupo: grupoDoItem(c.nome),
  }));
  const copia = salvos.length > 0 && salvos.every((c) => c.origem?.startsWith(ORIGEM));
  return { fonte: copia ? ("COPIA" as const) : ("CADASTRO" as const), meses: 0, planilha: null, itens };
});

/** Troca o que está em CustoFixo pela média atual da planilha (só grava quando algo mudou). */
async function guardarCopia(itens: CustoFixoItem[]) {
  const atuais = await db.custoFixo.findMany();
  const igual =
    atuais.length === itens.length &&
    itens.every((i) => atuais.some((c) => c.origem === ORIGEM + i.nome && c.valorCent === i.mensalCent && c.ativo && c.periodicidade === "MENSAL"));
  if (igual) return;
  await db.$transaction([
    db.custoFixo.deleteMany(),
    db.custoFixo.createMany({
      data: itens.map((i) => ({ nome: i.nome, valorCent: i.mensalCent, periodicidade: "MENSAL", origem: ORIGEM + i.nome })),
    }),
  ]);
}

/**
 * Rateio dos custos fixos entre as obras.
 * Custo fixo de um dia = (custos fixos do mês + gastos avulsos do mês) ÷ dias úteis do mês.
 * Com a planilha ligada, os gastos avulsos não entram de novo: já estão nela (ex.: Compra de Ferramentas).
 * Cada dia com ponto registrado divide esse valor igualmente entre as obras trabalhadas no dia.
 * Usa a média atual também para meses passados.
 * Fica em cache durante a requisição, porque cada resumo de obra precisa dele.
 */
export const rateioCustosFixos = cache(async () => {
  const [custos, avulsos, registros] = await Promise.all([
    custosFixosAtuais(),
    db.gastoEmpresa.findMany({ select: { valorCent: true, data: true } }),
    db.registroPonto.findMany({ select: { obraId: true, entrada: true } }),
  ]);

  const recorrenteMensal = custos.itens.reduce((s, c) => s + c.mensalCent, 0);
  const avulsoPorMes = new Map<string, number>();
  for (const g of custos.fonte === "CADASTRO" ? avulsos : []) {
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
    /** De onde vêm os custos fixos e a lista (planilha do Drive, cópia guardada ou cadastro). */
    custos,
    recorrenteMensal: Math.round(recorrenteMensal),
    /** Custo fixo por dia útil num mês típico, sem gastos avulsos: base para orçar obras novas. */
    porDiaPadrao: Math.round(recorrenteMensal / DIAS_UTEIS_MEDIA),
    custoDoMes: (mes: string) => Math.round(custoDoMes(mes)),
    custoDoDia: (mes: string) => Math.round(custoDoDia(mes)),
    avulsoDoMes: (mes: string) => avulsoPorMes.get(mes) ?? 0,
    /** Gastos avulsos somam ao custo fixo só quando não há planilha (com ela, já estão nas despesas). */
    contaAvulsos: custos.fonte === "CADASTRO",
    cobertoNoMes: (mes: string) => Math.round(cobertoPorMes.get(mes) ?? 0),
    diasTrabalhadosNoMes: (mes: string) => diasTrabalhadosPorMes.get(mes) ?? 0,
    daObra: (obraId: string) => {
      const r = porObra.get(obraId);
      return { valor: Math.round(r?.valor ?? 0), dias: r?.dias ?? 0, noMes: (mes: string) => Math.round(r?.porMes.get(mes) ?? 0) };
    },
  };
});
