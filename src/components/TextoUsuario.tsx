import { idiomaAtual, getT } from "@/i18n/servidor";
import { traduzir } from "@/lib/traducao";

/**
 * Texto escrito por alguém no app, mostrado no idioma de quem está vendo.
 * Quando a tradução muda o texto, dá para abrir o original.
 */
export async function TextoUsuario({ texto }: { texto: string | null | undefined }) {
  if (!texto) return null;
  const idioma = idiomaAtual();
  const traduzido = await traduzir(texto, idioma);
  if (traduzido.trim() === texto.trim()) return <>{texto}</>;
  const t = getT(idioma);
  return (
    <>
      {traduzido}{" "}
      <details className="inline-block align-baseline text-xs text-stone-500">
        <summary className="cursor-pointer select-none">{t("ver original")}</summary>
        <span className="whitespace-pre-line">{texto}</span>
      </details>
    </>
  );
}
