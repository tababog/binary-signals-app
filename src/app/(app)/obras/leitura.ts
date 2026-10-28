"use server";

import { exigirAdmin } from "@/lib/auth";
import { lerComprovanteIA, type LeituraComprovante } from "@/lib/leitura-comprovante";

/** Chamado pelo botão de foto/arquivo do comprovante: lê o documento e devolve os campos para preencher o formulário. */
export async function lerComprovante(form: FormData): Promise<LeituraComprovante | null> {
  await exigirAdmin();
  const arquivo = form.get("arquivo");
  const tipo = form.get("tipo") === "DESPESA" ? "DESPESA" : "RECEBIMENTO";
  if (!(arquivo instanceof File) || arquivo.size === 0 || arquivo.size > 4 * 1024 * 1024) return null;
  try {
    return await lerComprovanteIA(arquivo, tipo);
  } catch (e) {
    console.warn("Leitura do comprovante falhou:", (e as Error).message);
    return null;
  }
}
