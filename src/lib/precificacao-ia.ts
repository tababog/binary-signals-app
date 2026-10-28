import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { CATEGORIAS_DESPESA, UNIDADES } from "./constantes";
import type { Mercado } from "./orcamento";

/**
 * Precificação com a API da Anthropic (etapa 6, regras 2, 3 e 5):
 * 1) pesquisa na web o preço de mercado do serviço na cidade da obra (cost guides do Thumbtack, Angi/HomeAdvisor,
 *    HomeGuide, Homewyse e preços de material da Home Depot/Lowe's), guardando as fontes;
 * 2) organiza a pesquisa em duas opções (Essential e Premium) com itens de custo, dias previstos e a faixa de mercado.
 * Os textos para o cliente saem em inglês (regra 9). Os preços são sugestões: o administrador confere e ajusta.
 */

const MODELO = "claude-opus-5-5";

export type DadosPrecificacao = {
  servico: string;
  detalhes: string;
  descricao: string;
  cidade: string;
  condado: string | null;
  quantidade: number;
  unidade: string;
  /** Perguntas da IA já respondidas pelo administrador ("pergunta: resposta"). */
  respostas: { pergunta: string; resposta: string }[];
  historico: string | null;
  custoFixoPorDia: number;
};

const categorias = Object.keys(CATEGORIAS_DESPESA) as [keyof typeof CATEGORIAS_DESPESA, ...(keyof typeof CATEGORIAS_DESPESA)[]];

const Sugestao = z.object({
  mercado: z.object({
    faixa_baixa_usd: z.number(),
    faixa_alta_usd: z.number(),
    por_unidade_baixa_usd: z.number().nullable(),
    por_unidade_alta_usd: z.number().nullable(),
    resumo: z.string(),
    fontes: z.array(z.object({ nome: z.string(), url: z.string(), valor: z.string() })),
  }),
  opcoes: z.array(
    z.object({
      nome: z.string(),
      descricao: z.string(),
      dias_previstos: z.number(),
      itens: z.array(
        z.object({
          categoria: z.enum(categorias),
          descricao: z.string(),
          quantidade: z.number(),
          unidade: z.string(),
          custo_unitario_usd: z.number(),
        }),
      ),
    }),
  ),
});

export type SugestaoPrecificacao = {
  mercado: Mercado;
  opcoes: {
    nome: string;
    descricao: string;
    diasPrevistos: number;
    itens: { categoria: string; descricao: string; quantidade: number; unidade: string; custoUnitCent: number }[];
  }[];
};

let cliente: Anthropic | null = null;
function api() {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  cliente ??= new Anthropic({ timeout: 240_000, maxRetries: 1 });
  return cliente;
}

export function iaDisponivel() {
  return !!process.env.ANTHROPIC_API_KEY;
}

const cents = (usd: number) => Math.max(0, Math.round(usd * 100));

function descreverTrabalho(d: DadosPrecificacao) {
  const unidade = (UNIDADES as Record<string, string>)[d.unidade] ?? d.unidade;
  return [
    `Service: ${d.servico}${d.detalhes ? ` (${d.detalhes})` : ""}`,
    d.descricao && `What the client wants: ${d.descricao}`,
    `Location: ${d.cidade || "Connecticut"}, CT${d.condado ? ` (${d.condado} County)` : ""}`,
    d.quantidade > 0 && `Size: ${d.quantidade} ${unidade}`,
    d.respostas.length > 0 && `Details answered by the contractor:\n${d.respostas.map((r) => `- ${r.pergunta} ${r.resposta}`).join("\n")}`,
  ]
    .filter(Boolean)
    .join("\n");
}

const Perguntas = z.object({ perguntas: z.array(z.object({ pergunta: z.string(), opcoes: z.array(z.string()) })) });

const IDIOMA_PERGUNTAS = { pt: "Brazilian Portuguese", en: "American English", es: "Latin American Spanish" } as const;

/**
 * Antes da pesquisa: perguntas sobre o trabalho que mudam o preço (material, tamanho, acesso, demolição, permit...),
 * cada uma com respostas prontas para tocar. No idioma de quem está montando o orçamento.
 */
export async function gerarPerguntas(d: DadosPrecificacao, idioma: keyof typeof IDIOMA_PERGUNTAS) {
  const c = api();
  if (!c) return null;
  try {
    const r = await c.beta.messages.parse({
      model: MODELO,
      max_tokens: 8000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low", format: betaZodOutputFormat(Perguntas) },
      system: `You help a Connecticut remodeling contractor price a job. Ask the questions whose answers change the
cost or the price the most for this kind of job (materials and grade, exact dimensions, height/stories, access,
demolition and disposal of what exists, railings/stairs/trim details, permits, who supplies fixtures, timeline...).
Ask between 4 and 8 short questions, skip anything the job data already answers, and give 2 to 5 short typical
answers for each so the contractor can tap one. Write in ${IDIOMA_PERGUNTAS[idioma]}.`,
      messages: [{ role: "user", content: descreverTrabalho(d) }],
    });
    return r.parsed_output?.perguntas.slice(0, 8) ?? null;
  } catch (e) {
    if (e instanceof Anthropic.APIError) throw new Error(`A API da Anthropic respondeu com erro (${e.status}). Tente de novo.`);
    throw e;
  }
}

const LOCAL_CT = { type: "approximate" as const, region: "Connecticut", country: "US", timezone: "America/New_York" };

/** Pergunta com busca na web. Devolve o texto da resposta e as páginas que a busca abriu (url → título). */
async function buscarNaWeb(c: Anthropic, pergunta: string, buscas: number) {
  const messages: Anthropic.Beta.BetaMessageParam[] = [{ role: "user", content: pergunta }];
  const paginas = new Map<string, string>();
  let texto = "";
  for (let rodada = 0; rodada < 4; rodada++) {
    const r = await c.beta.messages.create({
      model: MODELO,
      max_tokens: 16000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      thinking: { type: "adaptive" },
      output_config: { effort: "medium" },
      tools: [
        { type: "web_search_20260209", name: "web_search", max_uses: buscas, user_location: LOCAL_CT },
        { type: "web_fetch_20260209", name: "web_fetch", max_uses: buscas },
      ],
      messages,
    });
    for (const bloco of r.content) {
      if (bloco.type === "text") texto += bloco.text;
      if (bloco.type === "web_search_tool_result" && Array.isArray(bloco.content)) {
        for (const p of bloco.content) if (p.type === "web_search_result") paginas.set(p.url, p.title);
      }
      if (bloco.type === "web_fetch_tool_result" && bloco.content.type === "web_fetch_result") paginas.set(bloco.content.url, bloco.content.url);
    }
    // Busca longa: a API pausa o turno; devolvendo a resposta ela continua de onde parou
    if (r.stop_reason !== "pause_turn") break;
    messages.push({ role: "assistant", content: r.content });
  }
  return { texto, paginas };
}

/** Passo 1: pesquisa de mercado com busca na web. */
function pesquisar(c: Anthropic, d: DadosPrecificacao, hoje: string) {
  return buscarNaWeb(
    c,
    `You are helping Tababog Construction LLC, a remodeling contractor in Connecticut, price a job. Today is ${hoje}.

${descreverTrabalho(d)}

Research the current market price for this job in this town/county using US cost guides (Thumbtack, Angi/HomeAdvisor,
HomeGuide, Homewyse) and current material prices at Home Depot and Lowe's. Prices in Fairfield County are usually
higher than in the rest of Connecticut, so prefer data for this area or adjust national figures and say how.
Report: the typical total price range for this size, the price per unit when it applies, the main materials with
unit prices (budget and premium grades), typical labor cost and crew days, and permits/dumpster/delivery if usual.
Cite each number with its source name and URL. Be concise.`,
    6,
  );
}

/** Passo 2: transforma a pesquisa em duas opções com itens de custo. */
async function organizar(c: Anthropic, d: DadosPrecificacao, pesquisa: string, paginas: Map<string, string>) {
  const r = await c.beta.messages.parse({
    model: MODELO,
    max_tokens: 16000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    thinking: { type: "adaptive" },
    output_config: { effort: "medium", format: betaZodOutputFormat(Sugestao) },
    system: `You build job estimates for Tababog Construction LLC (Connecticut). Every estimate has exactly two options
for the client: first "Essential" (good quality, budget-conscious materials) and then "Premium" (upgraded materials and
finishes). For each option list the COST items Tababog will pay (not the selling price): materials with realistic
quantities and unit prices, delivery, labor (crew of 2 at about $200 per worker per day, plus helpers or
subcontractors if the trade needs them), equipment rental, permits/inspections, dumpster/disposal and other costs.
Do not add overhead or profit: the app adds overhead per working day and targets a price of at least 2x cost.
Estimate the working days for each option. Write option descriptions and item descriptions in clear American English
for a client proposal. Use only facts from the research and the job data; when you estimate, keep it realistic for
Connecticut. In "mercado", give the market price range for the whole job (what contractors charge), the per-unit
range when it applies, a short summary in English and only sources whose URL appears in the research.`,
    messages: [
      {
        role: "user",
        content: `Job:\n${descreverTrabalho(d)}

Tababog's own history for this kind of job: ${d.historico ?? "none yet"}
Tababog's overhead per working day: $${(d.custoFixoPorDia / 100).toFixed(2)}

Market research:
${pesquisa}

Pages consulted:
${[...paginas].map(([url, titulo]) => `- ${titulo}: ${url}`).join("\n") || "(none)"}

Cost categories: ${categorias.join(", ")}.`,
      },
    ],
  });
  if (r.stop_reason === "refusal" || !r.parsed_output) return null;
  return r.parsed_output;
}

/**
 * Pesquisa o mercado e sugere as duas opções. Devolve null sem a chave da API;
 * lança um erro com mensagem em português se a API falhar.
 */
export async function sugerirOrcamento(d: DadosPrecificacao): Promise<SugestaoPrecificacao | null> {
  const c = api();
  if (!c) return null;
  const hoje = new Date().toISOString().slice(0, 10);
  try {
    const { texto, paginas } = await pesquisar(c, d, hoje);
    const s = await organizar(c, d, texto, paginas);
    if (!s || s.opcoes.length < 2) throw new Error("A IA não devolveu as duas opções. Tente de novo.");
    const urls = new Set(paginas.keys());
    return {
      mercado: {
        consultadoEm: hoje,
        cidade: d.cidade,
        faixaBaixaCent: cents(s.mercado.faixa_baixa_usd),
        faixaAltaCent: cents(s.mercado.faixa_alta_usd),
        porUnidade:
          s.mercado.por_unidade_baixa_usd !== null && s.mercado.por_unidade_alta_usd !== null
            ? { baixaCent: cents(s.mercado.por_unidade_baixa_usd), altaCent: cents(s.mercado.por_unidade_alta_usd), unidade: d.unidade }
            : null,
        resumo: s.mercado.resumo,
        // Só fontes que a busca realmente abriu
        fontes: s.mercado.fontes.filter((f) => urls.has(f.url)).slice(0, 8),
      },
      opcoes: s.opcoes.slice(0, 2).map((o) => ({
        nome: o.nome,
        descricao: o.descricao,
        diasPrevistos: Math.max(0, Math.round(o.dias_previstos)),
        itens: o.itens.map((i) => ({
          categoria: i.categoria,
          descricao: i.descricao,
          quantidade: Math.max(0, i.quantidade),
          unidade: i.unidade,
          custoUnitCent: cents(i.custo_unitario_usd),
        })),
      })),
    };
  } catch (e) {
    if (e instanceof Anthropic.RateLimitError) throw new Error("Limite da API da Anthropic atingido. Tente de novo em alguns minutos.");
    if (e instanceof Anthropic.AuthenticationError) throw new Error("A chave ANTHROPIC_API_KEY não é válida.");
    if (e instanceof Anthropic.APIConnectionTimeoutError) throw new Error("A pesquisa demorou demais. Tente de novo.");
    if (e instanceof Anthropic.APIError) throw new Error(`A API da Anthropic respondeu com erro (${e.status}). Tente de novo.`);
    throw e;
  }
}

// ---------- Preço da lista de material (Home Depot e Lowe's) ----------

const Materiais = z.object({
  itens: z.array(
    z.object({
      descricao: z.string(),
      quantidade: z.number(),
      unidade: z.string(),
      home_depot_usd: z.number().nullable(),
      home_depot_url: z.string().nullable(),
      lowes_usd: z.number().nullable(),
      lowes_url: z.string().nullable(),
      observacao: z.string(),
    }),
  ),
});

export type PrecoMaterial = {
  descricao: string;
  quantidade: number;
  unidade: string;
  homeDepotCent: number | null;
  homeDepotUrl: string | null;
  lowesCent: number | null;
  lowesUrl: string | null;
  observacao: string;
};

/**
 * Recebe a lista de material do administrador (um item por linha, com a quantidade) e busca o preço unitário de
 * cada item na Home Depot e na Lowe's, para a região da obra em Connecticut. Só aceita links que a busca abriu.
 */
export async function precosDeMaterial(lista: string, cidade: string): Promise<PrecoMaterial[] | null> {
  const c = api();
  if (!c) return null;
  const hoje = new Date().toISOString().slice(0, 10);
  try {
    const { texto, paginas } = await buscarNaWeb(
      c,
      `Today is ${hoje}. A remodeling contractor in ${cidade || "Connecticut"}, CT will buy the materials below.
For EACH line, find the current unit price at Home Depot (homedepot.com) and at Lowe's (lowes.com) for the closest
matching product, for a store near ${cidade || "Bridgeport"}, CT. Give the product name, the unit it is sold by, the
price at each store and the product page URL. If a store does not carry it, say so. Be concise.

Material list (quantity and description; the contractor may write in Portuguese, English or Spanish):
${lista}`,
      12,
    );
    const r = await c.beta.messages.parse({
      model: MODELO,
      max_tokens: 16000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low", format: betaZodOutputFormat(Materiais) },
      system: `Turn the price research into one entry per line of the contractor's material list, in the same order.
descricao: the product found, in American English (brand/size/grade). quantidade and unidade: what the contractor
asked for (convert to the store's selling unit when needed, e.g. boards, bags, boxes, gallons). Prices are per selling
unit in USD, null when the store has no match. URLs only from the pages consulted, else null. observacao: anything
the contractor should check (different size, special order, price per pack...), or "".`,
      messages: [
        {
          role: "user",
          content: `Material list:\n${lista}\n\nResearch:\n${texto}\n\nPages consulted:\n${[...paginas.keys()].join("\n") || "(none)"}`,
        },
      ],
    });
    if (!r.parsed_output) return null;
    const urls = new Set(paginas.keys());
    const link = (u: string | null) => (u && urls.has(u) ? u : null);
    return r.parsed_output.itens.map((i) => ({
      descricao: i.descricao,
      quantidade: Math.max(0, i.quantidade),
      unidade: i.unidade,
      homeDepotCent: i.home_depot_usd === null ? null : cents(i.home_depot_usd),
      homeDepotUrl: link(i.home_depot_url),
      lowesCent: i.lowes_usd === null ? null : cents(i.lowes_usd),
      lowesUrl: link(i.lowes_url),
      observacao: i.observacao,
    }));
  } catch (e) {
    if (e instanceof Anthropic.RateLimitError) throw new Error("Limite da API da Anthropic atingido. Tente de novo em alguns minutos.");
    if (e instanceof Anthropic.APIConnectionTimeoutError) throw new Error("A pesquisa demorou demais. Tente com menos itens.");
    if (e instanceof Anthropic.APIError) throw new Error(`A API da Anthropic respondeu com erro (${e.status}). Tente de novo.`);
    throw e;
  }
}
