import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";

/**
 * Lê prints da conversa com o cliente (WhatsApp, SMS, Thumbtack, e-mail...) e escreve o que ele pediu: o serviço,
 * cada parte do trabalho, medidas, materiais, prazos e o que ele disse sobre o orçamento. Só o que está escrito.
 */

const Pedido = z.object({ pedido: z.string() });

const TIPOS_IMAGEM = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
const IDIOMA = { pt: "Brazilian Portuguese", en: "American English", es: "Latin American Spanish" } as const;

let cliente: Anthropic | null = null;
function api() {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  cliente ??= new Anthropic({ timeout: 50_000, maxRetries: 1 });
  return cliente;
}

export async function lerPedidoIA(imagens: File[], idioma: keyof typeof IDIOMA): Promise<string | null> {
  const c = api();
  if (!c) return null;
  const blocos: Anthropic.Beta.BetaContentBlockParam[] = [];
  for (const img of imagens) {
    if (!TIPOS_IMAGEM.includes(img.type as (typeof TIPOS_IMAGEM)[number])) continue;
    blocos.push({ type: "image", source: { type: "base64", media_type: img.type as (typeof TIPOS_IMAGEM)[number], data: Buffer.from(await img.arrayBuffer()).toString("base64") } });
  }
  if (!blocos.length) return null;
  const r = await c.beta.messages.parse({
    model: "claude-opus-5-5",
    max_tokens: 4000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "low", format: betaZodOutputFormat(Pedido) },
    system: `You help a Connecticut remodeling contractor. The images are screenshots of a conversation with a client
(WhatsApp, SMS, Thumbtack, e-mail...). Write what the CLIENT is asking for, as a short job description the contractor
will use to price the job: the service, every part of the work mentioned (what is included, what to remove or
repair), measurements and quantities, materials, colors or brands, city or address if written, deadlines, and what
the client said about budget. Use short lines starting with "- ". Only what is written in the screenshots: never
invent sizes or details. Write in ${IDIOMA[idioma]}.`,
    messages: [{ role: "user", content: [...blocos, { type: "text", text: "Read the client's request." }] }],
  });
  return r.parsed_output?.pedido.trim() || null;
}
