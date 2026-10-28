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
import { excluirCustoFixo, excluirGastoEmpresa, lancarGastoEmpresa, salvarCustoFixo } from "./actions";

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
  return new Date(Date.UTC(a, m - 1, 15)).toLocaleDateString("pt-BR", { month: "long", year: "numeric", timeZone: "UTC" });
}

export default async function Empresa({ searchParams }: { searchParams: { mes?: string } }) {
  await exigirAdmin();
  const mesAtual = campoData(new Date()).slice(0, 7);
  const mes = /^\d{4}-\d{2}$/.test(searchParams.mes ?? "") ? searchParams.mes! : mesAtual;
  const inicio = lerDataHora(`${mes}-01T00:00`)!;
  const fim = lerDataHora(`${mesSeguinte(mes)}-01T00:00`)!;

  const [rateio, custos, gastos, equipe, lancamentos, registros, obras] = await Promise.all([
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

  return (
    <>
      <Cabecalho titulo="Empresa" subtitulo="Custos fixos, quanto custa um dia de obra e o resultado de cada mês" />

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Indicador rotulo="Custo fixo por mês" valor={dinheiro(rateio.recorrenteMensal)} detalhe="Custos recorrentes ativos" />
        <Indicador rotulo="Custo fixo por dia útil" valor={dinheiro(rateio.porDiaPadrao)} detalhe="Mês médio de 21,7 dias úteis" />
        <Indicador
          rotulo="Um dia de obra custa"
          valor={dinheiro(custoDiaObra)}
          detalhe={`Custo fixo + diárias da equipe (${dinheiro(diariasEquipe)}), antes do material`}
        />
        <Indicador
          rotulo="Meta 2x: faturar por dia"
          valor={dinheiro(custoDiaObra * 2)}
          tom="bom"
          detalhe="+ 2x o material de cada obra"
        />
      </div>

      <div className="cartao mb-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2>Resultado de {nomeMes(mes)}</h2>
          <div className="flex gap-2 text-sm">
            <Link href={`/empresa?mes=${mesAnterior(mes)}`} className="botao-secundario px-3 py-1">← Anterior</Link>
            {mes !== mesAtual && <Link href="/empresa" className="botao-secundario px-3 py-1">Mês atual</Link>}
            <Link href={`/empresa?mes=${mesSeguinte(mes)}`} className="botao-secundario px-3 py-1">Próximo →</Link>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <table className="tabela">
            <tbody>
              <tr><td>Recebido dos clientes</td><td className="text-right tabular-nums text-emerald-700">{dinheiro(recebido)}</td></tr>
              <tr><td>Gastos lançados nas obras</td><td className="text-right tabular-nums text-red-700">− {dinheiro(gastosObras)}</td></tr>
              <tr><td>Equipe (horas do ponto)</td><td className="text-right tabular-nums text-red-700">− {dinheiro(custoEquipe)}</td></tr>
              <tr><td>Custos fixos do mês{rateio.avulsoDoMes(mes) > 0 && ` (inclui ${dinheiro(rateio.avulsoDoMes(mes))} avulsos)`}</td><td className="text-right tabular-nums text-red-700">− {dinheiro(fixoMes)}</td></tr>
              <tr className="font-semibold">
                <td>Sobrou no mês</td>
                <td className={`text-right tabular-nums ${resultado < 0 ? "text-red-700" : "text-emerald-700"}`}>{dinheiro(resultado)}</td>
              </tr>
            </tbody>
          </table>
          <div className="space-y-2 text-sm">
            <p>
              <b>{rateio.diasTrabalhadosNoMes(mes)}</b> dia(s) com obra de <b>{diasUteis(mes)}</b> dias úteis.
              Os dias trabalhados cobriram <b>{dinheiro(coberto)}</b> dos <b>{dinheiro(fixoMes)}</b> de custo fixo.
            </p>
            {fixoMes - coberto > 0 && (
              <p className="rounded-lg bg-amber-50 p-2 text-amber-900">
                ⚠ <b>{dinheiro(fixoMes - coberto)}</b> de custo fixo caiu em dias sem obra: a empresa pagou, mas nenhuma obra cobriu.
              </p>
            )}
            <p className="text-xs text-stone-500">
              “Sobrou no mês” compara o dinheiro que entrou com o que saiu no mês. Pagamentos recebidos de obras de meses
              anteriores ou futuros fazem o resultado variar de um mês para outro.
            </p>
            {obrasDoMes.length > 0 && (
              <table className="tabela">
                <thead><tr><th>Obra</th><th className="text-right">Custo fixo no mês</th></tr></thead>
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
          <h2 className="mb-1">Custos fixos recorrentes</h2>
          <p className="mb-3 text-sm text-stone-500">
            Gastos que a empresa tem com ou sem obra. São divididos entre as obras pelos dias trabalhados.
          </p>
          {custos.length === 0 ? (
            <Vazio>Nenhum custo fixo cadastrado.</Vazio>
          ) : (
            <div className="space-y-2">
              {custos.map((c) => (
                <Formulario key={c.id} acao={salvarCustoFixo.bind(null, c.id)} className={`grid grid-cols-[6rem_1fr] items-center gap-2 rounded-lg border border-stone-200 p-2 sm:grid-cols-[6rem_1fr_auto] ${c.ativo ? "" : "opacity-50"}`}>
                  <input className="campo col-span-full" name="nome" defaultValue={c.nome} aria-label="Nome" />
                  <input className="campo" name="valor" inputMode="decimal" defaultValue={centavosParaCampo(c.valorCent)} aria-label="Valor" />
                  <select className="campo" name="periodicidade" defaultValue={c.periodicidade} aria-label="Periodicidade">
                    {Object.entries(PERIODICIDADES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                  <div className="flex items-center gap-2 text-sm">
                    <label className="flex items-center gap-1"><input type="checkbox" name="ativo" defaultChecked={c.ativo} /> ativo</label>
                    <BotaoEnviar className="botao-secundario px-2 py-1 text-sm">Salvar</BotaoEnviar>
                  </div>
                  <div className="col-span-full flex justify-between text-xs text-stone-500">
                    <span>= {dinheiro(Math.round(valorMensal(c.valorCent, c.periodicidade)))} por mês</span>
                  </div>
                </Formulario>
              ))}
            </div>
          )}
          <h3 className="mb-2 mt-4 font-semibold">Adicionar custo fixo</h3>
          <Formulario acao={salvarCustoFixo.bind(null, null)} className="grid grid-cols-[6rem_1fr] gap-2 sm:grid-cols-[6rem_1fr_auto]">
            <input className="campo col-span-full" name="nome" placeholder="Ex.: Seguro do galpão" required />
            <input className="campo" name="valor" inputMode="decimal" placeholder="0.00" required />
            <select className="campo" name="periodicidade" defaultValue="MENSAL">
              {Object.entries(PERIODICIDADES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <BotaoEnviar>Adicionar</BotaoEnviar>
          </Formulario>
          {custos.length > 0 && (
            <details className="mt-3 text-sm">
              <summary className="cursor-pointer text-stone-500">Excluir um custo fixo</summary>
              <ul className="mt-2 space-y-1">
                {custos.map((c) => (
                  <li key={c.id} className="flex items-center justify-between">
                    {c.nome}
                    <form action={excluirCustoFixo.bind(null, c.id)}>
                      <BotaoEnviar className="text-xs text-red-700 hover:underline" confirmar={`Excluir "${c.nome}"? Para parar de contar só a partir de agora, desmarque "ativo".`}>Excluir</BotaoEnviar>
                    </form>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>

        <div className="cartao overflow-x-auto">
          <h2 className="mb-1">Gastos avulsos da empresa</h2>
          <p className="mb-3 text-sm text-stone-500">
            Ferramentas e outros gastos que não são de uma obra só. Entram no custo fixo do mês em que aconteceram.
          </p>
          <Formulario acao={lancarGastoEmpresa} className="mb-4 space-y-3">
            <div className="grid gap-2 sm:grid-cols-[1fr_7rem_10rem]">
              <Campo rotulo="Descrição"><input className="campo" name="descricao" placeholder="Ex.: Serra circular DeWalt" required /></Campo>
              <Campo rotulo="Valor"><input className="campo" name="valor" inputMode="decimal" placeholder="0.00" required /></Campo>
              <Campo rotulo="Data"><input className="campo" name="data" type="date" defaultValue={campoData(new Date())} /></Campo>
            </div>
            <FotoRecibo rotulo="Recibo (opcional)" />
            <BotaoEnviar>Lançar gasto</BotaoEnviar>
          </Formulario>
          <h3 className="mb-2 font-semibold">Em {nomeMes(mes)}</h3>
          {gastos.length === 0 ? (
            <Vazio>Nenhum gasto avulso neste mês.</Vazio>
          ) : (
            <table className="tabela">
              <tbody>
                {gastos.map((g) => (
                  <tr key={g.id}>
                    <td className="whitespace-nowrap">{data(g.data)}</td>
                    <td>{g.descricao}</td>
                    <td className="text-right tabular-nums">{dinheiro(g.valorCent)}</td>
                    <td>{g.comprovante ? <a href={`/api/comprovantes/${g.comprovante}`} target="_blank" className="link">Ver</a> : "—"}</td>
                    <td>
                      <form action={excluirGastoEmpresa.bind(null, g.id)}>
                        <BotaoEnviar className="text-xs text-red-700 hover:underline" confirmar="Excluir este gasto?">Excluir</BotaoEnviar>
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
