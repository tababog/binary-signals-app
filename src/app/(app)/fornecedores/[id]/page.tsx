import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { data, dinheiro } from "@/lib/format";
import { Cabecalho, Vazio, Voltar } from "@/components/ui";
import { Formulario } from "@/components/Formulario";
import { CamposFornecedor } from "@/components/CamposFornecedor";
import { SeloSeguro } from "@/components/SeloSeguro";
import { TextoUsuario } from "@/components/TextoUsuario";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { excluirFornecedor, salvarFornecedor } from "../actions";
import { getT } from "@/i18n/servidor";

export default async function Fornecedor({ params }: { params: { id: string } }) {
  await exigirAdmin();
  const fornecedor = await db.fornecedor.findUnique({
    where: { id: params.id },
    include: { lancamentos: { include: { obra: true }, orderBy: { data: "desc" }, take: 50 } },
  });
  if (!fornecedor) notFound();
  const sub = fornecedor.tipo === "SUBCONTRATADO";
  const t = getT();
  const total = await db.lancamento.aggregate({ where: { fornecedorId: fornecedor.id, tipo: "SAIDA" }, _sum: { valorCent: true } });

  return (
    <>
      <Voltar href={sub ? "/subcontratados" : "/fornecedores"} rotulo={sub ? t("Subcontratados") : t("Fornecedores")} />
      <Cabecalho
        titulo={fornecedor.nome}
        subtitulo={
          <span className="flex flex-wrap items-center gap-2">
            {sub ? t("Subcontratado") : t("Fornecedor")}
            {fornecedor.categoria && ` · ${fornecedor.categoria}`} · {sub ? t("Total pago") : t("Total comprado")}: {dinheiro(total._sum.valorCent ?? 0)}
            {sub && <SeloSeguro validade={fornecedor.seguroValidade} />}
          </span>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="cartao">
          <h2 className="mb-3">{t("Dados")}</h2>
          <Formulario acao={salvarFornecedor.bind(null, fornecedor.id)}>
            <CamposFornecedor valor={fornecedor} />
            <BotaoEnviar>{t("Salvar alterações")}</BotaoEnviar>
          </Formulario>
        </div>

        <div className="space-y-4">
          <div className="cartao overflow-x-auto">
            <h2 className="mb-3">{sub ? t("Últimos pagamentos") : t("Últimas compras")}</h2>
            {fornecedor.lancamentos.length === 0 ? (
              <Vazio>{sub ? t("Nenhum pagamento registrado.") : t("Nenhuma compra registrada.")}</Vazio>
            ) : (
              <table className="tabela">
                <thead><tr><th>{t("Data")}</th><th>{t("Obra")}</th><th>{t("Descrição")}</th><th className="text-right">{t("Valor")}</th></tr></thead>
                <tbody>
                  {fornecedor.lancamentos.map((l) => (
                    <tr key={l.id}>
                      <td>{data(l.data)}</td>
                      <td><Link href={`/obras/${l.obraId}`} className="link">{l.obra.nome}</Link></td>
                      <td><TextoUsuario texto={l.descricao} /></td>
                      <td className="text-right tabular-nums">{dinheiro(l.valorCent)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <form action={excluirFornecedor.bind(null, fornecedor.id)}>
            <BotaoEnviar className="botao-perigo" confirmar={t("Excluir este cadastro? Os lançamentos continuam nas obras, sem o vínculo.")}>
              {t("Excluir cadastro")}
            </BotaoEnviar>
          </form>
        </div>
      </div>
    </>
  );
}
