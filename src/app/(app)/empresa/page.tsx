import Link from "next/link";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { campoData, centavosParaCampo, data, dinheiro, lerDataHora } from "@/lib/format";
import { custoPonto } from "@/lib/financeiro";
import { PERIODICIDADES, diasUteis, rateioCustosFixos, valorMensal } from "@/lib/custos-fixos";
import { Cabecalho, Campo, Indicador, Vazio } from "@/components/ui";
import { Formulario } from "@/components/Formulario";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { FotoRecibo } from "@/components/FotoRecibo";
import { TextoUsuario } from "@/components/TextoUsuario";
import { getT, idiomaAtual } from "@/i18n/servidor";
import { BANDEIRAS } from "@/i18n/idiomas";
import { FluxoCaixaEmpresa } from "@/components/FluxoCaixaEmpresa";
import { emailContaServico, lerFluxoCaixa, mediasCustosFixos, mesmoCusto, totaisPorGrupo } from "@/lib/planilha-fluxo";
import { excluirCustoFixo, excluirGastoEmpresa, importarCustosFixos, lancarGastoEmpresa, salvarCustoFixo } from "./actions";

const HORAS_DIARIA = 8;

function mesSeguinte(mes: string) {
  const [a, m] = mes.split("-").map(Number);
  return m === 12 ? `${a + 1}-01` : `${a}-${String(m + 1).padStart(2, "0")}`;
}

function mesAnterior(mes: string) {
  const [a, m] = mes.split("-").map(Number);
  return m === 1 ? `${a - 1}-12` : `${a}-${String(m - 1).padStart(2, "0")}`;
}

function nomeMes(mes: string) {
  const [a, m] = mes.split("-").map(Number);
  return new Date(Date.UTC(a, m - 1, 15)).toLocaleDateString(BANDEIRAS[idiomaAtual()].locale, { month: "long", year: "numeric", timeZone: "UTC" });
}

export default async function Empresa({ searchParams }: { searchParams: { mes?: string } }) {
  await exigirAdmin();
  const t = getT();
  const mesAtual = campoData(new Date()).slice(0, 7);
  const mes = /^\d{4}-\d{2}$/.test(searchParams.mes ?? "") ? searchParams.mes! : mesAtual;
  const inicio = lerDataHora(`${mes}-01T00:00`)!;
  const fim = lerDataHora(`${mesSeguinte(mes)}-01T00:00`)!;

  const [planilha, rateio, custos, gastos, equipe, lancamentos, registros, obras] = await Promise.all([
    lerFluxoCaixa(),
    rateioCustosFixos(),
    db.custoFixo.findMany({ orderBy: [{ ativo: "desc" }, { valorCent: "desc" }] }),
    db.gastoEmpresa.findMany({ where: { data: { gte: inicio, lt: fim } }, orderBy: { data: "desc" } }),
    // Equipe fixa (helpers são temporários e entram só quando trabalham)
    db.usuario.findMany({ where: { ativo: true, papel: "FUNCIONARIO", vinculo: "FIXO" } }),
    db.lancamento.findMany({ where: { data: { gte: inicio, lt: fim } } }),
    db.registroPonto.findMany({ where: { entrada: { gte: inicio, lt: fim } } }),
    db.obra.findMany({ select: { id: true, nome: true } }),
  ]);

  // Quanto custa um dia de trabalho da empresa antes do material
  const diariasEquipe = equipe.reduce((s, u) => s + (u.tipoPagamento === "DIARIA" ? u.valorDiariaCent : u.valorHoraCent * HORAS_DIARIA), 0);
  const custoDiaObra = rateio.porDiaPadrao + diariasEquipe;

  // Diagnóstico do mês (visão de caixa)
  const fixoMes = rateio.custoDoMes(mes);
  const coberto = rateio.cobertoNoMes(mes);
  const recebido = lancamentos.filter((l) => l.tipo === "ENTRADA").reduce((s, l) => s + l.valorCent, 0);
  const gastosObras = lancamentos.filter((l) => l.tipo === "SAIDA").reduce((s, l) => s + l.valorCent, 0);
  const custoEquipe = custoPonto(registros);
  const resultado = recebido - gastosObras - custoEquipe - fixoMes;
  const obrasDoMes = obras
    .map((o) => ({ ...o, fixo: rateio.daObra(o.id).noMes(mes) }))
    .filter((o) => o.fixo > 0)
    .sort((a, b) => b.fixo - a.fixo);

  // Custos fixos reais: média mensal de cada item da planilha (gasolina, refeição, galpão...)
  const medias = planilha.ok ? mediasCustosFixos(planilha.fluxo) : null;
  const retiradas = planilha.ok ? totaisPorGrupo(planilha.fluxo).SOCIOS : [];
  const retiradaMedia = medias ? Math.round(retiradas.reduce((s, v) => s + v, 0) / medias.meses) : 0;
  const manuaisAtivos = custos.filter((c) => c.ativo && !c.origem);

  return (
    <>
      <Cabecalho titulo={t("Empresa - Fluxo de caixa")} subtitulo={t("Fluxo de caixa da empresa, custos fixos e quanto custa um dia de obra")} />

      <div className="cartao mb-4">
        <h2 className="mb-3">{t("Fluxo de caixa")}</h2>
        {planilha.ok ? (
          <FluxoCaixaEmpresa fluxo={planilha.fluxo} />
        ) : planilha.motivo === "SEM_CONFIGURACAO" ? (
          <p className="text-sm text-stone-600">
            {t("O fluxo de caixa vem da planilha da pasta da empresa no Google Drive. Falta conectar o app ao Drive: siga a Parte 4 de docs/hospedagem.md (conta de serviço do Google).")}
          </p>
        ) : planilha.motivo === "SEM_PLANILHA" ? (
          <p className="text-sm text-stone-600">
            {t("Não achei a planilha de fluxo de caixa na pasta do Drive. Confira se a pasta está compartilhada com {email} e se o nome da planilha tem “Fluxo de Caixa”.", { email: emailContaServico() ?? "—" })}
          </p>
        ) : (
          <p className="rounded-lg bg-red-50 p-2 text-sm text-red-700">{t("Não consegui ler a planilha do Drive.")} {planilha.detalhe}</p>
        )}
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Indicador rotulo={t("Custo fixo por mês")} valor={dinheiro(rateio.recorrenteMensal)} detalhe={t("Custos recorrentes ativos")} />
        <Indicador rotulo={t("Custo fixo por dia útil")} valor={dinheiro(rateio.porDiaPadrao)} detalhe={t("Mês médio de 21,7 dias úteis")} />
        <Indicador
          rotulo={t("Um dia de obra custa")}
          valor={dinheiro(custoDiaObra)}
          detalhe={t("Custo fixo + diárias da equipe ({valor}), antes do material", { valor: dinheiro(diariasEquipe) })}
        />
        <Indicador
          rotulo={t("Meta 2x: faturar por dia")}
          valor={dinheiro(custoDiaObra * 2)}
          tom="bom"
          detalhe={t("+ 2x o material de cada obra")}
        />
      </div>

      <div className="cartao mb-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2>{t("Resultado de {mes}", { mes: nomeMes(mes) })}</h2>
          <div className="flex gap-2 text-sm">
            <Link href={`/empresa?mes=${mesAnterior(mes)}`} className="botao-secundario px-3 py-1">{t("← Anterior")}</Link>
            {mes !== mesAtual && <Link href="/empresa" className="botao-secundario px-3 py-1">{t("Mês atual")}</Link>}
            <Link href={`/empresa?mes=${mesSeguinte(mes)}`} className="botao-secundario px-3 py-1">{t("Próximo →")}</Link>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <table className="tabela">
            <tbody>
              <tr><td>{t("Recebido dos clientes")}</td><td className="text-right tabular-nums text-emerald-700">{dinheiro(recebido)}</td></tr>
              <tr><td>{t("Gastos lançados nas obras")}</td><td className="text-right tabular-nums text-red-700">− {dinheiro(gastosObras)}</td></tr>
              <tr><td>{t("Equipe (horas do ponto)")}</td><td className="text-right tabular-nums text-red-700">− {dinheiro(custoEquipe)}</td></tr>
              <tr><td>{t("Custos fixos do mês")}{rateio.avulsoDoMes(mes) > 0 && ` ${t("(inclui {valor} avulsos)", { valor: dinheiro(rateio.avulsoDoMes(mes)) })}`}</td><td className="text-right tabular-nums text-red-700">− {dinheiro(fixoMes)}</td></tr>
              <tr className="font-semibold">
                <td>{t("Sobrou no mês")}</td>
                <td className={`text-right tabular-nums ${resultado < 0 ? "text-red-700" : "text-emerald-700"}`}>{dinheiro(resultado)}</td>
              </tr>
            </tbody>
          </table>
          <div className="space-y-2 text-sm">
            <p>
              {t("{dias} dia(s) com obra de {uteis} dias úteis. Os dias trabalhados cobriram {coberto} dos {total} de custo fixo.", {
                dias: rateio.diasTrabalhadosNoMes(mes),
                uteis: diasUteis(mes),
                coberto: dinheiro(coberto),
                total: dinheiro(fixoMes),
              })}
            </p>
            {fixoMes - coberto > 0 && (
              <p className="rounded-lg bg-amber-50 p-2 text-amber-900">
                {t("⚠ {valor} de custo fixo caiu em dias sem obra: a empresa pagou, mas nenhuma obra cobriu.", { valor: dinheiro(fixoMes - coberto) })}
              </p>
            )}
            <p className="text-xs text-stone-500">
              {t("“Sobrou no mês” compara o dinheiro que entrou com o que saiu no mês. Pagamentos recebidos de obras de meses anteriores ou futuros fazem o resultado variar de um mês para outro.")}
            </p>
            {obrasDoMes.length > 0 && (
              <table className="tabela">
                <thead><tr><th>{t("Obra")}</th><th className="text-right">{t("Custo fixo no mês")}</th></tr></thead>
                <tbody>
                  {obrasDoMes.map((o) => (
                    <tr key={o.id}>
                      <td><Link href={`/obras/${o.id}`} className="link">{o.nome}</Link></td>
                      <td className="text-right tabular-nums">{dinheiro(o.fixo)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="cartao overflow-x-auto">
          <h2 className="mb-1">{t("Custos fixos recorrentes")}</h2>
          <p className="mb-3 text-sm text-stone-500">
            {t("Gastos que a empresa tem com ou sem obra. São divididos entre as obras pelos dias trabalhados.")}
          </p>
          {custos.length === 0 ? (
            <Vazio>{t("Nenhum custo fixo cadastrado.")}</Vazio>
          ) : (
            <div className="space-y-2">
              {custos.map((c) => (
                <Formulario key={c.id} acao={salvarCustoFixo.bind(null, c.id)} className={`grid grid-cols-[6rem_1fr] items-center gap-2 rounded-lg border border-stone-200 p-2 sm:grid-cols-[6rem_1fr_auto] ${c.ativo ? "" : "opacity-50"}`}>
                  <input className="campo col-span-full" name="nome" defaultValue={c.nome} aria-label={t("Nome")} />
                  <input className="campo" name="valor" inputMode="decimal" defaultValue={centavosParaCampo(c.valorCent)} aria-label={t("Valor")} />
                  <select className="campo" name="periodicidade" defaultValue={c.periodicidade} aria-label={t("Periodicidade")}>
                    {Object.entries(PERIODICIDADES).map(([k, v]) => <option key={k} value={k}>{t(v)}</option>)}
                  </select>
                  <div className="flex items-center gap-2 text-sm">
                    <label className="flex items-center gap-1"><input type="checkbox" name="ativo" defaultChecked={c.ativo} /> {t("ativo")}</label>
                    <BotaoEnviar className="botao-secundario px-2 py-1 text-sm">{t("Salvar")}</BotaoEnviar>
                  </div>
                  <div className="col-span-full flex justify-between text-xs text-stone-500">
                    <span>{t("= {valor} por mês", { valor: dinheiro(Math.round(valorMensal(c.valorCent, c.periodicidade))) })}</span>
                    {c.origem && <span className="selo bg-sky-100 text-sky-800">{t("média real da planilha")}</span>}
                  </div>
                </Formulario>
              ))}
            </div>
          )}
          <h3 className="mb-2 mt-4 font-semibold">{t("Adicionar custo fixo")}</h3>
          <Formulario acao={salvarCustoFixo.bind(null, null)} className="grid grid-cols-[6rem_1fr] gap-2 sm:grid-cols-[6rem_1fr_auto]">
            <input className="campo col-span-full" name="nome" placeholder={t("Ex.: Seguro do galpão")} required />
            <input className="campo" name="valor" inputMode="decimal" placeholder="0.00" required />
            <select className="campo" name="periodicidade" defaultValue="MENSAL">
              {Object.entries(PERIODICIDADES).map(([k, v]) => <option key={k} value={k}>{t(v)}</option>)}
            </select>
            <BotaoEnviar>{t("Adicionar")}</BotaoEnviar>
          </Formulario>
          {custos.length > 0 && (
            <details className="mt-3 text-sm">
              <summary className="cursor-pointer text-stone-500">{t("Excluir um custo fixo")}</summary>
              <ul className="mt-2 space-y-1">
                {custos.map((c) => (
                  <li key={c.id} className="flex items-center justify-between">
                    {c.nome}
                    <form action={excluirCustoFixo.bind(null, c.id)}>
                      <BotaoEnviar className="text-xs text-red-700 hover:underline" confirmar={t("Excluir \"{nome}\"? Para parar de contar só a partir de agora, desmarque \"ativo\".", { nome: c.nome })}>{t("Excluir")}</BotaoEnviar>
                    </form>
                  </li>
                ))}
              </ul>
            </details>
          )}
          {medias && medias.itens.length > 0 && (
            <div className="mt-4 rounded-lg border border-sky-200 bg-sky-50 p-3">
              <h3 className="font-semibold">{t("Custos fixos reais da planilha")}</h3>
              <p className="mb-2 text-sm text-stone-600">
                {t("Média por mês dos últimos {n} meses do fluxo de caixa: {valor}. Use estes números reais no lugar das estimativas.", { n: medias.meses, valor: dinheiro(medias.totalCent) })}
              </p>
              <Formulario acao={importarCustosFixos} className="space-y-3">
                <ul className="space-y-1 text-sm">
                  {medias.itens.map((m) => (
                    <li key={m.item}>
                      <label className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-2">
                          <input type="checkbox" name="item" value={m.item} defaultChecked className="h-4 w-4" />
                          {m.item}
                        </span>
                        <span className="tabular-nums">{t("{valor}/mês", { valor: dinheiro(m.mediaCent) })}</span>
                      </label>
                    </li>
                  ))}
                </ul>
                {manuaisAtivos.length > 0 && (
                  <div className="text-sm">
                    <p className="mb-1 font-medium">{t("Parar de contar estes cadastrados à mão (já estão na planilha):")}</p>
                    <ul className="space-y-1">
                      {manuaisAtivos.map((c) => (
                        <li key={c.id}>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" name="desativar" value={c.id} defaultChecked={medias.itens.some((m) => mesmoCusto(c.nome, m.item))} className="h-4 w-4" />
                            {c.nome} <span className="text-stone-500">({t("= {valor} por mês", { valor: dinheiro(Math.round(valorMensal(c.valorCent, c.periodicidade))) })})</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <p className="text-xs text-stone-500">
                  {t("As retiradas dos sócios ficam de fora (o pró-labore continua no cadastro). Média real das retiradas: {valor}/mês.", { valor: dinheiro(retiradaMedia) })}
                </p>
                <BotaoEnviar>{t("Usar os números reais")}</BotaoEnviar>
              </Formulario>
            </div>
          )}
        </div>

        <div className="cartao overflow-x-auto">
          <h2 className="mb-1">{t("Gastos avulsos da empresa")}</h2>
          <p className="mb-3 text-sm text-stone-500">
            {t("Ferramentas e outros gastos que não são de uma obra só. Entram no custo fixo do mês em que aconteceram.")}
          </p>
          <Formulario acao={lancarGastoEmpresa} className="mb-4 space-y-3">
            <div className="grid gap-2 sm:grid-cols-[1fr_7rem_10rem]">
              <Campo rotulo={t("Descrição")}><input className="campo" name="descricao" placeholder={t("Ex.: Serra circular DeWalt")} required /></Campo>
              <Campo rotulo={t("Valor")}><input className="campo" name="valor" inputMode="decimal" placeholder="0.00" required /></Campo>
              <Campo rotulo={t("Data")}><input className="campo" name="data" type="date" defaultValue={campoData(new Date())} /></Campo>
            </div>
            <FotoRecibo rotulo={t("Recibo (opcional)")} />
            <BotaoEnviar>{t("Lançar gasto")}</BotaoEnviar>
          </Formulario>
          <h3 className="mb-2 font-semibold">{t("Em {mes}", { mes: nomeMes(mes) })}</h3>
          {gastos.length === 0 ? (
            <Vazio>{t("Nenhum gasto avulso neste mês.")}</Vazio>
          ) : (
            <table className="tabela">
              <tbody>
                {gastos.map((g) => (
                  <tr key={g.id}>
                    <td className="whitespace-nowrap">{data(g.data)}</td>
                    <td><TextoUsuario texto={g.descricao} /></td>
                    <td className="text-right tabular-nums">{dinheiro(g.valorCent)}</td>
                    <td>{g.comprovante ? <a href={`/api/comprovantes/${g.comprovante}`} target="_blank" className="link">{t("Ver")}</a> : "—"}</td>
                    <td>
                      <form action={excluirGastoEmpresa.bind(null, g.id)}>
                        <BotaoEnviar className="text-xs text-red-700 hover:underline" confirmar={t("Excluir este gasto?")}>{t("Excluir")}</BotaoEnviar>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
