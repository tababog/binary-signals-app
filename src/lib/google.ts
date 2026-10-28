import { importPKCS8, SignJWT } from "jose";

/**
 * Conta de serviço do Google (GOOGLE_SERVICE_ACCOUNT_JSON, ver docs/hospedagem.md, Parte 4).
 * Lê a planilha de fluxo de caixa no Drive e cria os lembretes das visitas na Google Agenda dos sócios.
 */

export type ContaServico = { client_email: string; private_key: string };

export function contaServico(): ContaServico | null {
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

/** E-mail da conta de serviço, para mostrar com quem compartilhar a pasta e as agendas. */
export function emailContaServico() {
  return contaServico()?.client_email ?? null;
}

const tokens = new Map<string, { valor: string; expira: number }>();

/** Token de acesso para um escopo (guardado até perto de expirar). */
export async function tokenGoogle(conta: ContaServico, escopo: string) {
  const guardado = tokens.get(escopo);
  if (guardado && guardado.expira > Date.now() + 60_000) return guardado.valor;
  const chave = await importPKCS8(conta.private_key, "RS256");
  const agora = Math.floor(Date.now() / 1000);
  const assercao = await new SignJWT({ scope: escopo })
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
  tokens.set(escopo, { valor: dados.access_token, expira: Date.now() + dados.expires_in * 1000 });
  return dados.access_token;
}
