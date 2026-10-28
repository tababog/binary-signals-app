import Link from "next/link";
import { usuarioDoConvite } from "@/lib/convite";
import { Formulario } from "@/components/Formulario";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { criarSenhaPeloConvite } from "./actions";
import { getT } from "@/i18n/servidor";
import { SeletorIdioma } from "@/components/SeletorIdioma";

export const metadata = { title: "Criar senha — Tababog Obras" };

export default async function Convite({ params }: { params: { token: string } }) {
  const usuario = await usuarioDoConvite(params.token);
  const t = getT();

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="cartao w-full max-w-sm space-y-4">
        <div className="flex justify-end">
          <SeletorIdioma />
        </div>
        <div className="text-center">
          <img src="/logo.svg" alt="Tababog Construction LLC" className="mx-auto mb-3 h-32 w-32" />
          <h1>Tababog Obras</h1>
        </div>
        {!usuario ? (
          <div className="space-y-3 text-center text-sm">
            <p>{t("Este link expirou ou já foi usado.")}</p>
            <p className="text-stone-500">{t("Peça um novo link ao administrador.")}</p>
            <Link href="/login" className="link">{t("Ir para o login")}</Link>
          </div>
        ) : (
          <Formulario acao={criarSenhaPeloConvite.bind(null, params.token)}>
            <p className="text-center text-sm">
              {t("Olá, {nome}! Crie a sua senha para entrar no app.", { nome: usuario.nome.split(" ")[0] })}
            </p>
            <p className="rounded-lg bg-stone-100 p-2 text-center text-sm">
              {t("Seu login:")} <b>{usuario.email ?? usuario.telefone}</b>
            </p>
            <label className="block">
              <span className="rotulo">{t("Nova senha (mínimo 6 caracteres)")}</span>
              <input className="campo" name="senha" type="password" autoComplete="new-password" minLength={6} required />
            </label>
            <label className="block">
              <span className="rotulo">{t("Repita a senha")}</span>
              <input className="campo" name="confirmacao" type="password" autoComplete="new-password" minLength={6} required />
            </label>
            <BotaoEnviar className="botao w-full">{t("Criar senha e entrar")}</BotaoEnviar>
          </Formulario>
        )}
      </div>
    </main>
  );
}
