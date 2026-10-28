import { createHash, randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { db } from "./db";

const VALIDADE_DIAS = 7;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

/** Cria um novo link de convite para o usuário (o anterior deixa de valer). Devolve o token, que só existe no link. */
export async function gerarConvite(usuarioId: string) {
  const token = randomBytes(32).toString("base64url");
  await db.usuario.update({
    where: { id: usuarioId },
    data: { conviteHash: hashToken(token), conviteExpira: new Date(Date.now() + VALIDADE_DIAS * 24 * 3600 * 1000) },
  });
  return token;
}

/** Usuário dono de um convite ainda válido, ou null. */
export async function usuarioDoConvite(token: string) {
  if (!/^[A-Za-z0-9_-]{20,100}$/.test(token)) return null;
  const usuario = await db.usuario.findFirst({ where: { conviteHash: hashToken(token) } });
  if (!usuario || !usuario.ativo || !usuario.conviteExpira || usuario.conviteExpira < new Date()) return null;
  return usuario;
}

/** Endereço completo do link, com o domínio pelo qual o administrador está acessando o app. */
export function linkConvite(token: string) {
  const h = headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const protocolo = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${protocolo}://${host}/convite/${token}`;
}
