import { readFile } from "fs/promises";
import { importPKCS8, SignJWT } from "jose";

/**
 * Fluxo de caixa da empresa lido da planilha "Fluxo de Caixa ... - resumo" na pasta do Google Drive.
 * O app entra no Drive com uma conta de serviço do Google (GOOGLE_SERVICE_ACCOUNT_JSON) que tem acesso
 * de leitor à pasta; pega a planilha de fluxo de caixa mais recente e lê a primeira aba como CSV.
 * A planilha de lançamentos (extrato linha a linha) não é usada.
 */

/** Pasta "Empresa" no Drive com as planilhas de fluxo de caixa. */
const PASTA_PADRAO = "1Lw-7-vGy2nabto_oWf4CCwMnFB4CPVMd";

/** Como cada saída da planilha entra nas contas da empresa. */
export type Grupo = "OBRA" | "FIXO" | "SOCIOS";

export const GRUPOS: Record<Grupo, string> = {
  OBRA: "Custos diretos das obras",
  FIXO: "Custos fixos da empresa",
  SOCIOS: "Retiradas dos sócios",
};

// Material, subempreiteiros, helpers e caçamba são gastos de cada obra; retiradas são o pró-labore;
// todo o resto (galpão, gasolina, refeição, seguro, carro, banco, contador...) é custo fixo.
const REGRAS: [RegExp, Grupo][] = [
  [/supplier|fornecedor|material|sub ?contract|subempreit|helper|dump|lixo|ca[cç]amba/, "OBRA"],
  [/retirada|pr[oó][ -]?labore|s[oó]cio/, "SOCIOS"],
];

export function grupoDoItem(item: string): Grupo {
  const nome = item.toLowerCase();
  return REGRAS.find(([re]) => re.test(nome))?.[1] ?? "FIXO";
}

export type Linha = { item: string; valores: number[]; total: number; grupo?: Grupo };

export type FluxoCaixa = {
  planilha: { nome: string; link: string; atualizadaEm: string | null };
  meses: string[];
  saldoInicial: number[];
  entradas: Linha[];
  saidas: Linha[];
  totalEntradas: number[];
  totalSaidas: number[];
  resultado: number[];
  saldoFinal: number[];
  /** Saldo no extrato do banco, quando a planilha tem essa linha (para conferência). */
  extrato: number[] | null;
};

export type ResultadoFluxo = { ok: true; fluxo: FluxoCaixa } | { ok: false; motivo: "SEM_CONFIGURACAO" | "SEM_PLANILHA" | "ERRO"; detalhe?: string };

// ---------- leitura do CSV ----------

function linhasCsv(csv: string): string[][] {
  const linhas: string[][] = [];
  let linha: string[] = [];
  let campo = "";
  let aspas = false;
  for (let i = 0; i < csv.length; i++) {
    const c = csv[i];
    if (aspas) {
      if (c === '"' && csv[i + 1] === '"') { campo += '"'; i++; }
      else if (c === '"') aspas = false;
      else campo += c;
    } else if (c === '"') aspas = true;
    else if (c === ",") { linha.push(campo); campo = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && csv[i + 1] === "\n") i++;
      linha.push(campo); linhas.push(linha); linha = []; campo = "";
    } else campo += c;
  }
  if (campo || linha.length) { linha.push(campo); linhas.push(linha); }
  return linhas;
}

/** "$1,061.00", "-4639.45", "(150.00)" ou "1.061,00" → centavos. Vazio → null. */
export function lerValor(texto: string | undefined): number | null {
  let s = (texto ?? "").trim().replace(/[$\s]/g, "").replace(/^\\/, "");
  if (!s || s === "-") return null;
  const negativo = /^\(.*\)$/.test(s) || s.startsWith("-");
  s = s.replace(/[()\-]/g, "");
  const ponto = s.lastIndexOf(".");
  const virgula = s.lastIndexOf(",");
  // O separador decimal é o último que aparece; o outro é de milhar
  if (virgula > ponto) s = s.replace(/\./g, "").replace(",", ".");
  else s = s.replace(/,/g, "");
  const n = Number(s);
  if (!Number.isFinite(n)) return null;
  return Math.round((negativo ? -n : n) * 100);
}

const sem = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

export function interpretarPlanilha(csv: string, planilha: FluxoCaixa["planilha"]): FluxoCaixa {
  const linhas = linhasCsv(csv).filter((l) => l.some((c) => c.trim()));
  const iCabecalho = linhas.findIndex((l) => sem(l[0] ?? "") === "item" || l.slice(1).some((c) => /^(jan|fev|feb)/i.test(c.trim())));
  if (iCabecalho < 0) throw new Error("Não achei a linha com os meses (Item | Jan | Fev ...).");
  const cabecalho = linhas[iCabecalho];
  // Colunas de mês: todas com título, menos a do total
  const colunas = cabecalho.map((c, i) => ({ c: c.trim(), i })).filter(({ c, i }) => i > 0 && c && !/total/i.test(c));
  const colTotal = cabecalho.findIndex((c, i) => i > 0 && /total/i.test(c));
  const meses = colunas.map(({ c }) => c);
  const valoresDe = (l: string[]) => colunas.map(({ i }) => lerValor(l[i]) ?? 0);

  const fluxo: FluxoCaixa = {
    planilha, meses, saldoInicial: [], entradas: [], saidas: [], totalEntradas: [], totalSaidas: [],
    resultado: [], saldoFinal: [], extrato: null,
  };
  let secao: "ENTRADAS" | "SAIDAS" | null = null;
  for (const l of linhas.slice(iCabecalho + 1)) {
    const item = (l[0] ?? "").trim();
    const nome = sem(item);
    const temValor = colunas.some(({ i }) => lerValor(l[i]) !== null);
    if (!item) continue;
    if (!temValor) {
      if (nome.startsWith("entrada")) secao = "ENTRADAS";
      else if (nome.startsWith("saida")) secao = "SAIDAS";
      continue;
    }
    const valores = valoresDe(l);
    const total = colTotal > 0 ? lerValor(l[colTotal]) ?? valores.reduce((s, v) => s + v, 0) : valores.reduce((s, v) => s + v, 0);
    if (nome.startsWith("saldo inicial")) fluxo.saldoInicial = valores;
    else if (nome.startsWith("total de entrada") || nome === "total entradas") fluxo.totalEntradas = valores;
    else if (nome.startsWith("total de saida") || nome === "total saidas") { fluxo.totalSaidas = valores; secao = null; }
    else if (nome.startsWith("resultado")) fluxo.resultado = valores;
    else if (nome.startsWith("saldo final")) fluxo.saldoFinal = valores;
    else if (nome.includes("extrato")) fluxo.extrato = valores;
    else if (nome.startsWith("diferenca")) continue;
    else if (secao === "ENTRADAS") fluxo.entradas.push({ item, valores, total });
    else if (secao === "SAIDAS") fluxo.saidas.push({ item, valores, total, grupo: grupoDoItem(item) });
  }

  // Linhas de total que faltarem são calculadas
  const soma = (ls: Linha[]) => meses.map((_, m) => ls.reduce((s, l) => s + l.valores[m], 0));
  if (!fluxo.totalEntradas.length) fluxo.totalEntradas = soma(fluxo.entradas);
  if (!fluxo.totalSaidas.length) fluxo.totalSaidas = soma(fluxo.saidas);
  if (!fluxo.resultado.length) fluxo.resultado = meses.map((_, m) => fluxo.totalEntradas[m] - fluxo.totalSaidas[m]);
  if (!fluxo.saldoInicial.length) fluxo.saldoInicial = meses.map(() => 0);
  if (!fluxo.saldoFinal.length) fluxo.saldoFinal = meses.map((_, m) => fluxo.saldoInicial[m] + fluxo.resultado[m]);
  return fluxo;
}

/** Soma por grupo (custos de obra, fixos, retiradas) em cada mês. */
export function totaisPorGrupo(fluxo: FluxoCaixa) {
  const r = {} as Record<Grupo, number[]>;
  for (const g of Object.keys(GRUPOS) as Grupo[]) {
    r[g] = fluxo.meses.map((_, m) => fluxo.saidas.filter((s) => s.grupo === g).reduce((t, s) => t + s.valores[m], 0));
  }
  return r;
}

/** Média mensal de cada custo fixo real (meses da planilha que já tiveram movimento). */
export function mediasCustosFixos(fluxo: FluxoCaixa) {
  const mesesComMovimento = fluxo.meses.map((_, m) => m).filter((m) => fluxo.totalEntradas[m] !== 0 || fluxo.totalSaidas[m] !== 0);
  const n = mesesComMovimento.length || 1;
  const itens = fluxo.saidas
    .filter((s) => s.grupo === "FIXO")
    .map((s) => ({ item: s.item, mediaCent: Math.round(mesesComMovimento.reduce((t, m) => t + s.valores[m], 0) / n) }))
    .filter((s) => s.mediaCent > 0)
    .sort((a, b) => b.mediaCent - a.mediaCent);
  return { meses: n, itens, totalCent: itens.reduce((t, i) => t + i.mediaCent, 0) };
}

// ---------- acesso ao Google Drive ----------

type ContaServico = { client_email: string; private_key: string };

function contaServico(): ContaServico | null {
  const bruto = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!bruto) return null;
  try {
    const json = JSON.parse(bruto.trim().startsWith("{") ? bruto : Buffer.from(bruto, "base64").toString("utf8"));
    if (!json.client_email || !json.private_key) return null;
    return { client_email: json.client_email, private_key: String(json.private_key).replace(/\\n/g, "\n") };
  } catch {
    return null;
  }
}

let tokenGuardado: { valor: string; expira: number } | null = null;

async function tokenGoogle(conta: ContaServico) {
  if (tokenGuardado && tokenGuardado.expira > Date.now() + 60_000) return tokenGuardado.valor;
  const chave = await importPKCS8(conta.private_key, "RS256");
  const agora = Math.floor(Date.now() / 1000);
  const assercao = await new SignJWT({ scope: "https://www.googleapis.com/auth/drive.readonly" })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuer(conta.client_email)
    .setAudience("https://oauth2.googleapis.com/token")
    .setIssuedAt(agora)
    .setExpirationTime(agora + 3600)
    .sign(chave);
  const resp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: assercao }),
    cache: "no-store",
  });
  if (!resp.ok) throw new Error(`Google recusou a conta de serviço (${resp.status}).`);
  const dados = (await resp.json()) as { access_token: string; expires_in: number };
  tokenGuardado = { valor: dados.access_token, expira: Date.now() + dados.expires_in * 1000 };
  return dados.access_token;
}

/** E-mail da conta de serviço, para mostrar com quem compartilhar a pasta. */
export function emailContaServico() {
  return contaServico()?.client_email ?? null;
}

export async function lerFluxoCaixa(): Promise<ResultadoFluxo> {
  // Só para testes no computador: lê um CSV salvo em vez do Drive
  const local = process.env.NODE_ENV !== "production" ? process.env.FLUXO_CAIXA_CSV_LOCAL : undefined;
  if (local) {
    const csv = await readFile(local, "utf8");
    return { ok: true, fluxo: interpretarPlanilha(csv, { nome: "Fluxo de Caixa (arquivo local)", link: "#", atualizadaEm: null }) };
  }

  const conta = contaServico();
  if (!conta) return { ok: false, motivo: "SEM_CONFIGURACAO" };
  try {
    const token = await tokenGoogle(conta);
    const auth = { Authorization: `Bearer ${token}` };
    const pasta = process.env.GOOGLE_DRIVE_PASTA_FLUXO || PASTA_PADRAO;
    const q = `'${pasta}' in parents and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false`;
    const lista = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&orderBy=modifiedTime desc&fields=files(id,name,modifiedTime,webViewLink)&pageSize=50&supportsAllDrives=true&includeItemsFromAllDrives=true`,
      { headers: auth, next: { revalidate: 300 } },
    );
    if (!lista.ok) return { ok: false, motivo: "ERRO", detalhe: `Drive respondeu ${lista.status} ao listar a pasta.` };
    const { files = [] } = (await lista.json()) as { files?: { id: string; name: string; modifiedTime: string; webViewLink: string }[] };
    // Prefere a planilha de "fluxo de caixa" (resumo); a de lançamentos fica de fora
    const candidatas = files.filter((f) => /fluxo de caixa/i.test(sem(f.name)) && !/lancamento/i.test(sem(f.name)));
    const arquivo = candidatas.find((f) => /resumo/i.test(f.name)) ?? candidatas[0];
    if (!arquivo) return { ok: false, motivo: "SEM_PLANILHA" };

    const csv = await fetch(`https://www.googleapis.com/drive/v3/files/${arquivo.id}/export?mimeType=text/csv`, {
      headers: auth,
      next: { revalidate: 300 },
    });
    if (!csv.ok) return { ok: false, motivo: "ERRO", detalhe: `Drive respondeu ${csv.status} ao abrir a planilha.` };
    return {
      ok: true,
      fluxo: interpretarPlanilha(await csv.text(), { nome: arquivo.name, link: arquivo.webViewLink, atualizadaEm: arquivo.modifiedTime }),
    };
  } catch (e) {
    return { ok: false, motivo: "ERRO", detalhe: (e as Error).message };
  }
}

// Palavras que indicam o mesmo custo com nomes diferentes (cadastro manual x planilha)
const SINONIMOS = [/combust|gasolin|fuel|\bgas\b/, /galp|aluguel|\brent\b/, /liabil/, /energia|eletric|elecric|\bluz\b|electric/, /contador|accountant/, /propaganda|marketing|anuncio/];

/** O custo fixo cadastrado à mão é o mesmo que um item da planilha? (ex.: "Combustível" e "Gasolina") */
export function mesmoCusto(cadastrado: string, item: string) {
  const a = sem(cadastrado);
  const b = sem(item);
  if (a === b) return true;
  return SINONIMOS.some((re) => re.test(a) && re.test(b));
}
