import { createHash } from "node:crypto";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { db } from "./db";
import type { Idioma } from "@/i18n/idiomas";

const NOME_IDIOMA: Record<Idioma, string> = { pt: "Brazilian Portuguese", en: "American English", es: "Latin American Spanish" };

const Resposta = z.object({ traducoes: z.array(z.string()) });

const SISTEMA = `You translate short texts written inside the management app of Tababog Construction, a home remodeling
company in Connecticut (USA) run by Brazilians. Texts are expense descriptions, budget items, notes about jobs and
client requests (decks, custom cabinets, drywall, painting, insulation...). Translate each text into the requested
language using the natural construction vocabulary a contractor in the USA would use. Keep numbers, measurements
(sq ft, LF, 2x4...), prices, brand names, product names and people's names exactly as written. If a text is already in
the target language, return it unchanged. Return one translation per input text, in the same order.`;

let cliente: Anthropic | null = null;
function api() {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  cliente ??= new Anthropic({ timeout: 30_000, maxRetries: 1 });
  return cliente;
}

export function hashTexto(texto: string) {
  return createHash("sha256").update(texto.trim()).digest("hex");
}

/** Chama a API para um lote de textos. Em qualquer falha devolve null (a tela mostra o original). */
async function traduzirNaApi(textos: string[], idioma: Idioma): Promise<string[] | null> {
  const c = api();
  if (!c || textos.length === 0) return null;
  try {
    const resposta = await c.beta.messages.parse({
      model: "claude-opus-5-5",
      max_tokens: 16000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low", format: betaZodOutputFormat(Resposta) },
      system: SISTEMA,
      messages: [
        {
          role: "user",
          content: `Target language: ${NOME_IDIOMA[idioma]}\n\nTexts (JSON array):\n${JSON.stringify(textos)}`,
        },
      ],
    });
    if (resposta.stop_reason === "refusal") return null;
    const lista = resposta.parsed_output?.traducoes;
    return lista && lista.length === textos.length ? lista : null;
  } catch (e) {
    if (e instanceof Anthropic.RateLimitError) console.warn("Tradução: limite da API atingido");
    else if (e instanceof Anthropic.AuthenticationError) console.warn("Tradução: ANTHROPIC_API_KEY inválida");
    else if (e instanceof Anthropic.APIError) console.warn(`Tradução: erro da API ${e.status}`);
    else console.warn("Tradução falhou:", (e as Error).message);
    return null;
  }
}

/**
 * Traduz vários textos para um idioma. Usa primeiro o cache do banco; só os textos novos vão para a API,
 * todos de uma vez. Textos que não puderem ser traduzidos voltam como estão.
 */
export async function traduzirTextos(textos: string[], idioma: Idioma): Promise<string[]> {
  const unicos = [...new Set(textos.map((t) => t.trim()).filter(Boolean))];
  if (unicos.length === 0) return textos;
  const hashes = new Map(unicos.map((t) => [t, hashTexto(t)]));

  const guardadas = await db.traducao.findMany({ where: { idioma, hash: { in: [...hashes.values()] } } });
  const porHash = new Map(guardadas.map((g) => [g.hash, g.texto]));

  const faltando = unicos.filter((t) => !porHash.has(hashes.get(t)!));
  // Lotes pequenos mantêm a resposta rápida e o JSON curto
  for (let i = 0; i < faltando.length; i += 40) {
    const lote = faltando.slice(i, i + 40);
    const traduzidos = await traduzirNaApi(lote, idioma);
    if (!traduzidos) continue;
    await db.traducao.createMany({
      data: lote.map((t, j) => ({ hash: hashes.get(t)!, idioma, texto: traduzidos[j] })),
      skipDuplicates: true,
    });
    lote.forEach((t, j) => porHash.set(hashes.get(t)!, traduzidos[j]));
  }

  return textos.map((t) => porHash.get(hashTexto(t)) ?? t);
}

// Junta os textos pedidos durante a mesma renderização numa chamada só (um lote por idioma).
const filas = new Map<Idioma, { textos: string[]; esperando: ((r: string[]) => void)[]; agendado: boolean }>();

export function traduzir(texto: string, idioma: Idioma): Promise<string> {
  let fila = filas.get(idioma);
  if (!fila) {
    fila = { textos: [], esperando: [], agendado: false };
    filas.set(idioma, fila);
  }
  const indice = fila.textos.length;
  fila.textos.push(texto);
  const promessa = new Promise<string[]>((ok) => fila!.esperando.push(ok)).then((r) => r[indice] ?? texto);
  if (!fila.agendado) {
    fila.agendado = true;
    setTimeout(async () => {
      filas.delete(idioma);
      const resultado = await traduzirTextos(fila!.textos, idioma).catch(() => fila!.textos);
      fila!.esperando.forEach((ok) => ok(resultado));
    }, 0);
  }
  return promessa;
}
