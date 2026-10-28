"use client";

import { createContext, useContext } from "react";
import { interpolar, type Idioma, type Variaveis } from "./idiomas";

const Contexto = createContext<{ idioma: Idioma; dicionario: Record<string, string> }>({ idioma: "pt", dicionario: {} });

/** Leva o idioma e o dicionário do servidor para os componentes que rodam no celular. */
export function IdiomaProvider({ idioma, dicionario, children }: { idioma: Idioma; dicionario: Record<string, string>; children: React.ReactNode }) {
  return <Contexto.Provider value={{ idioma, dicionario }}>{children}</Contexto.Provider>;
}

export function useT() {
  const { dicionario } = useContext(Contexto);
  return (texto: string, vars?: Variaveis) => interpolar(dicionario[texto] ?? texto, vars);
}

export function useIdioma() {
  return useContext(Contexto).idioma;
}
