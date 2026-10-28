"use client";

import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";

export type EstadoForm = { erro?: string; ok?: string } | undefined;

/** Formulário que mostra a mensagem de erro (ou de sucesso) devolvida pela ação do servidor. */
export function Formulario({
  acao,
  children,
  className = "space-y-4",
  limparAoSalvar,
}: {
  acao: (estado: EstadoForm, form: FormData) => Promise<EstadoForm>;
  children: React.ReactNode;
  className?: string;
  /** Esvazia o formulário depois de salvar sem erro (ex.: envio de fotos). */
  limparAoSalvar?: boolean;
}) {
  const [estado, despachar] = useFormState(acao, undefined);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (limparAoSalvar && estado && !estado.erro) form.current?.reset();
  }, [estado, limparAoSalvar]);
  return (
    <form ref={form} action={despachar} className={className}>
      {children}
      {estado?.erro && <p className="rounded-lg bg-red-50 p-2 text-sm text-red-700">{estado.erro}</p>}
      {estado?.ok && <p className="rounded-lg bg-emerald-50 p-2 text-sm text-emerald-800">{estado.ok}</p>}
    </form>
  );
}
