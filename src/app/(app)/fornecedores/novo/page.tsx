import { exigirAdmin } from "@/lib/auth";
import { Cabecalho, Voltar } from "@/components/ui";
import { Formulario } from "@/components/Formulario";
import { CamposFornecedor } from "@/components/CamposFornecedor";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { salvarFornecedor } from "../actions";

export default async function NovoFornecedor({ searchParams }: { searchParams: { tipo?: string } }) {
  await exigirAdmin();
  const sub = searchParams.tipo === "SUBCONTRATADO";
  return (
    <>
      <Voltar href={sub ? "/subcontratados" : "/fornecedores"} rotulo={sub ? "Subcontratados" : "Fornecedores"} />
      <Cabecalho titulo={sub ? "Novo subcontratado" : "Novo fornecedor"} />
      <div className="cartao">
        <Formulario acao={salvarFornecedor.bind(null, null)}>
          <CamposFornecedor tipoInicial={sub ? "SUBCONTRATADO" : "FORNECEDOR"} />
          <BotaoEnviar>Salvar</BotaoEnviar>
        </Formulario>
      </div>
    </>
  );
}
