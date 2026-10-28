import Link from "next/link";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { data, dinheiro } from "@/lib/format";
import { UNIDADES, descreverSubservicos, nomeTipoServico } from "@/lib/constantes";
import { rateioCustosFixos } from "@/lib/custos-fixos";
import { META_MULTIPLICADOR, abaixoDaMeta, analisarTrabalho, resumirPorServico } from "@/lib/precos";
import { Cabecalho, Vazio } from "@/components/ui";
import { TextoUsuario } from "@/components/TextoUsuario";
import { getT } from "@/i18n/servidor";

// A precificação muda bastante entre Fairfield County e o resto de Connecticut (regra 5)
const REGIOES = {
  TODAS: "Todo Connecticut",
  FAIRFIELD: "Fairfield County",
  RESTO: "Resto de CT",
} as const;

function Multiplicador({ valor }: { valor: number | null }) {
  if (valor === null) return <span className="selo bg-stone-100 text-stone-600">—</span>;
  const ok = valor >= META_MULTIPLICADOR;
  return <span className={`selo tabular-nums ${ok ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>{valor.toFixed(2)}x</span>;
}

export default async function BancoDePrecos({ searchParams }: { searchParams: { servico?: string; regiao?: string; salvo?: string } }) {
  await exigirAdmin();
  const t = getT();
  const regiao = (searchParams.regiao ?? "TODAS") in REGIOES ? (searchParams.regiao ?? "TODAS") : "TODAS";
  const servico = searchParams.servico ?? "";

  const [todos, rateio, obrasSemReferencia] = await Promise.all([
    db.trabalhoReferencia.findMany({ orderBy: [{ data: "desc" }, { criadoEm: "desc" }] }),
    rateioCustosFixos(),
    db.obra.findMany({ where: { status: "CONCLUIDA", referencia: null }, select: { id: true, nome: true }, orderBy: { criadoEm: "desc" } }),
  ]);
  const naRegiao = todos.filter((x) =>
    regiao === "FAIRFIELD" ? x.condado === "Fairfield" : regiao === "RESTO" ? x.condado && x.condado !== "Fairfield" : true,
  );
  const trabalhos = servico ? naRegiao.filter((x) => x.tipoServico === servico) : naRegiao;
  const resumo = resumirPorServico(trabalhos, rateio.porDiaPadrao);
  const servicos = [...new Set(naRegiao.map((x) => x.tipoServico))];
  const unidade = (u: string) => t((UNIDADES as Record<string, string>)[u] ?? u);
  const link = (mudar: { servico?: string; regiao?: string }) => {
    const q = new URLSearchParams({ servico, regiao, ...mudar });
    if (!q.get("servico")) q.delete("servico");
    if (q.get("regiao") === "TODAS") q.delete("regiao");
    return `/precos${q.size ? `?${q}` : ""}`;
  };

  return (
    <>
      <Cabecalho titulo={t("Banco de preços")} subtitulo={t("Quanto custou e quanto foi cobrado em cada trabalho: a base para precificar os próximos")}>
        <Link href="/precos/novo" className="botao">{t("+ Cadastrar trabalho antigo")}</Link>
      </Cabecalho>

      {searchParams.salvo && <p className="mb-4 rounded-lg bg-emerald-50 p-2 text-sm text-emerald-800">{t("Trabalho salvo no banco de preços.")}</p>}

      {obrasSemReferencia.length > 0 && (
        <div className="cartao mb-4 border-amber-200 bg-amber-50">
          <h2 className="mb-1">{t("Obras concluídas fora do banco de preços")}</h2>
          <p className="mb-2 text-sm text-amber-900">{t("Cada obra concluída vira referência de preço. Confira os números e salve:")}</p>
          <div className="flex flex-wrap gap-2">
            {obrasSemReferencia.map((o) => (
              <Link key={o.id} href={`/precos/novo?obra=${o.id}`} className="botao-secundario px-3 py-1 text-sm">{o.nome} →</Link>
            ))}
          </div>
        </div>
      )}

      <div className="mb-3 -mx-4 overflow-x-auto px-4">
        <div className="flex w-max gap-2 text-sm">
          {Object.entries(REGIOES).map(([k, v]) => (
            <Link key={k} href={link({ regiao: k })} className={`rounded-full px-3 py-1 ${regiao === k ? "bg-stone-800 text-white" : "bg-white"}`}>{t(v)}</Link>
          ))}
        </div>
      </div>
      {servicos.length > 1 && (
        <div className="mb-4 -mx-4 overflow-x-auto px-4">
          <div className="flex w-max gap-2 text-sm">
            <Link href={link({ servico: "" })} className={`rounded-full px-3 py-1 ${!servico ? "bg-marca-600 text-white" : "bg-white"}`}>{t("Todos os serviços")}</Link>
            {servicos.map((s) => (
              <Link key={s} href={link({ servico: s })} className={`rounded-full px-3 py-1 ${servico === s ? "bg-marca-600 text-white" : "bg-white"}`}>{t(nomeTipoServico(s))}</Link>
            ))}
          </div>
        </div>
      )}

      {trabalhos.length === 0 ? (
        <div className="cartao">
          <Vazio>{t("Nenhum trabalho cadastrado. Comece pelos decks e gabinetes que vocês já fizeram.")}</Vazio>
        </div>
      ) : (
        <>
          <h2 className="mb-2">{t("Preço por serviço")}</h2>
          <div className="mb-6 grid gap-3 md:grid-cols-2">
            {resumo.map((r) => (
              <div key={`${r.tipo}|${r.subServicos}|${r.unidade}`} className="cartao">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">
                      {t(nomeTipoServico(r.tipo))}
                      {r.subServicos && <span className="font-normal text-stone-600"> · {descreverSubservicos(r.tipo, r.subServicos, t)}</span>}
                    </h3>
                    <p className="text-xs text-stone-500">
                      {t("{n} trabalho(s)", { n: r.trabalhos })}
                      {r.unidade !== "SERVICO" && ` · ${r.quantidade.toLocaleString("en-US")} ${unidade(r.unidade)}`}
                    </p>
                  </div>
                  <Multiplicador valor={r.multiplicador} />
                </div>
                {r.precoPorUnidade !== null ? (
                  <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                    <div>
                      <dt className="text-xs text-stone-500">{t("Cobrado por {unidade}", { unidade: unidade(r.unidade) })}</dt>
                      <dd className="font-semibold tabular-nums">{dinheiro(Math.round(r.precoPorUnidade))}</dd>
                      {r.faixaPreco && r.trabalhos > 1 && (
                        <dd className="text-xs text-stone-500 tabular-nums">{dinheiro(Math.round(r.faixaPreco.min))} – {dinheiro(Math.round(r.faixaPreco.max))}</dd>
                      )}
                    </div>
                    <div>
                      <dt className="text-xs text-stone-500">{t("Custo por {unidade}", { unidade: unidade(r.unidade) })}</dt>
                      <dd className="font-semibold tabular-nums">{dinheiro(Math.round(r.custoPorUnidade ?? 0))}</dd>
                      <dd className="text-xs text-stone-500">{t("material {valor}", { valor: dinheiro(Math.round(r.materialPorUnidade ?? 0)) })}</dd>
                    </div>
                    <div className="col-span-2 rounded-lg bg-stone-50 p-2">
                      <dt className="text-xs text-stone-500">{t("Preço mínimo para a meta 2x")}</dt>
                      <dd className="text-lg font-bold tabular-nums text-marca-700">
                        {t("{valor} por {unidade}", { valor: dinheiro(Math.round(r.precoMinimoPorUnidade ?? 0)), unidade: unidade(r.unidade) })}
                      </dd>
                    </div>
                  </dl>
                ) : (
                  <p className="text-sm">
                    {t("Média cobrada: {preco} · custo médio: {custo}", { preco: dinheiro(Math.round(r.precoTotal / r.trabalhos)), custo: dinheiro(Math.round(r.custoTotal / r.trabalhos)) })}
                  </p>
                )}
                {r.abaixoDaMeta > 0 && (
                  <p className="mt-2 text-xs text-red-700">{t("⚠ {n} de {total} abaixo de 2x", { n: r.abaixoDaMeta, total: r.trabalhos })}</p>
                )}
              </div>
            ))}
          </div>

          <h2 className="mb-2">{t("Trabalhos")}</h2>
          <ul className="space-y-2">
            {trabalhos.map((x) => {
              const a = analisarTrabalho(x, rateio.porDiaPadrao);
              return (
                <li key={x.id}>
                  <Link href={`/precos/${x.id}`} className={`cartao block hover:border-marca-300 ${abaixoDaMeta(a) ? "border-red-200" : ""}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-semibold"><TextoUsuario texto={x.descricao} /></div>
                        <div className="text-xs text-stone-500">
                          {t(nomeTipoServico(x.tipoServico))}
                          {x.subServicos && ` (${descreverSubservicos(x.tipoServico, x.subServicos, t)})`}
                          {[x.cidade, x.condado && `${x.condado} County`, x.data && data(x.data)].filter(Boolean).map((p) => ` · ${p}`).join("")}
                          {x.obraId && ` · ${t("obra do app")}`}
                        </div>
                      </div>
                      <Multiplicador valor={a.multiplicador} />
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                      <span>
                        <span className="block text-xs text-stone-500">{x.unidade === "SERVICO" ? t("Serviço") : `${x.quantidade.toLocaleString("en-US")} ${unidade(x.unidade)}`}</span>
                        {a.precoPorUnidade !== null && <span className="tabular-nums">{t("{valor}/un.", { valor: dinheiro(Math.round(a.precoPorUnidade)) })}</span>}
                      </span>
                      <span>
                        <span className="block text-xs text-stone-500">{t("Cobrado")}</span>
                        <span className="tabular-nums">{dinheiro(x.precoCobradoCent)}</span>
                      </span>
                      <span>
                        <span className="block text-xs text-stone-500">{t("Lucro")}</span>
                        <span className={`tabular-nums ${a.lucro < 0 ? "text-red-700" : "text-emerald-700"}`}>{dinheiro(a.lucro)}</span>
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-xs text-stone-500">
            {t("O custo de cada trabalho soma material, mão de obra, outros custos e os dias de trabalho × custo fixo por dia de hoje ({valor}). Preço mínimo para a meta = 2 × custo médio por unidade.", { valor: dinheiro(rateio.porDiaPadrao) })}
          </p>
        </>
      )}
    </>
  );
}
