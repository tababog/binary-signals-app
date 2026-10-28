import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { campoData } from "@/lib/format";
import { CATEGORIAS_DESPESA, FORMAS_PAGAMENTO } from "@/lib/constantes";
import { Cabecalho, Campo, Voltar } from "@/components/ui";
import { Formulario } from "@/components/Formulario";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { FotoRecibo } from "@/components/FotoRecibo";
import { CampoFornecedor } from "@/components/CampoFornecedor";
import { lancarDespesa } from "../../actions";
import { getT } from "@/i18n/servidor";

// A leitura do comprovante pela IA (ação chamada desta página) leva de 10 a 30 segundos
export const maxDuration = 60;

export default async function NovaDespesa({ params }: { params: { id: string } }) {
  await exigirAdmin();
  const t = getT();
  const [obra, fornecedores] = await Promise.all([
    db.obra.findUnique({ where: { id: params.id } }),
    db.fornecedor.findMany({ orderBy: { nome: "asc" }, select: { id: true, nome: true, tipo: true } }),
  ]);
  if (!obra) notFound();

  return (
    <>
      <Voltar href={`/obras/${obra.id}?aba=caixa`} rotulo={obra.nome} />
      <Cabecalho titulo={t("Lançar despesa")} subtitulo={t("A despesa entra direto no caixa desta obra")} />
      <div className="cartao max-w-2xl">
        <Formulario acao={lancarDespesa.bind(null, obra.id)}>
          <FotoRecibo rotulo={t("Foto do recibo / nota fiscal: o app lê e preenche os campos")} ler="DESPESA" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo rotulo={t("Valor total *")}>
              <input className="campo text-lg" name="valor" inputMode="decimal" placeholder="0.00" required />
            </Campo>
            <Campo rotulo={t("Data da compra")}>
              <input className="campo" name="data" type="date" defaultValue={campoData(new Date())} />
            </Campo>
            <Campo rotulo={t("Categoria")}>
              <select className="campo" name="categoria" defaultValue="MATERIAL">
                {Object.entries(CATEGORIAS_DESPESA).map(([k, v]) => (
                  <option key={k} value={k}>{t(v)}</option>
                ))}
              </select>
            </Campo>
            <CampoFornecedor fornecedores={fornecedores} />
            <div className="sm:col-span-2">
              <Campo rotulo={t("O que foi comprado *")}>
                <input className="campo" name="descricao" placeholder={t("Ex.: 20 sacos de cimento CP-II")} required />
              </Campo>
            </div>
            <Campo rotulo={t("Forma de pagamento")}>
              <select className="campo" name="formaPagamento" defaultValue="">
                <option value="">—</option>
                {FORMAS_PAGAMENTO.map((f) => <option key={f} value={f}>{t(f)}</option>)}
              </select>
            </Campo>
          </div>
          <BotaoEnviar>{t("Salvar despesa")}</BotaoEnviar>
        </Formulario>
      </div>
    </>
  );
}
