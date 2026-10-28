import { cookies } from "next/headers";
import { COOKIE_IDIOMA, idiomaValido, interpolar, type Idioma, type Variaveis } from "./idiomas";
import en from "./en";
import es from "./es";

/** Textos das telas: a chave é a frase em português; os dicionários trazem inglês e espanhol. */
export const DICIONARIOS: Record<Idioma, Record<string, string>> = { pt: {}, en, es };

/** Idioma escolhido (cookie). Fora de uma requisição (scripts, testes) usa português. */
export function idiomaAtual(): Idioma {
  try {
    const v = cookies().get(COOKIE_IDIOMA)?.value;
    return idiomaValido(v) ? v : "pt";
  } catch {
    return "pt";
  }
}

export type T = (texto: string, vars?: Variaveis) => string;

export function getT(idioma: Idioma = idiomaAtual()): T {
  const dic = DICIONARIOS[idioma];
  return (texto, vars) => interpolar(dic[texto] ?? texto, vars);
}
