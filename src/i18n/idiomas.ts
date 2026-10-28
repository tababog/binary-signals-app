export const IDIOMAS = ["pt", "en", "es"] as const;
export type Idioma = (typeof IDIOMAS)[number];

export const BANDEIRAS: Record<Idioma, { bandeira: string; nome: string; locale: string }> = {
  pt: { bandeira: "🇧🇷", nome: "Português", locale: "pt-BR" },
  en: { bandeira: "🇺🇸", nome: "English", locale: "en-US" },
  es: { bandeira: "🇪🇸", nome: "Español", locale: "es-US" },
};

export const COOKIE_IDIOMA = "tababog_idioma";

export function idiomaValido(v: unknown): v is Idioma {
  return typeof v === "string" && (IDIOMAS as readonly string[]).includes(v);
}

export type Variaveis = Record<string, string | number>;

/** Troca {nome} pelos valores informados. */
export function interpolar(texto: string, vars?: Variaveis) {
  if (!vars) return texto;
  return texto.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}
