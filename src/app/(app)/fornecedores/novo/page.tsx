import { exigirAdmin } from "@/lib/auth";
import { Cabecalho, Campo, Voltar } from "@/components/ui";
import { Formulario } from "@/components/Formulario";
import { CamposContato } from "@/components/CamposContato";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { salvarFornecedor } from "../actions";

export default async function NovoFornecedor() {
  await exigirAdmin();
  return (
    <>
      <Voltar href="/fornecedores" rotulo="Fornecedores" />
      <Cabecalho titulo="Novo fornecedor" />
      <div className="cartao">
        <Formulario acao={salvarFornecedor.bind(null, null)}>
          <CamposContato rotuloDocumento="CNPJ / CPF" />
          <Campo rotulo="Categoria (ex.: cimento, elétrica, madeira)">
            <input className="campo" name="categoria" />
          </Campo>
          <BotaoEnviar>Salvar fornecedor</BotaoEnviar>
        </Formulario>
      </div>
    </>
  );
}
