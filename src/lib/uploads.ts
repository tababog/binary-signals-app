import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

// Com SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY os arquivos vão para o Supabase Storage (bucket privado).
// Sem eles, ficam na pasta UPLOAD_DIR do servidor (bom para rodar no próprio computador).
const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/$/, "");
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.SUPABASE_BUCKET || "comprovantes";
const usarSupabase = Boolean(SUPABASE_URL && SUPABASE_KEY);

export const PASTA_UPLOADS = path.resolve(process.env.UPLOAD_DIR || "./uploads");

// A Vercel recusa requisições acima de ~4,5 MB; as fotos são reduzidas no celular antes do envio.
export const TAMANHO_MAXIMO = 4 * 1024 * 1024;

const EXTENSOES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/heif": "heif",
  "application/pdf": "pdf",
};

export const TIPOS_COMPROVANTE = EXTENSOES;

function urlObjeto(nome: string) {
  return `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${encodeURIComponent(nome)}`;
}

// Chaves novas do Supabase ("sb_secret_...") vão só no cabeçalho apikey; as antigas (JWT "eyJ...")
// também precisam do Authorization.
function cabecalhos(extra: Record<string, string> = {}): Record<string, string> {
  const base: Record<string, string> = { apikey: SUPABASE_KEY! };
  if (!SUPABASE_KEY!.startsWith("sb_")) base.Authorization = `Bearer ${SUPABASE_KEY}`;
  return { ...base, ...extra };
}

/** Salva a foto do recibo e devolve o nome do arquivo (ou null se não houver arquivo). */
export async function salvarComprovante(arquivo: FormDataEntryValue | null): Promise<string | null> {
  if (!(arquivo instanceof File) || arquivo.size === 0) return null;
  const ext = EXTENSOES[arquivo.type];
  if (!ext) throw new Error("Formato de arquivo não aceito. Envie uma foto (JPG, PNG, HEIC) ou PDF.");
  if (arquivo.size > TAMANHO_MAXIMO) throw new Error("Arquivo maior que 4 MB. Tire a foto pelo botão do app ou envie um PDF menor.");
  const nome = `${randomUUID()}.${ext}`;
  const conteudo = Buffer.from(await arquivo.arrayBuffer());

  if (usarSupabase) {
    const enviar = (headers: Record<string, string>) =>
      fetch(urlObjeto(nome), { method: "POST", headers: { ...headers, "Content-Type": arquivo.type, "x-upsert": "false" }, body: conteudo });
    let r = await enviar(cabecalhos());
    // Recusa de autorização com chave nova (sb_secret_): tenta de novo mandando a chave também no Authorization
    if (!r.ok && [400, 401, 403].includes(r.status) && SUPABASE_KEY!.startsWith("sb_")) {
      r = await enviar({ ...cabecalhos(), Authorization: `Bearer ${SUPABASE_KEY}` });
    }
    if (!r.ok) {
      const motivo = (await r.text().catch(() => "")).slice(0, 300);
      console.error(`Supabase Storage recusou o arquivo (${r.status}): ${motivo}`);
      let mensagem = "";
      try {
        mensagem = (JSON.parse(motivo) as { message?: string }).message ?? "";
      } catch {}
      throw new Error(`Não foi possível guardar o arquivo (${r.status}${mensagem ? `: ${mensagem}` : ""}). Tente de novo.`);
    }
  } else {
    await mkdir(PASTA_UPLOADS, { recursive: true });
    await writeFile(path.join(PASTA_UPLOADS, nome), conteudo);
  }
  return nome;
}

/** Conteúdo do arquivo guardado, ou null se não existir. */
export async function lerComprovante(nome: string): Promise<Buffer | null> {
  const seguro = path.basename(nome);
  if (usarSupabase) {
    const r = await fetch(urlObjeto(seguro), { headers: cabecalhos(), cache: "no-store" });
    return r.ok ? Buffer.from(await r.arrayBuffer()) : null;
  }
  return readFile(path.join(PASTA_UPLOADS, seguro)).catch(() => null);
}

export async function apagarComprovante(nome: string | null) {
  if (!nome) return;
  const seguro = path.basename(nome);
  if (usarSupabase) {
    await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}`, {
      method: "DELETE",
      headers: cabecalhos({ "Content-Type": "application/json" }),
      body: JSON.stringify({ prefixes: [seguro] }),
    }).catch(() => {});
    return;
  }
  await unlink(path.join(PASTA_UPLOADS, seguro)).catch(() => {});
}
