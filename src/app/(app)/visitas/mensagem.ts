"use server";

import { exigirAdmin } from "@/lib/auth";
import { getT } from "@/i18n/servidor";
import { traduzirTextos } from "@/lib/traducao";

/** Traduz para inglês a mensagem escrita pelo administrador (o cliente sempre recebe em inglês, regra 9). */
export async function traduzirParaCliente(texto: string): Promise<{ texto: string } | { erro: string }> {
  await exigirAdmin();
  const t = getT();
  const limpo = texto.trim();
  if (!limpo) return { erro: t("Escreva a mensagem.") };
  if (!process.env.ANTHROPIC_API_KEY) return { erro: t("A IA não está ligada: falta a chave ANTHROPIC_API_KEY na Vercel.") };
  const [ingles] = await traduzirTextos([limpo], "en");
  return { texto: ingles };
}
