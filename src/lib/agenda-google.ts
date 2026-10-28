import { db } from "./db";
import { contaServico, tokenGoogle } from "./google";
import { nomeTipoServico } from "./constantes";
import { getT } from "@/i18n/servidor";
import { idiomaValido } from "@/i18n/idiomas";
import { headers } from "next/headers";

/**
 * Lembretes das visitas na Google Agenda dos sócios (Alessandro e Emmanuel).
 * Cada administrador compartilha a própria agenda com a conta de serviço do app ("Fazer alterações nos eventos");
 * o app cria um evento por visita na agenda de cada um, com aviso 1 dia antes e 2 horas antes, dizendo quem vai.
 * A agenda de cada pessoa é a do e-mail de login dela no app.
 */

const ESCOPO = "https://www.googleapis.com/auth/calendar.events";
const API = "https://www.googleapis.com/calendar/v3/calendars";
const DURACAO_MS = 60 * 60 * 1000;
export const AVISOS_MINUTOS = [24 * 60, 2 * 60];

export function agendaGoogleConfigurada() {
  return contaServico() !== null;
}

/** Sócios (administradores ativos) que podem fazer a visita. */
export function adminsDaVisita() {
  return db.usuario.findMany({ where: { papel: "ADMIN", ativo: true }, orderBy: { nome: "asc" }, select: { id: true, nome: true } });
}

/** Link da visita no app, com o domínio pelo qual o administrador está acessando. */
export function linkDaVisita(id: string) {
  const h = headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const protocolo = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${protocolo}://${host}/visitas/${id}`;
}

const SEM_ADMIN = "nenhum administrador com e-mail";
const NAO_COMPARTILHADA = "agenda não compartilhada";

/** Todos os sócios receberam o evento na agenda. */
export function agendaTudoOk(status: string) {
  return status.split(" · ").every((p) => p.endsWith(": ok"));
}

/** O status fica guardado em português ("Nome: ok · Nome: agenda não compartilhada"); traduz para a tela. */
export function traduzirStatusAgenda(status: string, t: (s: string, v?: Record<string, string>) => string) {
  if (status === SEM_ADMIN) return t("nenhum sócio com e-mail cadastrado.");
  return status
    .split(" · ")
    .map((parte) => {
      const i = parte.indexOf(": ");
      if (i < 0) return parte;
      const nome = parte.slice(0, i);
      const r = parte.slice(i + 2);
      const traduzido = r === "ok" ? t("lembretes criados ✓") : r === NAO_COMPARTILHADA ? t("agenda não compartilhada com o app") : r;
      return `${nome}: ${traduzido}`;
    })
    .join(" · ");
}

type Eventos = Record<string, string>;

/**
 * Cria ou atualiza os eventos da visita na agenda de cada sócio (ou apaga, se a visita não está mais agendada).
 * Nunca lança erro: devolve e guarda em `agendaStatus` o que deu certo e o que falhou.
 */
export async function sincronizarAgenda(visitaId: string, linkApp: string): Promise<string | null> {
  const conta = contaServico();
  if (!conta) return null;
  const visita = await db.visita.findUnique({ where: { id: visitaId }, include: { cliente: true, responsavel: true } });
  if (!visita) return null;
  const admins = await db.usuario.findMany({ where: { papel: "ADMIN", ativo: true, email: { not: null } }, orderBy: { nome: "asc" } });
  const eventos: Eventos = visita.eventosAgenda ? JSON.parse(visita.eventosAgenda) : {};
  const futura = visita.status === "AGENDADA";

  let token: string;
  try {
    token = await tokenGoogle(conta, ESCOPO);
  } catch (e) {
    return guardar(visitaId, eventos, `erro: ${(e as Error).message}`);
  }
  const cab = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  const resultado: string[] = [];

  for (const admin of admins) {
    const agenda = encodeURIComponent(admin.email!);
    const id = eventos[admin.id];
    try {
      if (!futura) {
        if (id) await fetch(`${API}/${agenda}/events/${id}`, { method: "DELETE", headers: cab });
        delete eventos[admin.id];
        continue;
      }
      const t = getT(idiomaValido(admin.idioma) ? admin.idioma : "pt");
      const quem = visita.responsavel?.nome.split(" ")[0];
      const servico = visita.tipoServico ? t(nomeTipoServico(visita.tipoServico)) : "";
      const corpo = {
        summary: `${t("Visita")}: ${visita.cliente.nome}${servico ? ` (${servico})` : ""}${quem ? ` - ${quem}` : ""}`,
        location: visita.endereco ?? undefined,
        description: [
          quem && t("Quem vai: {nome}", { nome: visita.responsavel!.nome }),
          visita.cliente.telefone && `${t("Telefone")}: ${visita.cliente.telefone}`,
          visita.descricao,
          linkApp,
        ]
          .filter(Boolean)
          .join("\n"),
        start: { dateTime: visita.dataHora.toISOString(), timeZone: "America/New_York" },
        end: { dateTime: new Date(visita.dataHora.getTime() + DURACAO_MS).toISOString(), timeZone: "America/New_York" },
        reminders: { useDefault: false, overrides: AVISOS_MINUTOS.map((minutes) => ({ method: "popup", minutes })) },
      };
      let r = id
        ? await fetch(`${API}/${agenda}/events/${id}`, { method: "PUT", headers: cab, body: JSON.stringify(corpo) })
        : null;
      // Evento apagado à mão na agenda: cria de novo
      if (!r || r.status === 404 || r.status === 410) r = await fetch(`${API}/${agenda}/events`, { method: "POST", headers: cab, body: JSON.stringify(corpo) });
      if (!r.ok) {
        resultado.push(`${admin.nome.split(" ")[0]}: ${r.status === 404 || r.status === 403 ? NAO_COMPARTILHADA : `erro ${r.status}`}`);
        continue;
      }
      eventos[admin.id] = ((await r.json()) as { id: string }).id;
      resultado.push(`${admin.nome.split(" ")[0]}: ok`);
    } catch (e) {
      resultado.push(`${admin.nome.split(" ")[0]}: ${(e as Error).message}`);
    }
  }
  return guardar(visitaId, eventos, futura ? resultado.join(" · ") || SEM_ADMIN : null);
}

async function guardar(visitaId: string, eventos: Eventos, status: string | null) {
  await db.visita.update({ where: { id: visitaId }, data: { eventosAgenda: JSON.stringify(eventos), agendaStatus: status } }).catch(() => {});
  return status;
}
