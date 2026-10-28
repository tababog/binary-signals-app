import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { rateioCustosFixos } from "@/lib/custos-fixos";
import { referenciaDaObra } from "@/lib/referencia-obra";
import { Cabecalho, Voltar } from "@/components/ui";
import { Formulario } from "@/components/Formulario";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { CamposTrabalho } from "@/components/CamposTrabalho";
import { salvarTrabalho } from "../actions";
import { getT } from "@/i18n/servidor";

export default async function NovoTrabalho({ searchParams }: { searchParams: { obra?: string } }) {
  await exigirAdmin();
  const t = getT();
  const obra = searchParams.obra ? await db.obra.findUnique({ where: { id: searchParams.obra }, select: { id: true, nome: true } }) : null;
  if (searchParams.obra && !obra) notFound();
  const [personalizados, rateio, valor] = await Promise.all([
    db.servicoPersonalizado.findMany({ orderBy: { nome: "asc" } }),
    rateioCustosFixos(),
    obra ? referenciaDaObra(obra.id) : undefined,
  ]);

  return (
    <>
      <Voltar href={obra ? `/obras/${obra.id}` : "/precos"} rotulo={obra ? obra.nome : t("Banco de preços")} />
      <Cabecalho
        titulo={obra ? t("Levar obra para o banco de preços") : t("Cadastrar trabalho antigo")}
        subtitulo={
          obra
            ? t("Os custos já vêm da obra. Confira, escolha o serviço e informe a quantidade.")
            : t("Um trabalho já feito, com o que custou e quanto foi cobrado. Quanto mais trabalhos, melhor o preço sugerido.")
        }
      />
      <div className="cartao max-w-3xl">
        <Formulario acao={salvarTrabalho.bind(null, null, obra?.id ?? null)}>
          <CamposTrabalho valor={valor} personalizados={personalizados.map((p) => p.nome)} custoFixoPorDia={rateio.porDiaPadrao} />
          <BotaoEnviar>{t("Salvar no banco de preços")}</BotaoEnviar>
        </Formulario>
      </div>
    </>
  );
}
