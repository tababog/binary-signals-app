"use client";

import { useFormStatus } from "react-dom";

export function BotaoEnviar({ children, className = "botao", confirmar }: { children: React.ReactNode; className?: string; confirmar?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      className={className}
      disabled={pending}
      onClick={(e) => {
        if (confirmar && !window.confirm(confirmar)) e.preventDefault();
      }}
    >
      {pending ? "Salvando..." : children}
    </button>
  );
}
