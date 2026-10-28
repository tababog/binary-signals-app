import Link from "next/link";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { data, dinheiro } from "@/lib/format";
import { descreverSubservicos, nomeTipoServico } from "@/lib/constantes";
import { rateioCustosFixos } from "@/lib/custos-fixos";
import { STATUS_ORCAMENTO, calcularOpcao } from "@/lib/orcamento";
import { META_MULTIPLICADOR } from "@/lib/precos";
import { Cabecalho, Vazio } from "@/components/ui";
import { getT } from "@/i18n/servidor";

const CORES: Record<string, string> = {
  RASCUNHO: "bg-stone-200 text-stone-700",
  ENVIADO: "bg-sky-100 text-sky-800",
  APROVADO: "bg-emerald-100 text-emerald-800",
  RECUSADO: "bg-red-100 text-red-800",
};

export default async function Orcamentos({ searchParams }: { searchParams: { status?: string } }) {
  await exigirAdmin();
  const t = getT();
  const status = searchParams.status && searchParams.status in STATUS_ORCAMENTO ? searchParams.status : undefined;
  const [orcamentos, rateio] = await Promise.all([
    db.orcamento.findMany({
      where: status ? { status } : undefined,
      include: { cliente: true, opcoes: { include: { itens: true }, orderBy: { ordem: "asc" } } },
      orderBy: { atualizadoEm: "desc" },
    }),
    rateioCustosFixos(),
  ]);

  return (
    <>
      <Cabecalho titulo={t("Orçamentos")} subtitulo={t("Duas opções para cada cliente, com custo, preço e a meta de 2x")}>
        <Link href="/orcamentos/novo" className="botao">{t("+ Novo orçamento")}</Link>
      </Cabecalho>

      <div className="-mx-4 mb-4 overflow-x-auto px-4">
        <div className="flex w-max gap-2 text-sm">
          <Link href="/orcamentos" className={`rounded-full px-3 py-1 ${!status ? "bg-stone-800 text-white" : "bg-white"}`}>{t("Todos")}</Link>
          {Object.entries(STATUS_ORCAMENTO).map(([k, v]) => (
            <Link key={k} href={`/orcamentos?status=${k}`} className={`rounded-full px-3 py-1 ${status === k ? "bg-stone-800 text-white" : "bg-white"}`}>{t(v)}</Link>
          ))}
        </div>
      </div>

      {orcamentos.length === 0 ? (
        <div className="cartao"><Vazio>{t("Nenhum orçamento. Monte o primeiro a partir de uma visita ou em \"+ Novo orçamento\".")}</Vazio></div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {orcamentos.map((o) => (
            <Link key={o.id} href={`/orcamentos/${o.id}`} className="cartao block hover:border-marca-500">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-semibold">{o.cliente.nome}</div>
                  <div className="text-sm text-stone-500">
                    {o.tipoServico ? t(nomeTipoServico(o.tipoServico)) : "—"}
                    {o.subServicos && ` (${descreverSubservicos(o.tipoServico, o.subServicos, t)})`}
                    {o.cidade && ` · ${o.cidade}`}
                  </div>
                </div>
                <span className={`selo ${CORES[o.status] ?? ""}`}>{t((STATUS_ORCAMENTO as Record<string, string>)[o.status] ?? o.status)}</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                {o.opcoes.map((op) => {
                  const c = calcularOpcao(op, rateio.porDiaPadrao);
                  const abaixo = c.multiplicador !== null && c.multiplicador < META_MULTIPLICADOR;
                  return (
                    <div key={op.id} className="rounded-lg bg-stone-50 p-2">
                      <div className="text-xs text-stone-500">{op.nome}</div>
                      <div className="font-semibold tabular-nums">{c.custoTotal > 0 ? dinheiro(c.preco) : "—"}</div>
                      {c.multiplicador !== null && (
                        <div className={`text-xs tabular-nums ${abaixo ? "text-red-700" : "text-emerald-700"}`}>{c.multiplicador.toFixed(2)}x{abaixo && " ⚠"}</div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-2 text-xs text-stone-400">{t("Atualizado em {data}", { data: data(o.atualizadoEm) })}</div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
