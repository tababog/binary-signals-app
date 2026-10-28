"use server";

import Anthropic from "@anthropic-ai/sdk";
import { exigirAdmin } from "@/lib/auth";
import { getT } from "@/i18n/servidor";
import { lerComprovanteIA, type LeituraComprovante } from "@/lib/leitura-comprovante";

/**
 * Chamado pelo botão de foto/arquivo do comprovante: lê o documento e devolve os campos para preencher o formulário,
 * ou o motivo de não ter conseguido (mostrado na tela).
 */
export async function lerComprovante(form: FormData): Promise<{ dados: LeituraComprovante } | { erro: string }> {
  await exigirAdmin();
  const t = getT();
  const arquivo = form.get("arquivo");
  const tipo = form.get("tipo") === "DESPESA" ? "DESPESA" : "RECEBIMENTO";
  if (!(arquivo instanceof File) || arquivo.size === 0) return { erro: t("O arquivo chegou vazio.") };
  if (arquivo.size > 4 * 1024 * 1024) return { erro: t("Arquivo maior que 4 MB.") };
  if (!process.env.ANTHROPIC_API_KEY) return { erro: t("A IA não está ligada: falta a chave ANTHROPIC_API_KEY na Vercel.") };
  try {
    const dados = await lerComprovanteIA(arquivo, tipo);
    if (!dados) return { erro: t("Formato de arquivo que a IA não lê ({tipo}). Use foto JPG/PNG ou PDF.", { tipo: arquivo.type || "?" }) };
    return { dados };
  } catch (e) {
    console.error("Leitura do comprovante falhou:", e);
    if (e instanceof Anthropic.APIError) return { erro: t("A API da Anthropic respondeu com erro ({status}): {msg}", { status: String(e.status ?? "?"), msg: e.message.slice(0, 200) }) };
    return { erro: (e as Error).message.slice(0, 200) };
  }
}
