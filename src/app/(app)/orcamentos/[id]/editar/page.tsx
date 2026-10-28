import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { Cabecalho, Voltar } from "@/components/ui";
import { Formulario } from "@/components/Formulario";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { CamposOrcamento } from "@/components/CamposOrcamento";
import { excluirOrcamento, salvarDadosOrcamento } from "../../actions";
import { getT } from "@/i18n/servidor";

export default async function EditarOrcamento({ params }: { params: { id: string } }) {
  await exigirAdmin();
  const t = getT();
  const [orc, personalizados] = await Promise.all([
    db.orcamento.findUnique({ where: { id: params.id }, include: { cliente: true } }),
    db.servicoPersonalizado.findMany({ orderBy: { nome: "asc" } }),
  ]);
  if (!orc) notFound();

  return (
    <>
      <Voltar href={`/orcamentos/${orc.id}`} rotulo={t("Orçamento")} />
      <Cabecalho titulo={t("Dados do trabalho")} subtitulo={orc.cliente.nome} />
      <div className="cartao max-w-3xl">
        <Formulario acao={salvarDadosOrcamento.bind(null, orc.id)}>
          <CamposOrcamento clientes={[]} personalizados={personalizados.map((p) => p.nome)} valor={orc} comCliente={false} />
          <BotaoEnviar>{t("Salvar alterações")}</BotaoEnviar>
        </Formulario>
      </div>
      <form action={excluirOrcamento.bind(null, orc.id)} className="mt-6">
        <BotaoEnviar className="botao-perigo" confirmar={t("Excluir este orçamento e as duas opções?")}>{t("Excluir orçamento")}</BotaoEnviar>
      </form>
    </>
  );
}
