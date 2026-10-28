"use client";

import { useFormStatus } from "react-dom";
import { useT } from "@/i18n/cliente";

export function BotaoEnviar({ children, className = "botao", confirmar }: { children: React.ReactNode; className?: string; confirmar?: string }) {
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
      {pending ? t("Salvando...") : children}
    </button>
  );
}
