import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { campoData } from "@/lib/format";
import { rateioCustosFixos } from "@/lib/custos-fixos";
import { Cabecalho, Voltar } from "@/components/ui";
import { Formulario } from "@/components/Formulario";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { CamposTrabalho } from "@/components/CamposTrabalho";
import { excluirTrabalho, salvarTrabalho } from "../actions";
import { getT } from "@/i18n/servidor";

export default async function Trabalho({ params }: { params: { id: string } }) {
  await exigirAdmin();
  const t = getT();
  const [trabalho, personalizados, rateio] = await Promise.all([
    db.trabalhoReferencia.findUnique({ where: { id: params.id }, include: { obra: { select: { id: true, nome: true } } } }),
    db.servicoPersonalizado.findMany({ orderBy: { nome: "asc" } }),
    rateioCustosFixos(),
  ]);
  if (!trabalho) notFound();

  return (
    <>
      <Voltar href="/precos" rotulo={t("Banco de preços")} />
      <Cabecalho
        titulo={trabalho.descricao}
        subtitulo={trabalho.obra ? <Link href={`/obras/${trabalho.obra.id}`} className="link">{t("Obra: {nome}", { nome: trabalho.obra.nome })}</Link> : t("Trabalho antigo")}
      />
      <div className="cartao max-w-3xl">
        <Formulario acao={salvarTrabalho.bind(null, trabalho.id, trabalho.obraId)}>
          <CamposTrabalho
            valor={{ ...trabalho, data: campoData(trabalho.data) }}
            personalizados={personalizados.map((p) => p.nome)}
            custoFixoPorDia={rateio.porDiaPadrao}
          />
          <BotaoEnviar>{t("Salvar alterações")}</BotaoEnviar>
        </Formulario>
      </div>
      <form action={excluirTrabalho.bind(null, trabalho.id)} className="mt-6">
        <BotaoEnviar className="botao-perigo" confirmar={t("Excluir este trabalho do banco de preços?")}>{t("Excluir trabalho")}</BotaoEnviar>
      </form>
    </>
  );
}
