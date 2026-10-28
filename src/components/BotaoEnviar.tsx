"use client";

import { useFormStatus } from "react-dom";
import { useT } from "@/i18n/cliente";

/** Botão de envio: desabilita e mostra "Salvando..." (ou o texto de `aguardando`) enquanto a ação roda. */
export function BotaoEnviar({
  children,
  className = "botao",
  confirmar,
  aguardando,
}: {
  children: React.ReactNode;
  className?: string;
  confirmar?: string;
  aguardando?: string;
}) {
  const { pending } = useFormStatus();
  const t = useT();
  return (
    <button
      className={className}
      disabled={pending}
      onClick={(e) => {
        if (confirmar && !window.confirm(confirmar)) e.preventDefault();
      }}
    >
      {pending ? aguardando ?? t("Salvando...") : children}
    </button>
  );
}
