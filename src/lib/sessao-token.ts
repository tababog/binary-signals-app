// Usado tanto no middleware (edge) quanto no servidor, por isso não importa o Prisma.
import { SignJWT, jwtVerify } from "jose";

export const COOKIE_SESSAO = "tababog_sessao";

export type DadosSessao = {
  id: string;
  nome: string;
  papel: "ADMIN" | "FUNCIONARIO";
};

function chave() {
  const segredo = process.env.AUTH_SECRET;
  if (!segredo) throw new Error("AUTH_SECRET não definido no .env");
  return new TextEncoder().encode(segredo);
}

export async function assinarSessao(dados: DadosSessao) {
  return new SignJWT(dados)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(chave());
}

export async function lerSessao(token: string | undefined): Promise<DadosSessao | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, chave());
    return { id: String(payload.id), nome: String(payload.nome), papel: payload.papel as DadosSessao["papel"] };
  } catch {
    return null;
  }
}
