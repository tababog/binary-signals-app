import { readFile } from "node:fs/promises";
import path from "node:path";
import { usuarioAtual } from "@/lib/auth";
import { PASTA_UPLOADS, TIPOS_COMPROVANTE } from "@/lib/uploads";

// Os recibos só podem ser vistos pelos administradores.
export async function GET(_req: Request, { params }: { params: { arquivo: string } }) {
  const usuario = await usuarioAtual();
  if (!usuario || usuario.papel !== "ADMIN") return new Response("Não autorizado", { status: 403 });

  const nome = path.basename(params.arquivo);
  const ext = nome.split(".").pop() ?? "";
  const tipo = Object.entries(TIPOS_COMPROVANTE).find(([, e]) => e === ext)?.[0];
  if (!tipo) return new Response("Não encontrado", { status: 404 });

  try {
    const conteudo = await readFile(path.join(PASTA_UPLOADS, nome));
    return new Response(conteudo, { headers: { "Content-Type": tipo, "Cache-Control": "private, max-age=86400" } });
  } catch {
    return new Response("Não encontrado", { status: 404 });
  }
}
