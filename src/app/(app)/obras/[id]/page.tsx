import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { data, dinheiro, hora, horas } from "@/lib/format";
import { CATEGORIAS_ORCAMENTO, nomeCategoria, nomeStatus } from "@/lib/constantes";
import { custoPonto, duracaoMs, resumoObra } from "@/lib/financeiro";
import { Cabecalho, Campo, Indicador, SeloStatus, Vazio, Voltar } from "@/components/ui";
import { Formulario } from "@/components/Formulario";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { adicionarItemOrcamento, atualizarProgresso, excluirLancamento, removerItemOrcamento } from "../actions";

const ABAS = [
  { id: "resumo", rotulo: "Resumo" },
  { id: "caixa", rotulo: "Fluxo de caixa" },
  { id: "orcamento", rotulo: "Orçamento" },
  { id: "equipe", rotulo: "Equipe e horas" },
];

export default async function Obra({ params, searchParams }: { params: { id: string }; searchParams: { aba?: string } }) {
  await exigirAdmin();
  const existe = await db.obra.findUnique({ where: { id: params.id }, select: { id: true } });
  if (!existe) notFound();
  const resumo = await resumoObra(params.id);
  const { obra } = resumo;
  const aba = ABAS.some((a) => a.id === searchParams.aba) ? searchParams.aba! : "resumo";

  return (
    <>
      <Voltar href="/obras" rotulo="Obras" />
      <Cabecalho
        titulo={obra.nome}
        subtitulo={
          <span className="flex flex-wrap items-center gap-2">
            <Link href={`/clientes/${obra.clienteId}`} className="link">{obra.cliente.nome}</Link>
            {obra.endereco && <span>· {obra.endereco}</span>}
            <SeloStatus status={obra.status} rotulo={nomeStatus(obra.status)} />
          </span>
        }
      >
        <Link href={`/obras/${obra.id}/despesa`} className="botao">📷 Lançar despesa</Link>
        <Link href={`/obras/${obra.id}/recebimento`} className="botao-secundario">+ Pagamento do cliente</Link>
        <Link href={`/obras/${obra.id}/editar`} className="botao-secundario">Editar</Link>
      </Cabecalho>

      <div className="mb-4 flex gap-1 overflow-x-auto border-b border-stone-200">
        {ABAS.map((a) => (
          <Link
            key={a.id}
            href={`/obras/${obra.id}?aba=${a.id}`}
            className={`whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium ${aba === a.id ? "border-marca-600 text-marca-700" : "border-transparent text-stone-500"}`}
          >
            {a.rotulo}
          </Link>
        ))}
      </div>

      {aba === "resumo" && <AbaResumo resumo={resumo} />}
      {aba === "caixa" && <AbaCaixa obraId={obra.id} />}
      {aba === "orcamento" && <AbaOrcamento obraId={obra.id} resumo={resumo} />}
      {aba === "equipe" && <AbaEquipe obraId={obra.id} />}
    </>
  );
}

function pct(parte: number, total: number) {
  return total > 0 ? Math.round((parte / total) * 100) : 0;
}

function AbaResumo({ resumo }: { resumo: Awaited<ReturnType<typeof resumoObra>> }) {
  const { obra } = resumo;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Indicador rotulo="Valor do contrato" valor={dinheiro(obra.valorContratoCent)} />
        <Indicador rotulo="Recebido do cliente" valor={dinheiro(resumo.recebido)} detalhe={`Falta receber ${dinheiro(resumo.aReceber)}`} />
        <Indicador rotulo="Custo até agora" valor={dinheiro(resumo.custoTotal)} detalhe={`Orçado: ${dinheiro(resumo.orcadoTotal)}`} />
        <Indicador rotulo="Saldo em caixa da obra" valor={dinheiro(resumo.saldoCaixa)} tom={resumo.saldoCaixa < 0 ? "ruim" : "bom"} detalhe="Recebido − custos" />
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Indicador rotulo="Lucro previsto (orçamento)" valor={dinheiro(resumo.lucroPrevisto)} detalhe={`${pct(resumo.lucroPrevisto, obra.valorContratoCent)}% do contrato`} />
        <Indicador
          rotulo={obra.status === "CONCLUIDA" ? "Lucro final" : "Lucro se parar aqui"}
          valor={dinheiro(resumo.lucroAtual)}
          tom={resumo.lucroAtual < 0 ? "ruim" : "bom"}
          detalhe="Contrato − custo realizado"
        />
        <Indicador rotulo="Mão de obra da equipe" valor={dinheiro(resumo.custoEquipe)} detalhe={`${horas(resumo.horasEquipeMs)} trabalhadas`} />
        <Indicador rotulo="Orçamento usado" valor={`${pct(resumo.custoTotal, resumo.orcadoTotal)}%`} tom={resumo.custoTotal > resumo.orcadoTotal && resumo.orcadoTotal > 0 ? "ruim" : "neutro"} detalhe={`Obra ${obra.progresso}% concluída`} />
      </div>

      <div className="cartao">
        <div className="mb-2 flex items-center justify-between">
          <h2>Andamento da obra</h2>
          <span className="text-sm text-stone-500">
            Início {data(obra.dataInicio)} · Entrega prevista {data(obra.dataPrevista)}
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-stone-100">
          <div className="h-full bg-marca-500" style={{ width: `${obra.progresso}%` }} />
        </div>
        <form action={atualizarProgresso.bind(null, obra.id)} className="mt-3 flex items-center gap-2">
          <input className="campo w-24" type="number" name="progresso" min={0} max={100} defaultValue={obra.progresso} />
          <span className="text-sm">%</span>
          <BotaoEnviar className="botao-secundario">Atualizar</BotaoEnviar>
        </form>
        {obra.descricao && <p className="mt-3 whitespace-pre-line text-sm text-stone-600">{obra.descricao}</p>}
      </div>

      <ComparativoOrcamento resumo={resumo} />
    </div>
  );
}

function ComparativoOrcamento({ resumo }: { resumo: Awaited<ReturnType<typeof resumoObra>> }) {
  const linhas = resumo.porCategoria.filter((c) => c.orcado > 0 || c.realizado > 0);
  return (
    <div className="cartao overflow-x-auto">
      <h2 className="mb-1">Orçado x realizado</h2>
      <p className="mb-3 text-sm text-stone-500">Mostra se o orçamento que você fez está batendo com o que está sendo gasto.</p>
      {linhas.length === 0 ? (
        <Vazio>Monte o orçamento e lance as despesas para ver a comparação.</Vazio>
      ) : (
        <table className="tabela">
          <thead>
            <tr><th>Categoria</th><th className="text-right">Orçado</th><th className="text-right">Realizado</th><th className="text-right">Diferença</th><th className="w-1/4">Uso</th></tr>
          </thead>
          <tbody>
            {linhas.map((c) => {
              const uso = pct(c.realizado, c.orcado);
              return (
                <tr key={c.categoria}>
                  <td>{nomeCategoria(c.categoria)}</td>
                  <td className="text-right tabular-nums">{dinheiro(c.orcado)}</td>
                  <td className="text-right tabular-nums">{dinheiro(c.realizado)}</td>
                  <td className={`text-right tabular-nums ${c.diferenca < 0 ? "text-red-700" : "text-emerald-700"}`}>{dinheiro(c.diferenca)}</td>
                  <td>
                    <div className="h-2 overflow-hidden rounded-full bg-stone-100">
                      <div className={`h-full ${uso > 100 ? "bg-red-500" : uso > 85 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${Math.min(uso, 100)}%` }} />
                    </div>
                    <div className="text-xs text-stone-500">{c.orcado > 0 ? `${uso}%` : "sem orçamento"}</div>
                  </td>
                </tr>
              );
            })}
            <tr className="font-semibold">
              <td>Total</td>
              <td className="text-right tabular-nums">{dinheiro(resumo.orcadoTotal)}</td>
              <td className="text-right tabular-nums">{dinheiro(resumo.custoTotal)}</td>
              <td className={`text-right tabular-nums ${resumo.orcadoTotal - resumo.custoTotal < 0 ? "text-red-700" : "text-emerald-700"}`}>{dinheiro(resumo.orcadoTotal - resumo.custoTotal)}</td>
              <td />
            </tr>
          </tbody>
        </table>
      )}
      <p className="mt-2 text-xs text-stone-500">Mão de obra realizada = despesas de mão de obra + horas da equipe registradas no ponto × valor/hora.</p>
    </div>
  );
}

async function AbaCaixa({ obraId }: { obraId: string }) {
  const lancamentos = await db.lancamento.findMany({
    where: { obraId },
    include: { fornecedor: true, criadoPor: true },
    orderBy: [{ data: "desc" }, { criadoEm: "desc" }],
  });
  const entradas = lancamentos.filter((l) => l.tipo === "ENTRADA").reduce((s, l) => s + l.valorCent, 0);
  const saidas = lancamentos.filter((l) => l.tipo === "SAIDA").reduce((s, l) => s + l.valorCent, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <Indicador rotulo="Entradas" valor={dinheiro(entradas)} tom="bom" />
        <Indicador rotulo="Saídas" valor={dinheiro(saidas)} tom="ruim" />
        <Indicador rotulo="Saldo" valor={dinheiro(entradas - saidas)} tom={entradas - saidas < 0 ? "ruim" : "bom"} detalhe="Sem contar horas da equipe" />
      </div>
      <div className="cartao overflow-x-auto">
        {lancamentos.length === 0 ? (
          <Vazio>Nenhum lançamento ainda. Use “Lançar despesa” ou “Pagamento do cliente”.</Vazio>
        ) : (
          <table className="tabela">
            <thead>
              <tr><th>Data</th><th>Descrição</th><th className="hidden md:table-cell">Categoria</th><th className="text-right">Valor</th><th>Recibo</th><th /></tr>
            </thead>
            <tbody>
              {lancamentos.map((l) => (
                <tr key={l.id}>
                  <td className="whitespace-nowrap">{data(l.data)}</td>
                  <td>
                    {l.descricao}
                    <div className="text-xs text-stone-500">
                      {[l.fornecedor?.nome, l.formaPagamento, `por ${l.criadoPor.nome}`].filter(Boolean).join(" · ")}
                    </div>
                  </td>
                  <td className="hidden md:table-cell">{nomeCategoria(l.categoria)}</td>
                  <td className={`whitespace-nowrap text-right tabular-nums font-medium ${l.tipo === "ENTRADA" ? "text-emerald-700" : "text-red-700"}`}>
                    {l.tipo === "ENTRADA" ? "+" : "−"} {dinheiro(l.valorCent)}
                  </td>
                  <td>
                    {l.comprovante ? (
                      <a href={`/api/comprovantes/${l.comprovante}`} target="_blank" className="link">Ver</a>
                    ) : "—"}
                  </td>
                  <td>
                    <form action={excluirLancamento.bind(null, l.id)}>
                      <BotaoEnviar className="text-xs text-red-700 hover:underline" confirmar="Excluir este lançamento?">Excluir</BotaoEnviar>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

async function AbaOrcamento({ obraId, resumo }: { obraId: string; resumo: Awaited<ReturnType<typeof resumoObra>> }) {
  const itens = await db.itemOrcamento.findMany({ where: { obraId }, orderBy: [{ categoria: "asc" }, { descricao: "asc" }] });
  return (
    <div className="space-y-4">
      <div className="cartao">
        <h2 className="mb-3">Adicionar item ao orçamento</h2>
        <Formulario acao={adicionarItemOrcamento.bind(null, obraId)} className="grid gap-3 sm:grid-cols-[1fr_2fr_1fr_auto] sm:items-end">
          <Campo rotulo="Categoria">
            <select className="campo" name="categoria" defaultValue="MATERIAL">
              {Object.entries(CATEGORIAS_ORCAMENTO).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </Campo>
          <Campo rotulo="Descrição">
            <input className="campo" name="descricao" placeholder="Ex.: Alvenaria — blocos e argamassa" required />
          </Campo>
          <Campo rotulo="Valor previsto">
            <input className="campo" name="valor" inputMode="decimal" placeholder="0,00" required />
          </Campo>
          <BotaoEnviar>Adicionar</BotaoEnviar>
        </Formulario>
      </div>

      <div className="cartao overflow-x-auto">
        <div className="mb-3 flex flex-wrap justify-between gap-2">
          <h2>Itens do orçamento</h2>
          <span className="text-sm">
            Total orçado <b>{dinheiro(resumo.orcadoTotal)}</b> · Contrato <b>{dinheiro(resumo.obra.valorContratoCent)}</b> · Margem prevista{" "}
            <b className={resumo.lucroPrevisto < 0 ? "text-red-700" : "text-emerald-700"}>{dinheiro(resumo.lucroPrevisto)}</b>
          </span>
        </div>
        {itens.length === 0 ? (
          <Vazio>Nenhum item. Adicione os custos previstos da obra por categoria.</Vazio>
        ) : (
          <table className="tabela">
            <thead><tr><th>Categoria</th><th>Descrição</th><th className="text-right">Valor</th><th /></tr></thead>
            <tbody>
              {itens.map((i) => (
                <tr key={i.id}>
                  <td>{nomeCategoria(i.categoria)}</td>
                  <td>{i.descricao}</td>
                  <td className="text-right tabular-nums">{dinheiro(i.valorCent)}</td>
                  <td className="text-right">
                    <form action={removerItemOrcamento.bind(null, i.id)}>
                      <BotaoEnviar className="text-xs text-red-700 hover:underline" confirmar="Remover este item?">Remover</BotaoEnviar>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <ComparativoOrcamento resumo={resumo} />
    </div>
  );
}

async function AbaEquipe({ obraId }: { obraId: string }) {
  const registros = await db.registroPonto.findMany({ where: { obraId }, include: { usuario: true }, orderBy: { entrada: "desc" } });

  const porFuncionario = new Map<string, { nome: string; ms: number; custo: number; dias: Set<string> }>();
  for (const r of registros.filter((r) => r.saida)) {
    const atual = porFuncionario.get(r.usuarioId) ?? { nome: r.usuario.nome, ms: 0, custo: 0, dias: new Set<string>() };
    atual.ms += duracaoMs(r);
    atual.custo += custoPonto([r]);
    atual.dias.add(data(r.entrada));
    porFuncionario.set(r.usuarioId, atual);
  }
  const agora = registros.filter((r) => !r.saida);

  return (
    <div className="space-y-4">
      {agora.length > 0 && (
        <div className="cartao border-emerald-200 bg-emerald-50">
          <h2 className="mb-2">Na obra agora</h2>
          <ul className="text-sm">
            {agora.map((r) => (
              <li key={r.id}>{r.usuario.nome} — entrou às {hora(r.entrada)} ({data(r.entrada)})</li>
            ))}
          </ul>
        </div>
      )}
      <div className="cartao overflow-x-auto">
        <h2 className="mb-3">Horas por funcionário</h2>
        {porFuncionario.size === 0 ? (
          <Vazio>Nenhuma hora registrada nesta obra.</Vazio>
        ) : (
          <table className="tabela">
            <thead><tr><th>Funcionário</th><th className="text-right">Dias</th><th className="text-right">Horas</th><th className="text-right">Custo</th></tr></thead>
            <tbody>
              {[...porFuncionario.entries()].map(([id, f]) => (
                <tr key={id}>
                  <td><Link href={`/funcionarios/${id}`} className="link">{f.nome}</Link></td>
                  <td className="text-right">{f.dias.size}</td>
                  <td className="text-right tabular-nums">{horas(f.ms)}</td>
                  <td className="text-right tabular-nums">{dinheiro(f.custo)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Link href={`/registros?obra=${obraId}`} className="link mt-3 inline-block text-sm">Ver e corrigir registros de ponto →</Link>
      </div>
    </div>
  );
}
