import { exigirUsuario } from "@/lib/auth";
import { Cabecalho, Campo } from "@/components/ui";
import { Formulario } from "@/components/Formulario";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { trocarMinhaSenha } from "../funcionarios/actions";

export default async function Conta({ searchParams }: { searchParams: { ok?: string } }) {
  const usuario = await exigirUsuario();
  return (
    <>
      <Cabecalho titulo="Minha conta" subtitulo={`${usuario.nome} · ${usuario.email ?? usuario.telefone ?? ""}`} />
      <div className="cartao max-w-md">
        <h2 className="mb-3">Trocar senha</h2>
        {searchParams.ok && <p className="mb-3 rounded-lg bg-emerald-50 p-2 text-sm text-emerald-800">Senha alterada com sucesso.</p>}
        <Formulario acao={trocarMinhaSenha}>
          <Campo rotulo="Senha atual"><input className="campo" name="atual" type="password" required /></Campo>
          <Campo rotulo="Nova senha"><input className="campo" name="nova" type="password" minLength={6} required /></Campo>
          <Campo rotulo="Confirme a nova senha"><input className="campo" name="confirmacao" type="password" minLength={6} required /></Campo>
          <BotaoEnviar>Trocar senha</BotaoEnviar>
        </Formulario>
      </div>
    </>
  );
}
