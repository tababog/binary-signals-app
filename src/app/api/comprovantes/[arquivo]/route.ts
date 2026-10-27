import { usuarioAtual } from "@/lib/auth";
import { TIPOS_COMPROVANTE, lerComprovante } from "@/lib/uploads";

// Os recibos só podem ser vistos pelos administradores.
export async function GET(_req: Request, { params }: { params: { arquivo: string } }) {
  const usuario = await usuarioAtual();
  if (!usuario || usuario.papel !== "ADMIN") return new Response("Não autorizado", { status: 403 });

  const ext = params.arquivo.split(".").pop() ?? "";
  const tipo = Object.entries(TIPOS_COMPROVANTE).find(([, e]) => e === ext)?.[0];
  if (!tipo) return new Response("Não encontrado", { status: 404 });

  const conteudo = await lerComprovante(params.arquivo);
  if (!conteudo) return new Response("Não encontrado", { status: 404 });
  return new Response(new Uint8Array(conteudo), { headers: { "Content-Type": tipo, "Cache-Control": "private, max-age=86400" } });
}
