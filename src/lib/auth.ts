import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "./db";
import { COOKIE_SESSAO, assinarSessao, lerSessao, type DadosSessao } from "./sessao-token";

export async function criarSessao(dados: DadosSessao) {
  cookies().set(COOKIE_SESSAO, await assinarSessao(dados), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function encerrarSessao() {
  cookies().delete(COOKIE_SESSAO);
}

/** Usuário logado, conferido no banco (um funcionário desativado perde o acesso na hora). */
export async function usuarioAtual() {
  const sessao = await lerSessao(cookies().get(COOKIE_SESSAO)?.value);
  if (!sessao) return null;
  const usuario = await db.usuario.findUnique({ where: { id: sessao.id } });
  if (!usuario || !usuario.ativo) return null;
  return usuario;
}

export async function exigirUsuario() {
  const usuario = await usuarioAtual();
  if (!usuario) redirect("/login");
  return usuario;
}

export async function exigirAdmin() {
  const usuario = await exigirUsuario();
  if (usuario.papel !== "ADMIN") redirect("/ponto");
  return usuario;
}
