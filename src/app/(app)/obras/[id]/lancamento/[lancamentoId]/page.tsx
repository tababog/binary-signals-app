import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { campoData, centavosParaCampo, data, dinheiro } from "@/lib/format";
import { CATEGORIAS_DESPESA, FORMAS_PAGAMENTO } from "@/lib/constantes";
import { Cabecalho, Campo, Voltar } from "@/components/ui";
import { Formulario } from "@/components/Formulario";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { FotoRecibo } from "@/components/FotoRecibo";
import { CampoFornecedor } from "@/components/CampoFornecedor";
import { editarLancamento, excluirLancamento } from "../../../actions";
import { getT } from "@/i18n/servidor";

/** Editar ou excluir um lançamento do caixa da obra (ex.: mão de obra lançada duas vezes). Só administradores. */
export default async function EditarLancamento({ params }: { params: { id: string; lancamentoId: string } }) {
  await exigirAdmin();
  const t = getT();
  const [lanc, fornecedores] = await Promise.all([
    db.lancamento.findFirst({ where: { id: params.lancamentoId, obraId: params.id }, include: { obra: true, criadoPor: { select: { nome: true } } } }),
    db.fornecedor.findMany({ orderBy: { nome: "asc" }, select: { id: true, nome: true, tipo: true } }),
  ]);
  if (!lanc) notFound();
  const despesa = lanc.tipo === "SAIDA";
  // Forma de pagamento antiga que não está mais na lista continua aparecendo
  const formas = lanc.formaPagamento && !FORMAS_PAGAMENTO.includes(lanc.formaPagamento) ? [...FORMAS_PAGAMENTO, lanc.formaPagamento] : FORMAS_PAGAMENTO;

  return (
    <>
      <Voltar href={`/obras/${lanc.obraId}?aba=caixa`} rotulo={lanc.obra.nome} />
      <Cabecalho
        titulo={despesa ? t("Editar despesa") : t("Editar pagamento do cliente")}
        subtitulo={t("Lançado por {nome} em {data} · {valor}", { nome: lanc.criadoPor.nome, data: data(lanc.criadoEm), valor: dinheiro(lanc.valorCent) })}
      />
      <div className="cartao max-w-2xl">
        <Formulario acao={editarLancamento.bind(null, lanc.id)}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo rotulo={despesa ? t("Valor total *") : t("Valor recebido *")}>
              <input className="campo text-lg" name="valor" inputMode="decimal" defaultValue={centavosParaCampo(lanc.valorCent)} required />
            </Campo>
            <Campo rotulo={t("Data")}>
              <input className="campo" name="data" type="date" defaultValue={campoData(lanc.data)} />
            </Campo>
            {despesa && (
              <>
                <Campo rotulo={t("Categoria")}>
                  <select className="campo" name="categoria" defaultValue={lanc.categoria}>
                    {Object.entries(CATEGORIAS_DESPESA).map(([k, v]) => (
                      <option key={k} value={k}>{t(v)}</option>
                    ))}
                  </select>
                </Campo>
                <CampoFornecedor fornecedores={fornecedores} inicial={lanc.fornecedorId} />
              </>
            )}
            <div className="sm:col-span-2">
              <Campo rotulo={despesa ? t("O que foi comprado *") : t("Descrição")}>
                <input className="campo" name="descricao" defaultValue={lanc.descricao} required={despesa} />
              </Campo>
            </div>
            <Campo rotulo={t("Forma de pagamento")}>
              <select className="campo" name="formaPagamento" defaultValue={lanc.formaPagamento ?? ""}>
                <option value="">—</option>
                {formas.map((f) => <option key={f} value={f}>{t(f)}</option>)}
              </select>
            </Campo>
          </div>

          <div className="space-y-2 rounded-lg bg-stone-50 p-3">
            {lanc.comprovante ? (
              <>
                <p className="text-sm">
                  <a href={`/api/comprovantes/${lanc.comprovante}`} target="_blank" className="link">{t("Ver a foto do recibo salva")}</a>
                </p>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="tirarFoto" className="h-5 w-5" />
                  {t("Tirar a foto deste lançamento")}
                </label>
              </>
            ) : (
              <p className="text-sm text-stone-600">{t("Este lançamento não tem foto do recibo.")}</p>
            )}
            <FotoRecibo rotulo={lanc.comprovante ? t("Trocar a foto (opcional)") : t("Colocar a foto do recibo (opcional)")} />
          </div>

          <BotaoEnviar>{t("Salvar alterações")}</BotaoEnviar>
        </Formulario>
      </div>

      <div className="cartao mt-4 max-w-2xl border-red-200">
        <h2 className="mb-1">{t("Excluir lançamento")}</h2>
        <p className="mb-3 text-sm text-stone-600">{t("Use quando o lançamento foi feito por engano ou em duplicidade. O valor sai do caixa da obra.")}</p>
        <form action={excluirLancamento.bind(null, lanc.id, true)}>
          <BotaoEnviar className="botao w-full bg-red-600 hover:bg-red-700" confirmar={t("Excluir este lançamento?")}>{t("Excluir")}</BotaoEnviar>
        </form>
      </div>
    </>
  );
}
