import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { FORMAS_PAGAMENTO } from "./constantes";

/**
 * Lê a foto ou o PDF de um comprovante (cheque, recibo de Zelle/Venmo, nota de loja...) com a API da Anthropic
 * e devolve o que encontrar: valor, data, forma de pagamento e uma descrição curta. O que não estiver claro volta null.
 */

const formas = FORMAS_PAGAMENTO as [string, ...string[]];

const Leitura = z.object({
  valor_usd: z.number().nullable(),
  data: z.string().nullable(),
  forma_pagamento: z.enum(formas).nullable(),
  descricao: z.string().nullable(),
});

export type LeituraComprovante = { valorCent: number | null; data: string | null; formaPagamento: string | null; descricao: string | null };

const TIPOS_IMAGEM = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;

let cliente: Anthropic | null = null;
function api() {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  cliente ??= new Anthropic({ timeout: 60_000, maxRetries: 1 });
  return cliente;
}

export async function lerComprovanteIA(arquivo: File, tipo: "RECEBIMENTO" | "DESPESA"): Promise<LeituraComprovante | null> {
  const c = api();
  if (!c) return null;
  const base64 = Buffer.from(await arquivo.arrayBuffer()).toString("base64");
  const midia: Anthropic.Beta.BetaContentBlockParam =
    arquivo.type === "application/pdf"
      ? { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } }
      : { type: "image", source: { type: "base64", media_type: arquivo.type as (typeof TIPOS_IMAGEM)[number], data: base64 } };
  if (arquivo.type !== "application/pdf" && !TIPOS_IMAGEM.includes(arquivo.type as (typeof TIPOS_IMAGEM)[number])) return null;

  const hoje = new Date().toISOString().slice(0, 10);
  const r = await c.beta.messages.parse({
    model: "claude-opus-5-5",
    max_tokens: 4000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "low", format: betaZodOutputFormat(Leitura) },
    system: `You read payment documents for a construction company in Connecticut, USA. Today is ${hoje}.
${tipo === "RECEBIMENTO"
  ? "The document proves a payment RECEIVED from a client (a check, a Zelle/Venmo/PayPal/bank transfer confirmation, a deposit receipt...)."
  : "The document is a receipt or invoice for an expense PAID by the company (store receipt, supplier invoice, payment confirmation...)."}
Extract only what is clearly written: valor_usd = the total amount paid in US dollars; data = the payment date as
YYYY-MM-DD (US documents write dates as MM/DD/YYYY); forma_pagamento = one of the allowed values when the document
shows it ("Cheque" = check, "Dinheiro" = cash, "Cartão de crédito" = credit card, "Cartão de débito" = debit card,
"Transferência bancária (ACH)" = ACH/wire/bank transfer); descricao = a short description in the document's language
(${tipo === "RECEBIMENTO" ? "e.g. who paid and the memo" : "e.g. store name and main items"}). Use null for anything you cannot find or read with confidence.`,
    messages: [{ role: "user", content: [midia, { type: "text", text: "Read this document." }] }],
  });
  const o = r.parsed_output;
  if (!o) return null;
  return {
    valorCent: o.valor_usd !== null && o.valor_usd > 0 ? Math.round(o.valor_usd * 100) : null,
    data: o.data && /^\d{4}-\d{2}-\d{2}$/.test(o.data) ? o.data : null,
    formaPagamento: o.forma_pagamento,
    descricao: o.descricao?.trim() || null,
  };
}
