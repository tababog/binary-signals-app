"use client";

import { useFormState } from "react-dom";

export type EstadoForm = { erro?: string } | undefined;

/** Formulário que mostra a mensagem de erro devolvida pela ação do servidor. */
export function Formulario({
  acao,
  children,
  className = "space-y-4",
}: {
  acao: (estado: EstadoForm, form: FormData) => Promise<EstadoForm>;
  children: React.ReactNode;
  className?: string;
}) {
  const [estado, despachar] = useFormState(acao, undefined);
  return (
    <form action={despachar} className={className}>
      {children}
      {estado?.erro && <p className="rounded-lg bg-red-50 p-2 text-sm text-red-700">{estado.erro}</p>}
    </form>
  );
}
