"use client";

import { useEffect } from "react";
import { useT } from "@/i18n/cliente";

const CHAVE = "tababog-recarregou-em";

/**
 * Quando uma tela quebra no celular. O caso mais comum é o app aberto com a versão anterior logo depois de uma
 * atualização (os arquivos antigos não existem mais): recarrega sozinho uma vez. Se quebrar de novo em menos de
 * 1 minuto, mostra o aviso com os botões em vez da tela branca.
 */
export function TelaDeErro({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useT();

  useEffect(() => {
    console.error(error);
    try {
      const antes = Number(sessionStorage.getItem(CHAVE) ?? 0);
      if (Date.now() - antes > 60_000) {
        sessionStorage.setItem(CHAVE, String(Date.now()));
        window.location.reload();
      }
    } catch {
      // Sem sessionStorage (navegação privada): fica no aviso
    }
  }, [error]);

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <h1 className="mb-2 text-xl font-bold">{t("Algo deu errado nesta tela")}</h1>
      <p className="mb-6 text-sm text-stone-600">{t("Pode ser o app aberto com a versão anterior depois de uma atualização. Recarregue para continuar.")}</p>
      <div className="flex flex-col gap-2">
        <button type="button" className="botao" onClick={() => window.location.reload()}>
          {t("Recarregar")}
        </button>
        <button type="button" className="botao-secundario" onClick={() => reset()}>
          {t("Tentar de novo")}
        </button>
        <a href="/" className="link text-sm">
          {t("Voltar ao início")}
        </a>
      </div>
      {error.digest && <p className="mt-6 text-xs text-stone-400">{error.digest}</p>}
    </div>
  );
}
