import { exigirAdmin } from "@/lib/auth";
import { Cabecalho, Voltar } from "@/components/ui";
import { Formulario } from "@/components/Formulario";
import { CamposFornecedor } from "@/components/CamposFornecedor";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { salvarFornecedor } from "../actions";
import { getT } from "@/i18n/servidor";

export default async function NovoFornecedor({ searchParams }: { searchParams: { tipo?: string } }) {
  await exigirAdmin();
  const sub = searchParams.tipo === "SUBCONTRATADO";
  const t = getT();
  return (
    <>
      <Voltar href={sub ? "/subcontratados" : "/fornecedores"} rotulo={sub ? t("Subcontratados") : t("Fornecedores")} />
      <Cabecalho titulo={sub ? t("Novo subcontratado") : t("Novo fornecedor")} />
      <div className="cartao">
        <Formulario acao={salvarFornecedor.bind(null, null)}>
          <CamposFornecedor tipoInicial={sub ? "SUBCONTRATADO" : "FORNECEDOR"} />
          <BotaoEnviar>{t("Salvar")}</BotaoEnviar>
        </Formulario>
      </div>
    </>
  );
}
