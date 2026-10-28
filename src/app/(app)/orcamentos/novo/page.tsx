import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { Cabecalho, Voltar } from "@/components/ui";
import { Formulario } from "@/components/Formulario";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { CamposOrcamento } from "@/components/CamposOrcamento";
import { criarOrcamento } from "../actions";
import { getT } from "@/i18n/servidor";

export default async function NovoOrcamento({ searchParams }: { searchParams: { visita?: string; cliente?: string } }) {
  await exigirAdmin();
  const t = getT();
  const [clientes, personalizados, visita] = await Promise.all([
    db.cliente.findMany({ orderBy: { nome: "asc" }, select: { id: true, nome: true, endereco: true } }),
    db.servicoPersonalizado.findMany({ orderBy: { nome: "asc" } }),
    searchParams.visita ? db.visita.findUnique({ where: { id: searchParams.visita } }) : null,
  ]);

  return (
    <>
      <Voltar href={visita ? `/visitas/${visita.id}` : "/orcamentos"} rotulo={visita ? t("Visita") : t("Orçamentos")} />
      <Cabecalho
        titulo={t("Novo orçamento")}
        subtitulo={t("Primeiro os dados do trabalho. Depois você monta as duas opções (Essential e Premium) com itens e preços.")}
      />
      <div className="cartao max-w-3xl">
        <Formulario acao={criarOrcamento}>
          <CamposOrcamento
            clientes={clientes}
            personalizados={personalizados.map((p) => p.nome)}
            valor={
              visita
                ? { clienteId: visita.clienteId, visitaId: visita.id, tipoServico: visita.tipoServico, subServicos: visita.subServicos, descricao: visita.descricao, endereco: visita.endereco }
                : { clienteId: searchParams.cliente }
            }
          />
          <BotaoEnviar>{t("Criar orçamento")}</BotaoEnviar>
        </Formulario>
      </div>
    </>
  );
}
