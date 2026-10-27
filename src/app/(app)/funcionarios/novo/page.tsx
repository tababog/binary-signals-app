import { exigirAdmin } from "@/lib/auth";
import { Cabecalho, Voltar } from "@/components/ui";
import { Formulario } from "@/components/Formulario";
import { CamposFuncionario } from "@/components/CamposFuncionario";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { criarFuncionario } from "../actions";

export default async function NovoFuncionario() {
  await exigirAdmin();
  return (
    <>
      <Voltar href="/funcionarios" rotulo="Funcionários" />
      <Cabecalho titulo="Novo funcionário" subtitulo="Passe o e-mail e a senha inicial para o funcionário entrar no app" />
      <div className="cartao">
        <Formulario acao={criarFuncionario}>
          <CamposFuncionario novo />
          <BotaoEnviar>Cadastrar</BotaoEnviar>
        </Formulario>
      </div>
    </>
  );
}
