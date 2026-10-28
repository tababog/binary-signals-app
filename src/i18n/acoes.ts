"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { usuarioAtual } from "@/lib/auth";
import { COOKIE_IDIOMA, idiomaValido } from "./idiomas";

/** Troca o idioma das telas e guarda a escolha no cadastro de quem está logado. */
export async function definirIdioma(idioma: string) {
  if (!idiomaValido(idioma)) return;
  cookies().set(COOKIE_IDIOMA, idioma, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  const usuario = await usuarioAtual();
  if (usuario && usuario.idioma !== idioma) await db.usuario.update({ where: { id: usuario.id }, data: { idioma } });
  revalidatePath("/", "layout");
}
