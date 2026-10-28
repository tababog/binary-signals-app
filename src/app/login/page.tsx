"use client";

import { useFormState, useFormStatus } from "react-dom";
import { entrar } from "./actions";

function BotaoEntrar() {
  const { pending } = useFormStatus();
  return (
    <button className="botao w-full" disabled={pending}>
      {pending ? "Entrando..." : "Entrar"}
    </button>
  );
}

export default function PaginaLogin() {
  const [estado, acao] = useFormState(entrar, undefined);
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <form action={acao} className="cartao w-full max-w-sm space-y-4">
        <div className="text-center">
          <img src="/icon.svg" alt="" className="mx-auto mb-2 h-14 w-14" />
          <h1>Tababog Obras</h1>
          <p className="text-sm text-stone-500">Entre com seu e-mail ou telefone e a senha</p>
        </div>
        <div>
          <label className="rotulo" htmlFor="email">E-mail ou telefone</label>
          <input className="campo" id="email" name="email" type="text" autoComplete="username" autoCapitalize="none" required />
        </div>
        <div>
          <label className="rotulo" htmlFor="senha">Senha</label>
          <input className="campo" id="senha" name="senha" type="password" autoComplete="current-password" required />
        </div>
        {estado?.erro && <p className="text-sm text-red-600">{estado.erro}</p>}
        <BotaoEntrar />
      </form>
    </main>
  );
}
