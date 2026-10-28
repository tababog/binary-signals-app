import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { campoData } from "@/lib/format";
import { FORMAS_PAGAMENTO } from "@/lib/constantes";
import { Cabecalho, Campo, Voltar } from "@/components/ui";
import { Formulario } from "@/components/Formulario";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { FotoRecibo } from "@/components/FotoRecibo";
import { lancarRecebimento } from "../../actions";
import { getT } from "@/i18n/servidor";

export default async function NovoRecebimento({ params }: { params: { id: string } }) {
  await exigirAdmin();
  const t = getT();
  const obra = await db.obra.findUnique({ where: { id: params.id }, include: { cliente: true } });
  if (!obra) notFound();

  return (
    <>
      <Voltar href={`/obras/${obra.id}?aba=caixa`} rotulo={obra.nome} />
      <Cabecalho titulo={t("Registrar pagamento do cliente")} subtitulo={t("{cliente} — entra no caixa desta obra", { cliente: obra.cliente.nome })} />
      <div className="cartao max-w-2xl">
        <Formulario acao={lancarRecebimento.bind(null, obra.id)}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo rotulo={t("Valor recebido *")}>
              <input className="campo text-lg" name="valor" inputMode="decimal" placeholder="0.00" required />
            </Campo>
            <Campo rotulo={t("Data")}>
              <input className="campo" name="data" type="date" defaultValue={campoData(new Date())} />
            </Campo>
            <Campo rotulo={t("Forma de pagamento")}>
              <select className="campo" name="formaPagamento" defaultValue="Pix">
                {FORMAS_PAGAMENTO.map((f) => <option key={f} value={f}>{t(f)}</option>)}
              </select>
            </Campo>
            <Campo rotulo={t("Descrição")}>
              <input className="campo" name="descricao" placeholder={t("Ex.: Entrada, 2ª parcela...")} />
            </Campo>
          </div>
          <FotoRecibo rotulo={t("Comprovante (opcional)")} />
          <BotaoEnviar>{t("Salvar recebimento")}</BotaoEnviar>
        </Formulario>
      </div>
    </>
  );
}
