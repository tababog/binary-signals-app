import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { campoData, data } from "@/lib/format";
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

export default async function NovaDespesa({ params, searchParams }: { params: { id: string }; searchParams: { recibo?: string } }) {
  await exigirAdmin();
  const t = getT();
  const [obra, fornecedores, recibo] = await Promise.all([
    db.obra.findUnique({ where: { id: params.id } }),
    db.fornecedor.findMany({ orderBy: { nome: "asc" }, select: { id: true, nome: true, tipo: true } }),
    // Recibo que um funcionário mandou (Painel → Recibos da equipe para lançar)
    searchParams.recibo ? db.reciboFuncionario.findFirst({ where: { id: searchParams.recibo, lancadoEm: null }, include: { usuario: { select: { nome: true } } } }) : null,
  ]);
  if (!obra) notFound();

  return (
    <>
      <Voltar href={`/obras/${obra.id}?aba=caixa`} rotulo={obra.nome} />
      <Cabecalho titulo={t("Lançar despesa")} subtitulo={t("A despesa entra direto no caixa desta obra")} />
      <div className="cartao max-w-2xl">
        <Formulario acao={lancarDespesa.bind(null, obra.id)}>
          {recibo && (
            <p className="rounded-lg bg-amber-50 p-2 text-sm text-amber-900">
              {t("Recibo enviado por {nome} em {data}.", { nome: recibo.usuario.nome, data: data(recibo.criadoEm) })}
              {recibo.pagoDoBolso && <b> {t("Pagou com o dinheiro dele: precisa de reembolso.")}</b>}
            </p>
          )}
          <FotoRecibo
            rotulo={t("Foto do recibo / nota fiscal: o app lê e preenche os campos")}
            ler="DESPESA"
            salvo={recibo ? { id: recibo.id, arquivo: recibo.arquivo } : undefined}
          />
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
                <input className="campo" name="descricao" placeholder={t("Ex.: 20 sacos de cimento CP-II")} defaultValue={recibo?.descricao ?? ""} required />
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
