import type { ExtraObra } from "@prisma/client";

/** Situação do trabalho extra: pago (recebimento lançado no caixa), cobrado (mensagem enviada) ou a cobrar. */
export type SituacaoExtra = "A_COBRAR" | "COBRADO" | "PAGO";

export const SITUACOES_EXTRA: Record<SituacaoExtra, string> = {
  A_COBRAR: "A cobrar",
  COBRADO: "Cobrado, esperando pagamento",
  PAGO: "Pago",
};

export function situacaoExtra(e: Pick<ExtraObra, "cobradoEm" | "lancamentoId">): SituacaoExtra {
  if (e.lancamentoId) return "PAGO";
  if (e.cobradoEm) return "COBRADO";
  return "A_COBRAR";
}

/** Totais dos extras de uma obra: tudo o que foi pedido, o que já entrou e o que falta receber. */
export function totaisExtras(extras: Pick<ExtraObra, "valorCent" | "custoCent" | "cobradoEm" | "lancamentoId">[]) {
  const total = extras.reduce((s, e) => s + e.valorCent, 0);
  const pago = extras.filter((e) => e.lancamentoId).reduce((s, e) => s + e.valorCent, 0);
  const aCobrar = extras.filter((e) => situacaoExtra(e) === "A_COBRAR").reduce((s, e) => s + e.valorCent, 0);
  const custo = extras.reduce((s, e) => s + e.custoCent, 0);
  return { total, pago, aCobrar, faltaReceber: total - pago, custo, quantidade: extras.length };
}

/** Mensagem em inglês para cobrar os extras (regra 9): lista cada um com o valor e o total. */
export function mensagemExtras(nomeCliente: string, obra: string, itens: { descricao: string; valor: string }[], total: string) {
  const primeiro = nomeCliente.trim().split(/\s+/)[0] ?? "";
  return [
    `Hi ${primeiro},`,
    "",
    `Here is the summary of the extra work you requested for ${obra}, outside the original scope:`,
    ...itens.map((i) => `- ${i.descricao}: ${i.valor}`),
    `Total extra work: ${total}`,
    "",
    "Payment can be made by Zelle, Venmo, wire transfer, check or cash. Please let us know if you have any questions.",
    "",
    "Thank you,",
    "Alessandro and Emmanuel",
    "Tababog Construction LLC",
  ].join("\n");
}
