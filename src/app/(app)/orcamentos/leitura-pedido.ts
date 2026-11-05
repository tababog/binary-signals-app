"use server";

import Anthropic from "@anthropic-ai/sdk";
import { exigirAdmin } from "@/lib/auth";
import { getT, idiomaAtual } from "@/i18n/servidor";
import { lerPedidoIA } from "@/lib/leitura-pedido";

/** Botão "Ler print da conversa do cliente": devolve o pedido escrito para o campo "O que o cliente quer". */
export async function lerPedidoCliente(form: FormData): Promise<{ texto: string } | { erro: string }> {
  await exigirAdmin();
  const t = getT();
  const imagens = form.getAll("print").filter((f): f is File => f instanceof File && f.size > 0).slice(0, 5);
  if (!imagens.length) return { erro: t("Escolha o print da conversa.") };
  if (imagens.some((f) => f.size > 4 * 1024 * 1024)) return { erro: t("Arquivo maior que 4 MB.") };
  if (!process.env.ANTHROPIC_API_KEY) return { erro: t("A IA não está ligada: falta a chave ANTHROPIC_API_KEY na Vercel.") };
  try {
    const texto = await lerPedidoIA(imagens, idiomaAtual());
    if (!texto) return { erro: t("Não consegui ler o print. Use uma imagem JPG ou PNG.") };
    return { texto };
  } catch (e) {
    console.error("Leitura do print falhou:", e);
    if (e instanceof Anthropic.APIError) return { erro: t("A API da Anthropic respondeu com erro ({status}): {msg}", { status: String(e.status ?? "?"), msg: e.message.slice(0, 200) }) };
    return { erro: (e as Error).message.slice(0, 200) };
  }
}
