const MOEDA = process.env.NEXT_PUBLIC_MOEDA || "BRL";
export const FUSO = process.env.NEXT_PUBLIC_FUSO || "America/Sao_Paulo";

const fmtMoeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: MOEDA });

export function dinheiro(centavos: number) {
  return fmtMoeda.format(centavos / 100);
}

/** Aceita "1.234,56", "1234,56", "1234.56" ou "1234". Retorna centavos. */
export function paraCentavos(texto: FormDataEntryValue | null): number {
  let s = String(texto ?? "").trim().replace(/[^\d.,-]/g, "");
  if (!s) return 0;
  if (s.includes(",")) s = s.replace(/\./g, "").replace(",", ".");
  const n = Number(s);
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}

/** Centavos para o formato usado nos campos de formulário ("1234,56"). */
export function centavosParaCampo(centavos: number) {
  return (centavos / 100).toFixed(2).replace(".", ",");
}

export function data(d: Date | null | undefined) {
  if (!d) return "—";
  return d.toLocaleDateString("pt-BR", { timeZone: FUSO });
}

export function dataHora(d: Date | null | undefined) {
  if (!d) return "—";
  return d.toLocaleString("pt-BR", { timeZone: FUSO, dateStyle: "short", timeStyle: "short" });
}

export function hora(d: Date | null | undefined) {
  if (!d) return "—";
  return d.toLocaleTimeString("pt-BR", { timeZone: FUSO, hour: "2-digit", minute: "2-digit" });
}

export function horas(ms: number) {
  const totalMin = Math.round(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}h${String(m).padStart(2, "0")}`;
}

/** Valor para <input type="date"> (yyyy-mm-dd) no fuso configurado. */
export function campoData(d: Date | null | undefined) {
  if (!d) return "";
  return d.toLocaleDateString("en-CA", { timeZone: FUSO });
}

/** Converte "yyyy-mm-dd" de um formulário em Date (meio-dia, para não mudar de dia com o fuso). */
export function lerData(valor: FormDataEntryValue | null): Date | null {
  const s = String(valor ?? "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  return new Date(`${s}T12:00:00Z`);
}

export function texto(valor: FormDataEntryValue | null): string | null {
  const s = String(valor ?? "").trim();
  return s ? s : null;
}

/** Valor para <input type="datetime-local"> no fuso configurado. */
export function campoDataHora(d: Date | null | undefined) {
  if (!d) return "";
  return d
    .toLocaleString("sv-SE", { timeZone: FUSO, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })
    .replace(" ", "T");
}

/** Converte "yyyy-mm-ddThh:mm" (horário local do fuso configurado) em Date. */
export function lerDataHora(valor: FormDataEntryValue | null): Date | null {
  const s = String(valor ?? "");
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(s)) return null;
  const comoUtc = new Date(`${s}:00Z`);
  const noFuso = new Date(comoUtc.toLocaleString("en-US", { timeZone: FUSO }));
  const emUtc = new Date(comoUtc.toLocaleString("en-US", { timeZone: "UTC" }));
  return new Date(comoUtc.getTime() - (noFuso.getTime() - emUtc.getTime()));
}

/** Primeiro instante do mês atual no fuso configurado. */
export function inicioDoMes() {
  return lerDataHora(`${campoData(new Date()).slice(0, 8)}01T00:00`)!;
}
