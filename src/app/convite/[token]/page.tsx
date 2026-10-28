import Link from "next/link";
import { usuarioDoConvite } from "@/lib/convite";
import { Formulario } from "@/components/Formulario";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { criarSenhaPeloConvite } from "./actions";

export const metadata = { title: "Criar senha — Tababog Obras" };

export default async function Convite({ params }: { params: { token: string } }) {
  const usuario = await usuarioDoConvite(params.token);

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="cartao w-full max-w-sm space-y-4">
        <div className="text-center">
          <img src="/icon.svg" alt="" className="mx-auto mb-2 h-14 w-14" />
          <h1>Tababog Obras</h1>
        </div>
        {!usuario ? (
          <div className="space-y-3 text-center text-sm">
            <p>Este link expirou ou já foi usado.</p>
            <p className="text-stone-500">Peça um novo link ao administrador.</p>
            <Link href="/login" className="link">Ir para o login</Link>
          </div>
        ) : (
          <Formulario acao={criarSenhaPeloConvite.bind(null, params.token)}>
            <p className="text-center text-sm">
              Olá, <b>{usuario.nome.split(" ")[0]}</b>! Crie a sua senha para entrar no app.
            </p>
            <p className="rounded-lg bg-stone-100 p-2 text-center text-sm">
              Seu login: <b>{usuario.email}</b>
            </p>
            <label className="block">
              <span className="rotulo">Nova senha (mínimo 6 caracteres)</span>
              <input className="campo" name="senha" type="password" autoComplete="new-password" minLength={6} required />
            </label>
            <label className="block">
              <span className="rotulo">Repita a senha</span>
              <input className="campo" name="confirmacao" type="password" autoComplete="new-password" minLength={6} required />
            </label>
            <BotaoEnviar className="botao w-full">Criar senha e entrar</BotaoEnviar>
          </Formulario>
        )}
      </div>
    </main>
  );
}
