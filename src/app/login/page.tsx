"use client";

import { useFormState, useFormStatus } from "react-dom";
import { entrar } from "./actions";
import { useT } from "@/i18n/cliente";
import { SeletorIdioma } from "@/components/SeletorIdioma";

function BotaoEntrar() {
  const { pending } = useFormStatus();
  const t = useT();
  return (
    <button className="botao w-full" disabled={pending}>
      {pending ? t("Entrando...") : t("Entrar")}
    </button>
  );
}

export default function PaginaLogin() {
  const [estado, acao] = useFormState(entrar, undefined);
  const t = useT();
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <form action={acao} className="cartao w-full max-w-sm space-y-4">
        <div className="flex justify-end">
          <SeletorIdioma />
        </div>
        <div className="text-center">
          <img src="/logo.svg" alt="Tababog Construction LLC" className="mx-auto mb-3 h-32 w-32" />
          <h1>Tababog Obras</h1>
          <p className="text-sm text-stone-500">{t("Entre com seu e-mail ou telefone e a senha")}</p>
        </div>
        <div>
          <label className="rotulo" htmlFor="email">{t("E-mail ou telefone")}</label>
          <input className="campo" id="email" name="email" type="text" autoComplete="username" autoCapitalize="none" required />
        </div>
        <div>
          <label className="rotulo" htmlFor="senha">{t("Senha")}</label>
          <input className="campo" id="senha" name="senha" type="password" autoComplete="current-password" required />
        </div>
        {estado?.erro && <p className="text-sm text-red-600">{estado.erro}</p>}
        <BotaoEntrar />
      </form>
    </main>
  );
}
