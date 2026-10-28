import { nomeTipoServico } from "./constantes";

type Visita = {
  id: string;
  dataHora: Date;
  endereco: string | null;
  tipoServico: string | null;
  descricao: string | null;
  cliente: { nome: string; telefone: string | null };
};

const DURACAO_MS = 60 * 60 * 1000;

function titulo(v: Visita) {
  return `Visita Tababog: ${v.cliente.nome}${v.tipoServico ? ` (${nomeTipoServico(v.tipoServico)})` : ""}`;
}

function detalhes(v: Visita) {
  return [v.cliente.telefone && `Telefone: ${v.cliente.telefone}`, v.descricao].filter(Boolean).join("\n");
}

/** Data no formato de calendário em UTC: 20261103T133000Z */
function utc(d: Date) {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Link que abre o Google Agenda já com o evento preenchido (os avisos seguem o padrão da agenda da pessoa). */
export function linkGoogleAgenda(v: Visita) {
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: titulo(v),
    dates: `${utc(v.dataHora)}/${utc(new Date(v.dataHora.getTime() + DURACAO_MS))}`,
    details: detalhes(v),
    location: v.endereco ?? "",
  });
  return `https://calendar.google.com/calendar/render?${p}`;
}

function escapar(texto: string) {
  return texto.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

/** Quebra linhas longas a cada 75 bytes, como exige o formato iCalendar (RFC 5545). */
function dobrar(linha: string) {
  const partes: string[] = [];
  let atual = "";
  for (const c of linha) {
    if (Buffer.byteLength(atual + c) > (partes.length ? 74 : 75)) {
      partes.push(atual);
      atual = "";
    }
    atual += c;
  }
  partes.push(atual);
  return partes.join("\r\n ");
}

/** Arquivo .ics da visita com dois alarmes: 1 dia antes e 1 hora antes. */
export function icsVisita(v: Visita, linkApp: string) {
  const alarme = (gatilho: string, texto: string) => ["BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${escapar(texto)}`, `TRIGGER:${gatilho}`, "END:VALARM"];
  const linhas = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Tababog Construction//Tababog Obras//PT",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:visita-${v.id}@tababog-obras`,
    `DTSTAMP:${utc(new Date())}`,
    `DTSTART:${utc(v.dataHora)}`,
    `DTEND:${utc(new Date(v.dataHora.getTime() + DURACAO_MS))}`,
    `SUMMARY:${escapar(titulo(v))}`,
    ...(v.endereco ? [`LOCATION:${escapar(v.endereco)}`] : []),
    `DESCRIPTION:${escapar([detalhes(v), linkApp].filter(Boolean).join("\n"))}`,
    `URL:${linkApp}`,
    ...alarme("-P1D", `Amanhã: ${titulo(v)}`),
    ...alarme("-PT1H", `Em 1 hora: ${titulo(v)}`),
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return linhas.map(dobrar).join("\r\n") + "\r\n";
}
