import { usuarioAtual } from "@/lib/auth";
import { db } from "@/lib/db";
import { icsVisita } from "@/lib/agenda";

// Arquivo de calendário da visita, com alarmes: o celular abre e adiciona à agenda.
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const usuario = await usuarioAtual();
  if (!usuario || usuario.papel !== "ADMIN") return new Response("Não autorizado", { status: 403 });
  const visita = await db.visita.findUnique({ where: { id: params.id }, include: { cliente: true } });
  if (!visita) return new Response("Não encontrada", { status: 404 });

  const linkApp = new URL(`/visitas/${visita.id}`, req.url).toString();
  return new Response(icsVisita(visita, linkApp), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="visita-tababog.ics"`,
    },
  });
}
