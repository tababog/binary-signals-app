import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

export const PASTA_UPLOADS = path.resolve(process.env.UPLOAD_DIR || "./uploads");

const EXTENSOES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/heif": "heif",
  "application/pdf": "pdf",
};

export const TIPOS_COMPROVANTE = EXTENSOES;

/** Salva a foto do recibo e devolve o nome do arquivo (ou null se não houver arquivo). */
export async function salvarComprovante(arquivo: FormDataEntryValue | null): Promise<string | null> {
  if (!(arquivo instanceof File) || arquivo.size === 0) return null;
  const ext = EXTENSOES[arquivo.type];
  if (!ext) throw new Error("Formato de arquivo não aceito. Envie uma foto (JPG, PNG, HEIC) ou PDF.");
  if (arquivo.size > 15 * 1024 * 1024) throw new Error("Arquivo maior que 15 MB.");
  await mkdir(PASTA_UPLOADS, { recursive: true });
  const nome = `${randomUUID()}.${ext}`;
  await writeFile(path.join(PASTA_UPLOADS, nome), Buffer.from(await arquivo.arrayBuffer()));
  return nome;
}
