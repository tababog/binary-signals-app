// Sem dependências do servidor: usado também na página do cliente (componente de navegador).

/**
 * Formas de pagamento da proposta (regra do Alessandro, 07/11/2026): trabalho curto (até 15 dias) ou abaixo de
 * $8,000 só tem 50/50; acima disso o cliente escolhe entre 1/3 + 1/3 + 1/3 e 50/50.
 */
export const FORMAS_PAGAMENTO_PROPOSTA = {
  METADE: {
    nome: "50% / 50%",
    texto: "50% payable before the work begins and 50% upon completion of the work.",
    pt: "50% antes de começar e 50% no final",
  },
  TERCOS: {
    nome: "1/3 · 1/3 · 1/3",
    texto: "1/3 payable before the work begins, 1/3 at the midpoint of the work and the final 1/3 upon completion of the work.",
    pt: "1/3 antes de começar, 1/3 no meio da obra e 1/3 no final",
  },
} as const;
export type FormaPagamentoProposta = keyof typeof FORMAS_PAGAMENTO_PROPOSTA;
export const LIMITE_CURTO_DIAS = 15;
export const LIMITE_VALOR_CENT = 800_000;

/** Formas que o cliente pode escolher para uma opção: só 50/50 se for curta (até 15 dias) ou abaixo de $8,000. */
export function formasDaOpcao(precoCent: number, dias: number): FormaPagamentoProposta[] {
  const curto = (dias > 0 && dias <= LIMITE_CURTO_DIAS) || precoCent < LIMITE_VALOR_CENT;
  return curto ? ["METADE"] : ["TERCOS", "METADE"];
}

/**
 * Cláusula de trabalho extra (pedido do Alessandro, 07/11/2026): qualquer mudança no escopo é trabalho extra e pode
 * ser cobrada à parte. Aparece nas condições da proposta e o cliente marca que entendeu antes de aprovar.
 */
export const CLAUSULA_TRABALHO_EXTRA =
  "Any change to the scope of work described in this proposal, including additions, changes or items not listed above, will be considered extra work and may be billed separately, as agreed in a written change order.";
export const ACEITE_TRABALHO_EXTRA = "I understand that any change to the scope of work will be considered extra work and may be billed separately.";
