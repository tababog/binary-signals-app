import { idiomaAtual, getT } from "@/i18n/servidor";
import { traduzir } from "@/lib/traducao";
import { VerOriginal } from "./VerOriginal";

/**
 * Texto escrito por alguém no app, mostrado no idioma de quem está vendo.
 * Quando a tradução muda o texto, dá para abrir o original.
 */
// Diferenças só de maiúsculas, acentos ou espaços não contam como tradução
const simples = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim();

export async function TextoUsuario({ texto }: { texto: string | null | undefined }) {
  if (!texto) return null;
  const idioma = idiomaAtual();
  const traduzido = await traduzir(texto, idioma);
  if (simples(traduzido) === simples(texto)) return <>{texto}</>;
  const t = getT(idioma);
  return (
    <>
      {traduzido}{" "}
      <VerOriginal texto={texto} rotulo={t("ver original")} />
    </>
  );
}
