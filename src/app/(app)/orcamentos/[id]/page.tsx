import Link from "next/link";
import { notFound } from "next/navigation";
import type { ItemOpcao, OpcaoOrcamento } from "@prisma/client";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { centavosParaCampo, data, dinheiro } from "@/lib/format";
import { CATEGORIAS_DESPESA, UNIDADES, descreverSubservicos, nomeCategoria, nomeTipoServico } from "@/lib/constantes";
import { rateioCustosFixos } from "@/lib/custos-fixos";
import { STATUS_ORCAMENTO, calcularOpcao, lerMercado, referenciaHistorico, type CalculoOpcao } from "@/lib/orcamento";
import { META_MULTIPLICADOR } from "@/lib/precos";
import { iaDisponivel } from "@/lib/precificacao-ia";
import { Cabecalho, Campo, Voltar } from "@/components/ui";
import { Formulario } from "@/components/Formulario";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { TextoUsuario } from "@/components/TextoUsuario";
import {
  adicionarItem,
  copiarItens,
  excluirItem,
  mudarStatusOrcamento,
  precificarMaterial,
  prepararPerguntas,
  salvarItem,
  salvarOpcao,
  salvarRespostas,
  sugerirOpcoes,
} from "../actions";
import { getT, type T } from "@/i18n/servidor";

// A pesquisa de mercado com a IA pode levar 1 a 2 minutos
export const maxDuration = 300;

type Pergunta = { pergunta: string; opcoes: string[]; resposta?: string };
type Opcao = OpcaoOrcamento & { itens: ItemOpcao[] };

function Multiplicador({ valor }: { valor: number | null }) {
  if (valor === null) return <span className="selo bg-stone-100 text-stone-600">—</span>;
  const ok = valor >= META_MULTIPLICADOR;
  return <span className={`selo tabular-nums ${ok ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>{valor.toFixed(2)}x</span>;
}

export default async function Orcamento({ params }: { params: { id: string } }) {
  await exigirAdmin();
  const t = getT();
  const [orc, trabalhos, rateio] = await Promise.all([
    db.orcamento.findUnique({
      where: { id: params.id },
      include: { cliente: true, visita: true, opcoes: { include: { itens: { orderBy: { ordem: "asc" } } }, orderBy: { ordem: "asc" } } },
    }),
    db.trabalhoReferencia.findMany(),
    rateioCustosFixos(),
  ]);
  if (!orc) notFound();

  const custoDia = rateio.porDiaPadrao;
  const calculos = orc.opcoes.map((o) => calcularOpcao(o, custoDia));
  const historico = referenciaHistorico(orc, trabalhos, custoDia);
  const mercado = lerMercado(orc.mercado);
  const perguntas: Pergunta[] = orc.perguntas ? JSON.parse(orc.perguntas) : [];
  const unidade = t((UNIDADES as Record<string, string>)[orc.unidade] ?? orc.unidade);
  const ia = iaDisponivel();

  return (
    <>
      <Voltar href="/orcamentos" rotulo={t("Orçamentos")} />
      <Cabecalho
        titulo={orc.cliente.nome}
        subtitulo={
          <span>
            {orc.tipoServico ? t(nomeTipoServico(orc.tipoServico)) : "—"}
            {orc.subServicos && ` (${descreverSubservicos(orc.tipoServico, orc.subServicos, t)})`}
            {orc.quantidade > 0 && orc.unidade !== "SERVICO" && ` · ${orc.quantidade.toLocaleString("en-US")} ${unidade}`}
            {orc.cidade && ` · ${orc.cidade}`}
            {orc.condado && ` (${orc.condado} County)`}
          </span>
        }
      >
        <Link href={`/orcamentos/${orc.id}/editar`} className="botao-secundario">{t("Editar dados")}</Link>
      </Cabecalho>

      {orc.descricao && (
        <p className="mb-4 text-sm text-stone-600"><TextoUsuario texto={orc.descricao} /></p>
      )}

      {/* Situação do orçamento */}
      <div className="-mx-4 mb-4 overflow-x-auto px-4">
        <div className="flex w-max items-center gap-2 text-sm">
          {Object.entries(STATUS_ORCAMENTO).map(([k, v]) => (
            <form key={k} action={mudarStatusOrcamento.bind(null, orc.id, k)}>
              <button className={`rounded-full border px-3 py-1 ${orc.status === k ? "border-stone-800 bg-stone-800 text-white" : "border-stone-300 bg-white"}`}>{t(v)}</button>
            </form>
          ))}
          {orc.visita && <Link href={`/visitas/${orc.visita.id}`} className="link ml-2 whitespace-nowrap">{t("Ver visita →")}</Link>}
        </div>
      </div>

      {/* Comparação rápida das duas opções */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        {orc.opcoes.map((o, i) => (
          <a key={o.id} href={`#opcao-${o.id}`} className="cartao block">
            <div className="text-xs font-medium uppercase tracking-wide text-stone-500">{t("Opção {n}", { n: i + 1 })} · {o.nome}</div>
            <div className="mt-1 text-xl font-bold tabular-nums">{calculos[i].custoTotal > 0 ? dinheiro(calculos[i].preco) : "—"}</div>
            <div className="mt-1 flex items-center gap-2 text-xs text-stone-500">
              <Multiplicador valor={calculos[i].multiplicador} />
              {calculos[i].custoTotal > 0 && t("custo {valor}", { valor: dinheiro(calculos[i].custoTotal) })}
            </div>
          </a>
        ))}
      </div>

      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <Referencias t={t} historico={historico} mercado={mercado} unidade={unidade} quantidade={orc.quantidade} />
        <div className="cartao">
          <h2 className="mb-1">{t("Precificar com IA")}</h2>
          {!ia ? (
            <p className="text-sm text-stone-600">{t("A IA não está ligada: falta a chave ANTHROPIC_API_KEY na Vercel.")}</p>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold">{t("1. Perguntas sobre o trabalho")}</h3>
                <p className="mb-2 text-xs text-stone-500">{t("Quanto mais detalhes, mais perto do valor final fica a pesquisa.")}</p>
                {perguntas.length === 0 ? (
                  <Formulario acao={prepararPerguntas.bind(null, orc.id)} className="space-y-2">
                    <BotaoEnviar className="botao-secundario" aguardando={t("Preparando perguntas...")}>{t("Fazer as perguntas")}</BotaoEnviar>
                  </Formulario>
                ) : (
                  <Formulario acao={salvarRespostas.bind(null, orc.id)} className="space-y-3">
                    {perguntas.map((p, i) => (
                      <fieldset key={i} className="text-sm">
                        <legend className="mb-1 font-medium">{p.pergunta}</legend>
                        <div className="flex flex-wrap gap-2">
                          {p.opcoes.map((op) => (
                            <label key={op} className="cursor-pointer">
                              <input type="radio" name={`resposta_${i}`} value={op} defaultChecked={p.resposta === op} className="peer sr-only" />
                              <span className="inline-block rounded-full border border-stone-300 bg-white px-3 py-1 peer-checked:border-marca-600 peer-checked:bg-marca-600 peer-checked:text-white">{op}</span>
                            </label>
                          ))}
                        </div>
                        <input
                          className="campo mt-2 py-1.5 text-sm"
                          name={`outra_${i}`}
                          defaultValue={p.resposta && !p.opcoes.includes(p.resposta) ? p.resposta : ""}
                          placeholder={t("Outra resposta")}
                        />
                      </fieldset>
                    ))}
                    <BotaoEnviar className="botao-secundario">{t("Salvar respostas")}</BotaoEnviar>
                  </Formulario>
                )}
              </div>
              <div>
                <h3 className="text-sm font-semibold">{t("2. Pesquisar o mercado e sugerir as duas opções")}</h3>
                <p className="mb-2 text-xs text-stone-500">
                  {t("Busca Thumbtack, Angi/HomeAdvisor, HomeGuide, Homewyse e Home Depot/Lowe's para {cidade}, monta Essential e Premium com itens de custo e dias, e guarda as fontes. Leva 1 a 2 minutos. Troca os itens atuais das duas opções.", { cidade: orc.cidade || "Connecticut" })}
                </p>
                <Formulario acao={sugerirOpcoes.bind(null, orc.id)} className="space-y-2">
                  <BotaoEnviar
                    aguardando={t("Pesquisando... (1 a 2 minutos)")}
                    confirmar={orc.opcoes.some((o) => o.itens.length) ? t("Trocar os itens das duas opções pela sugestão da IA?") : undefined}
                  >
                    {mercado ? t("Pesquisar de novo") : t("Pesquisar e sugerir")}
                  </BotaoEnviar>
                </Formulario>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {orc.opcoes.map((o, i) => (
          <OpcaoCard key={o.id} t={t} opcao={o} calc={calculos[i]} numero={i + 1} outra={orc.opcoes[1 - i]} custoDia={custoDia} ia={ia} />
        ))}
      </div>
    </>
  );
}

function Referencias({
  t,
  historico,
  mercado,
  unidade,
  quantidade,
}: {
  t: T;
  historico: ReturnType<typeof referenciaHistorico>;
  mercado: ReturnType<typeof lerMercado>;
  unidade: string;
  quantidade: number;
}) {
  return (
    <div className="cartao">
      <h2 className="mb-3">{t("Referências de preço")}</h2>
      <h3 className="text-sm font-semibold">{t("Histórico da Tababog")}</h3>
      {historico ? (
        <div className="mb-4 text-sm">
          <p className="text-xs text-stone-500">{t("{n} trabalho(s) · {regiao}", { n: historico.grupo.trabalhos, regiao: t(historico.regiao) })}</p>
          <ul className="mt-1 space-y-0.5">
            {historico.grupo.precoPorUnidade !== null && (
              <li>{t("Cobrado: {valor} por {unidade}", { valor: dinheiro(Math.round(historico.grupo.precoPorUnidade)), unidade })} {historico.precoEstimado !== null && <b>→ {dinheiro(historico.precoEstimado)}</b>}</li>
            )}
            {historico.grupo.custoPorUnidade !== null && (
              <li>{t("Custo: {valor} por {unidade}", { valor: dinheiro(Math.round(historico.grupo.custoPorUnidade)), unidade })} {historico.custoEstimado !== null && <>→ {dinheiro(historico.custoEstimado)}</>}</li>
            )}
            {historico.precoMinimo !== null && (
              <li className="font-semibold text-marca-700">{t("Mínimo para 2x: {valor}", { valor: dinheiro(historico.precoMinimo) })}</li>
            )}
            {historico.grupo.multiplicador !== null && (
              <li className="text-xs text-stone-500">{t("Multiplicador médio do histórico: {x}x", { x: historico.grupo.multiplicador.toFixed(2) })}</li>
            )}
          </ul>
        </div>
      ) : (
        <p className="mb-4 text-sm text-stone-500">
          {t("Nenhum trabalho parecido no banco de preços.")} <Link href="/precos/novo" className="link">{t("Cadastrar trabalho antigo")}</Link>
        </p>
      )}

      <h3 className="text-sm font-semibold">{t("Mercado")}</h3>
      {mercado ? (
        <div className="text-sm">
          <p className="text-xs text-stone-500">{t("Consulta de {data} · {cidade}", { data: mercado.consultadoEm.split("-").reverse().join("/"), cidade: mercado.cidade || "CT" })}</p>
          <p className="mt-1">
            {t("Faixa de preço: {baixa} – {alta}", { baixa: dinheiro(mercado.faixaBaixaCent), alta: dinheiro(mercado.faixaAltaCent) })}
            {mercado.porUnidade && quantidade > 0 && (
              <span className="text-stone-500"> · {t("{baixa} – {alta} por {unidade}", { baixa: dinheiro(mercado.porUnidade.baixaCent), alta: dinheiro(mercado.porUnidade.altaCent), unidade })}</span>
            )}
          </p>
          <p className="mt-1 text-stone-600"><TextoUsuario texto={mercado.resumo} /></p>
          {mercado.fontes.length > 0 && (
            <ul className="mt-2 space-y-1 text-xs">
              {mercado.fontes.map((f) => (
                <li key={f.url}>
                  <a href={f.url} target="_blank" rel="noreferrer" className="link">{f.nome}</a> <span className="text-stone-500">· {f.valor}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <p className="text-sm text-stone-500">{t("Ainda sem pesquisa de mercado. Use \"Pesquisar e sugerir\".")}</p>
      )}
    </div>
  );
}

function OpcaoCard({ t, opcao, calc, numero, outra, custoDia, ia }: { t: T; opcao: Opcao; calc: CalculoOpcao; numero: number; outra?: Opcao; custoDia: number; ia: boolean }) {
  const abaixo = calc.multiplicador !== null && calc.multiplicador < META_MULTIPLICADOR;
  return (
    <div id={`opcao-${opcao.id}`} className="cartao scroll-mt-20">
      <div className="mb-3 flex items-start justify-between gap-2">
        <h2>{t("Opção {n}: {nome}", { n: numero, nome: opcao.nome })}</h2>
        <Multiplicador valor={calc.multiplicador} />
      </div>

      <Formulario acao={salvarOpcao.bind(null, opcao.id)} className="mb-4 grid grid-cols-2 gap-2">
        <Campo rotulo={t("Nome")}><input className="campo" name="nome" defaultValue={opcao.nome} /></Campo>
        <Campo rotulo={t("Dias de trabalho")}><input className="campo" name="dias" inputMode="numeric" defaultValue={opcao.diasPrevistos || ""} placeholder="0" /></Campo>
        <div className="col-span-2">
          <Campo rotulo={t("Descrição para o cliente (em inglês)")}>
            <textarea className="campo" name="descricao" rows={2} defaultValue={opcao.descricao ?? ""} placeholder="Pressure-treated deck with..." />
          </Campo>
        </div>
        <div className="col-span-2">
          <Campo rotulo={t("Preço para o cliente (vazio = sugerido {valor})", { valor: dinheiro(calc.precoSugerido) })}>
            <input className="campo" name="preco" inputMode="decimal" defaultValue={calc.precoDefinido ? centavosParaCampo(opcao.precoCent) : ""} placeholder={centavosParaCampo(calc.precoSugerido)} />
          </Campo>
        </div>
        <div className="col-span-2"><BotaoEnviar className="botao-secundario">{t("Salvar opção")}</BotaoEnviar></div>
      </Formulario>

      <h3 className="mb-1 font-semibold">{t("Itens de custo")}</h3>
      {opcao.itens.length === 0 ? (
        <p className="mb-3 text-sm text-stone-500">{t("Nenhum item ainda.")}</p>
      ) : (
        <ul className="mb-3 divide-y divide-stone-100 text-sm">
          {opcao.itens.map((i) => (
            <li key={i.id} className="py-1.5">
              <details>
                <summary className="flex cursor-pointer list-none items-start justify-between gap-2">
                  <span className="min-w-0">
                    <TextoUsuario texto={i.descricao} />
                    <span className="block text-xs text-stone-500">
                      {t(nomeCategoria(i.categoria))} · {i.quantidade.toLocaleString("en-US")} {i.unidade ?? ""} × {dinheiro(i.custoUnitCent)}
                    </span>
                    {i.fonte && (
                      <span className="block text-xs text-stone-400">
                        {i.fonteUrl ? <a href={i.fonteUrl} target="_blank" rel="noreferrer" className="underline">{i.fonte}</a> : i.fonte}
                      </span>
                    )}
                  </span>
                  <span className="whitespace-nowrap tabular-nums">{dinheiro(Math.round(i.quantidade * i.custoUnitCent))}</span>
                </summary>
                <Formulario acao={salvarItem.bind(null, i.id)} className="mt-2 grid grid-cols-2 gap-2 rounded-lg bg-stone-50 p-2">
                  <CamposItem t={t} item={i} />
                  <BotaoEnviar className="botao-secundario px-3 py-1 text-sm">{t("Salvar")}</BotaoEnviar>
                </Formulario>
                <form action={excluirItem.bind(null, i.id)} className="mt-1">
                  <BotaoEnviar className="text-xs text-red-700 hover:underline">{t("Excluir item")}</BotaoEnviar>
                </form>
              </details>
            </li>
          ))}
        </ul>
      )}

      <details className="mb-3 rounded-lg border border-stone-200 p-2">
        <summary className="cursor-pointer text-sm font-semibold text-marca-700">{t("+ Adicionar item")}</summary>
        <Formulario acao={adicionarItem.bind(null, opcao.id)} className="mt-2 grid grid-cols-2 gap-2">
          <CamposItem t={t} />
          <BotaoEnviar className="botao-secundario px-3 py-1 text-sm">{t("Adicionar")}</BotaoEnviar>
        </Formulario>
      </details>

      {ia && (
        <details className="mb-3 rounded-lg border border-stone-200 p-2">
          <summary className="cursor-pointer text-sm font-semibold text-marca-700">{t("🛒 Preço do material (Home Depot / Lowe's)")}</summary>
          <Formulario acao={precificarMaterial.bind(null, opcao.id)} className="mt-2 space-y-2">
            <p className="text-xs text-stone-500">{t("Um item por linha, com a quantidade. O app busca o preço nas duas lojas e usa o menor.")}</p>
            <textarea className="campo text-sm" name="lista" rows={5} placeholder={"40 Trex Enhance 1x6x16 Toasted Sand\n12 2x8x12 pressure treated\n30 bags concrete 80 lb"} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="substituir" className="h-4 w-4" /> {t("Trocar os materiais que já estão nesta opção")}
            </label>
            <BotaoEnviar aguardando={t("Buscando preços... (até 2 minutos)")}>{t("Buscar preços")}</BotaoEnviar>
          </Formulario>
        </details>
      )}

      {outra && outra.itens.length > 0 && (
        <form action={copiarItens.bind(null, outra.id, opcao.id)} className="mb-3">
          <BotaoEnviar className="text-sm text-marca-700 hover:underline" confirmar={opcao.itens.length ? t("Trocar os itens desta opção pelos da outra?") : undefined}>
            {t("Copiar os itens de \"{nome}\"", { nome: outra.nome })}
          </BotaoEnviar>
        </form>
      )}

      <table className="tabela">
        <tbody>
          {calc.porCategoria.map((c) => (
            <tr key={c.categoria}><td>{t(nomeCategoria(c.categoria))}</td><td className="text-right tabular-nums">{dinheiro(c.valor)}</td></tr>
          ))}
          <tr>
            <td>{t("Custos fixos da empresa ({dias} dias × {valor})", { dias: opcao.diasPrevistos, valor: dinheiro(custoDia) })}</td>
            <td className="text-right tabular-nums">{dinheiro(calc.custoFixo)}</td>
          </tr>
          <tr className="font-semibold"><td>{t("Custo total")}</td><td className="text-right tabular-nums">{dinheiro(calc.custoTotal)}</td></tr>
          <tr><td>{t("Preço sugerido (2x o custo)")}</td><td className="text-right tabular-nums">{dinheiro(calc.precoSugerido)}</td></tr>
          <tr className="text-base font-bold">
            <td>{t("Preço para o cliente")}</td>
            <td className="text-right tabular-nums">{dinheiro(calc.preco)}</td>
          </tr>
          <tr>
            <td>{t("Lucro")}</td>
            <td className={`text-right tabular-nums ${calc.lucro < 0 ? "text-red-700" : "text-emerald-700"}`}>{dinheiro(calc.lucro)}</td>
          </tr>
        </tbody>
      </table>
      {abaixo && (
        <p className="mt-2 rounded-lg bg-red-50 p-2 text-sm font-semibold text-red-800">
          {t("⚠ Abaixo da meta 2x. Para chegar ao dobro, o preço seria {valor}.", { valor: dinheiro(calc.custoTotal * 2) })}
        </p>
      )}
    </div>
  );
}

function CamposItem({ t, item }: { t: T; item?: ItemOpcao }) {
  return (
    <>
      <div className="col-span-2">
        <input className="campo text-sm" name="descricao" defaultValue={item?.descricao} placeholder={t("Descrição (em inglês, vai para a proposta)")} required />
      </div>
      <select className="campo text-sm" name="categoria" defaultValue={item?.categoria ?? "MATERIAL"} aria-label={t("Categoria")}>
        {Object.entries(CATEGORIAS_DESPESA).map(([k, v]) => <option key={k} value={k}>{t(v)}</option>)}
      </select>
      <input className="campo text-sm" name="unidade" defaultValue={item?.unidade ?? ""} placeholder={t("Unidade (ex.: un, sq ft, dia)")} aria-label={t("Unidade")} />
      <input className="campo text-sm" name="quantidade" inputMode="decimal" defaultValue={item ? String(item.quantidade) : "1"} aria-label={t("Quantidade")} placeholder={t("Quantidade")} />
      <input className="campo text-sm" name="custo" inputMode="decimal" defaultValue={item ? centavosParaCampo(item.custoUnitCent) : ""} aria-label={t("Custo unitário")} placeholder={t("Custo unitário")} />
    </>
  );
}
