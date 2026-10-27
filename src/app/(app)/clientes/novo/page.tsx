import { exigirAdmin } from "@/lib/auth";
import { Cabecalho, Voltar } from "@/components/ui";
import { Formulario } from "@/components/Formulario";
import { CamposContato } from "@/components/CamposContato";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { salvarCliente } from "../actions";

export default async function NovoCliente() {
  await exigirAdmin();
  return (
    <>
      <Voltar href="/clientes" rotulo="Clientes" />
      <Cabecalho titulo="Novo cliente" />
      <div className="cartao">
        <Formulario acao={salvarCliente.bind(null, null)}>
          <CamposContato />
          <BotaoEnviar>Salvar cliente</BotaoEnviar>
        </Formulario>
      </div>
    </>
  );
}
