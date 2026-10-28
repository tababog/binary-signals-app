import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { Cabecalho, Voltar } from "@/components/ui";
import { Formulario } from "@/components/Formulario";
import { CamposObra } from "@/components/CamposObra";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { excluirObra, salvarObra } from "../../actions";
import { getT } from "@/i18n/servidor";

export default async function EditarObra({ params }: { params: { id: string } }) {
  await exigirAdmin();
  const t = getT();
  const [obra, clientes] = await Promise.all([
    db.obra.findUnique({ where: { id: params.id } }),
    db.cliente.findMany({ orderBy: { nome: "asc" }, select: { id: true, nome: true } }),
  ]);
  if (!obra) notFound();

  return (
    <>
      <Voltar href={`/obras/${obra.id}`} rotulo={obra.nome} />
      <Cabecalho titulo={t("Editar obra")} />
      <div className="cartao">
        <Formulario acao={salvarObra.bind(null, obra.id)}>
          <CamposObra valor={obra} clientes={clientes} />
          <BotaoEnviar>{t("Salvar alterações")}</BotaoEnviar>
        </Formulario>
      </div>
      <form action={excluirObra.bind(null, obra.id)} className="mt-6">
        <BotaoEnviar className="botao-perigo" confirmar={t("Excluir esta obra? Todo o orçamento, fluxo de caixa, recibos e horas dela serão apagados. Isso não pode ser desfeito.")}>
          {t("Excluir obra")}
        </BotaoEnviar>
      </form>
    </>
  );
}
