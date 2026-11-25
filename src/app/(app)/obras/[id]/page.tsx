import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { campoData, centavosParaCampo, data, dinheiro, hora, horas } from "@/lib/format";
import { FORMAS_PAGAMENTO } from "@/lib/constantes";
import { CATEGORIAS_ORCAMENTO, nomeCategoria, nomeStatus } from "@/lib/constantes";
import { custoPonto, duracaoMs, resumoObra } from "@/lib/financeiro";
import { Cabecalho, Campo, Indicador, SeloStatus, Vazio, Voltar } from "@/components/ui";
import { Formulario } from "@/components/Formulario";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { SeloLocal } from "@/components/SeloLocal";
import { TextoUsuario } from "@/components/TextoUsuario";
import { adicionarExtra, adicionarItemOrcamento, excluirExtra, excluirLancamento, marcarExtrasCobrados, receberExtra, removerItemOrcamento, salvarExtra } from "../actions";
import { SITUACOES_EXTRA, mensagemExtras, situacaoExtra } from "@/lib/extras";
import { META_MULTIPLICADOR } from "@/lib/precos";
import { traduzirTextos } from "@/lib/traducao";
import { EnviarMensagem } from "@/components/EnviarMensagem";
import { getT } from "@/i18n/servidor";

const ABAS = [
  { id: "resumo", rotulo: "Resumo" },
  { id: "caixa", rotulo: "Fluxo de caixa" },
  { id: "orcamento", rotulo: "Orçamento" },
  { id: "extras", rotulo: "Extras" },
  { id: "equipe", rotulo: "Equipe e horas" },
];

export default async function Obra({ params, searchParams }: { params: { id: string }; searchParams: { aba?: string } }) {
  await exigirAdmin();
  const t = getT();
  const existe = await db.obra.findUnique({ where: { id: params.id }, select: { id: true, referencia: { select: { id: true } } } });
  if (!existe) notFound();
  const resumo = await resumoObra(params.id);
  const { obra } = resumo;
  const aba = ABAS.some((a) => a.id === searchParams.aba) ? searchParams.aba! : "resumo";

  return (
    <>
      <Voltar href="/obras" rotulo={t("Obras")} />
      <Cabecalho
        titulo={obra.nome}
        subtitulo={
          <span className="flex flex-wrap items-center gap-2">
            <Link href={`/clientes/${obra.clienteId}`} className="link">{obra.cliente.nome}</Link>
            {obra.endereco && <span>· {obra.endereco}</span>}
            <SeloStatus status={obra.status} rotulo={t(nomeStatus(obra.status))} />
          </span>
        }
      >
        <Link href={`/obras/${obra.id}/despesa`} className="botao-secundario">{t("Lançar Despesa")}</Link>
        <Link href={`/obras/${obra.id}/recebimento`} className="botao-secundario">{t("+ Pagamento do cliente")}</Link>
        <Link href={`/obras/${obra.id}/editar`} className="botao-secundario">{t("Editar")}</Link>
      </Cabecalho>

      {obra.status === "CONCLUIDA" &&
        (existe.referencia ? (
          <p className="mb-4 text-sm">
            <Link href={`/precos/${existe.referencia.id}`} className="link">{t("✓ Esta obra está no banco de preços →")}</Link>
          </p>
        ) : (
          <div className="cartao mb-4 border-amber-200 bg-amber-50">
            <p className="mb-2 text-sm text-amber-900">{t("Obra concluída: leve os números reais para o banco de preços, para precificar as próximas.")}</p>
            <Link href={`/precos/novo?obra=${obra.id}`} className="botao">{t("Salvar no banco de preços")}</Link>
          </div>
        ))}

      <div className="mb-4 flex gap-1 overflow-x-auto border-b border-stone-200">
        {ABAS.map((a) => (
          <Link
            key={a.id}
            href={`/obras/${obra.id}?aba=${a.id}`}
            className={`whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium ${aba === a.id ? "border-marca-600 text-marca-700" : "border-transparent text-stone-500"}`}
          >
            {t(a.rotulo)}
            {a.id === "extras" && resumo.extras.quantidade > 0 && (
              <span className={`ml-1 rounded-full px-1.5 text-xs ${resumo.extras.aCobrar > 0 ? "bg-amber-100 text-amber-900" : "bg-stone-100 text-stone-600"}`}>{resumo.extras.quantidade}</span>
            )}
          </Link>
        ))}
      </div>

      {aba === "resumo" && <AbaResumo resumo={resumo} />}
      {aba === "caixa" && <AbaCaixa obraId={obra.id} />}
      {aba === "orcamento" && <AbaOrcamento obraId={obra.id} resumo={resumo} />}
      {aba === "extras" && <AbaExtras obraId={obra.id} />}
      {aba === "equipe" && <AbaEquipe obraId={obra.id} />}
    </>
  );
}

function pct(parte: number, total: number) {
  return total > 0 ? Math.round((parte / total) * 100) : 0;
}

function AbaResumo({ resumo }: { resumo: Awaited<ReturnType<typeof resumoObra>> }) {
  const t = getT();
  const { obra } = resumo;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Indicador
          rotulo={t("Valor do contrato")}
          valor={dinheiro(obra.valorContratoCent)}
          detalhe={resumo.extras.total > 0 ? t("+ extras {extras} = {total}", { extras: dinheiro(resumo.extras.total), total: dinheiro(resumo.valorTotal) }) : undefined}
        />
        <Indicador rotulo={t("Recebido do cliente")} valor={dinheiro(resumo.recebido)} detalhe={t("Falta receber {valor}", { valor: dinheiro(resumo.aReceber) })} />
        <Indicador
          rotulo={t("Custo até agora")}
          valor={dinheiro(resumo.custoTotal)}
          tom={resumo.orcadoTotal > 0 && resumo.custoTotal > resumo.orcadoTotal ? "ruim" : "neutro"}
          detalhe={t("Orçado {valor} · {n}% usado", { valor: dinheiro(resumo.orcadoTotal), n: pct(resumo.custoTotal, resumo.orcadoTotal) })}
        />
        <Indicador rotulo={t("Saldo em caixa da obra")} valor={dinheiro(resumo.saldoCaixa)} tom={resumo.saldoCaixa < 0 ? "ruim" : "bom"} detalhe={t("Recebido − gastos da obra")} />
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Indicador
          rotulo={t("Lucro previsto (orçamento)")}
          valor={dinheiro(resumo.lucroPrevisto)}
          tom={resumo.orcadoTotal > 0 && obra.valorContratoCent < resumo.orcadoTotal * 2 ? "ruim" : "neutro"}
          detalhe={resumo.orcadoTotal > 0 ? t("Contrato = {x}x o custo orçado (meta 2x)", { x: (obra.valorContratoCent / resumo.orcadoTotal).toFixed(2) }) : t("Monte o orçamento")}
        />
        <Indicador
          rotulo={obra.status === "CONCLUIDA" ? t("Lucro final") : t("Lucro se parar aqui")}
          valor={dinheiro(resumo.lucroAtual)}
          tom={resumo.lucroAtual < 0 ? "ruim" : "bom"}
          detalhe={
            obra.status === "CONCLUIDA" && resumo.custoTotal > 0
              ? t("Contrato = {x}x o custo real (meta 2x)", { x: (obra.valorContratoCent / resumo.custoTotal).toFixed(2) })
              : resumo.extras.total > 0
                ? t("Contrato + extras − custo realizado até agora")
                : t("Contrato − custo realizado até agora")
          }
        />
        <Indicador rotulo={t("Mão de obra da equipe")} valor={dinheiro(resumo.custoEquipe)} detalhe={t("{h} trabalhadas", { h: horas(resumo.horasEquipeMs) })} />
        <Indicador
          rotulo={t("Custos fixos da empresa")}
          valor={dinheiro(resumo.custoFixo)}
          detalhe={t("{n} dia(s) de obra · ~{valor}/dia", { n: resumo.diasTrabalhados, valor: dinheiro(resumo.custoFixoPorDia) })}
        />
      </div>

      <div className="cartao">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2>{t("Prazo")}</h2>
          <span className="text-sm text-stone-500">
            {t("Início {inicio} · Entrega prevista {fim}", { inicio: data(obra.dataInicio), fim: data(obra.dataPrevista) })}
            {obra.diasPrevistos > 0 && ` · ${t("{n} dias de trabalho previstos", { n: obra.diasPrevistos })}`}
          </span>
        </div>
        {obra.descricao && <p className="mt-3 whitespace-pre-line text-sm text-stone-600"><TextoUsuario texto={obra.descricao} /></p>}
      </div>

      <ComparativoOrcamento resumo={resumo} />
    </div>
  );
}

function ComparativoOrcamento({ resumo }: { resumo: Awaited<ReturnType<typeof resumoObra>> }) {
  const t = getT();
  const linhas = resumo.porCategoria.filter((c) => c.orcado > 0 || c.realizado > 0);
  return (
    <div className="cartao overflow-x-auto">
      <h2 className="mb-1">{t("Orçado x realizado")}</h2>
      <p className="mb-3 text-sm text-stone-500">{t("Mostra se o orçamento que você fez está batendo com o que está sendo gasto.")}</p>
      {linhas.length === 0 ? (
        <Vazio>{t("Monte o orçamento e lance as despesas para ver a comparação.")}</Vazio>
      ) : (
        <table className="tabela">
          <thead>
            <tr><th>{t("Categoria")}</th><th className="text-right">{t("Orçado")}</th><th className="text-right">{t("Realizado")}</th><th className="text-right">{t("Diferença")}</th><th className="w-1/4">{t("Uso")}</th></tr>
          </thead>
          <tbody>
            {linhas.map((c) => {
              const uso = pct(c.realizado, c.orcado);
              return (
                <tr key={c.categoria}>
                  <td>{t(nomeCategoria(c.categoria))}</td>
                  <td className="text-right tabular-nums">{dinheiro(c.orcado)}</td>
                  <td className="text-right tabular-nums">{dinheiro(c.realizado)}</td>
                  <td className={`text-right tabular-nums ${c.diferenca < 0 ? "text-red-700" : "text-emerald-700"}`}>{dinheiro(c.diferenca)}</td>
                  <td>
                    <div className="h-2 overflow-hidden rounded-full bg-stone-100">
                      <div className={`h-full ${uso > 100 ? "bg-red-500" : uso > 85 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${Math.min(uso, 100)}%` }} />
                    </div>
                    <div className="text-xs text-stone-500">{c.orcado > 0 ? `${uso}%` : t("sem orçamento")}</div>
                  </td>
                </tr>
              );
            })}
            <tr className="font-semibold">
              <td>{t("Total")}</td>
              <td className="text-right tabular-nums">{dinheiro(resumo.orcadoTotal)}</td>
              <td className="text-right tabular-nums">{dinheiro(resumo.custoTotal)}</td>
              <td className={`text-right tabular-nums ${resumo.orcadoTotal - resumo.custoTotal < 0 ? "text-red-700" : "text-emerald-700"}`}>{dinheiro(resumo.orcadoTotal - resumo.custoTotal)}</td>
              <td />
            </tr>
          </tbody>
        </table>
      )}
      <p className="mt-2 text-xs text-stone-500">
        {t("Mão de obra realizada = despesas de mão de obra + horas da equipe registradas no ponto × valor/hora. Custos fixos: orçado = dias previstos × custo fixo por dia; realizado = parte da obra no custo fixo de cada dia com ponto (dividido entre as obras trabalhadas no dia).")}{" "}
        <Link href="/empresa" className="link">{t("Ver custos fixos")}</Link>
      </p>
    </div>
  );
}

async function AbaCaixa({ obraId }: { obraId: string }) {
  const t = getT();
  const lancamentos = await db.lancamento.findMany({
    where: { obraId },
    include: { fornecedor: true, criadoPor: true },
    orderBy: [{ data: "desc" }, { criadoEm: "desc" }],
  });
  const entradas = lancamentos.filter((l) => l.tipo === "ENTRADA").reduce((s, l) => s + l.valorCent, 0);
  const saidas = lancamentos.filter((l) => l.tipo === "SAIDA").reduce((s, l) => s + l.valorCent, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <Indicador compacto rotulo={t("Entradas")} valor={dinheiro(entradas)} tom="bom" />
        <Indicador compacto rotulo={t("Saídas")} valor={dinheiro(saidas)} tom="ruim" />
        <Indicador compacto rotulo={t("Saldo")} valor={dinheiro(entradas - saidas)} tom={entradas - saidas < 0 ? "ruim" : "bom"} detalhe={t("Sem contar horas da equipe")} />
      </div>
      <div className="cartao">
        {lancamentos.length === 0 ? (
          <Vazio>{t("Nenhum lançamento ainda. Use “Lançar Despesa” ou “Pagamento do cliente”.")}</Vazio>
        ) : (
          <ul className="divide-y divide-stone-100">
            {lancamentos.map((l) => (
              <li key={l.id} className="py-3">
                <div className="flex items-start justify-between gap-3">
                  <Link href={`/obras/${obraId}/lancamento/${l.id}`} className="min-w-0">
                    <span className="block text-xs text-stone-500">{data(l.data)} · {t(nomeCategoria(l.categoria))}</span>
                    <span className="block font-medium"><TextoUsuario texto={l.descricao} /></span>
                    <span className="block text-xs text-stone-500">
                      {[l.fornecedor?.nome, l.formaPagamento && t(l.formaPagamento), t("por {nome}", { nome: l.criadoPor.nome })].filter(Boolean).join(" · ")}
                    </span>
                  </Link>
                  <span className={`whitespace-nowrap text-right font-medium tabular-nums ${l.tipo === "ENTRADA" ? "text-emerald-700" : "text-red-700"}`}>
                    {l.tipo === "ENTRADA" ? "+" : "−"} {dinheiro(l.valorCent)}
                  </span>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
                  <Link href={`/obras/${obraId}/lancamento/${l.id}`} className="link font-semibold">{t("Editar")}</Link>
                  {l.comprovante && <a href={`/api/comprovantes/${l.comprovante}`} target="_blank" className="link">{t("Ver recibo")}</a>}
                  <form action={excluirLancamento.bind(null, l.id, false)}>
                    <BotaoEnviar className="text-sm font-semibold text-red-700 hover:underline" confirmar={t("Excluir este lançamento?")}>{t("Excluir")}</BotaoEnviar>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

async function AbaOrcamento({ obraId, resumo }: { obraId: string; resumo: Awaited<ReturnType<typeof resumoObra>> }) {
  const t = getT();
  const itens = await db.itemOrcamento.findMany({ where: { obraId }, orderBy: [{ categoria: "asc" }, { descricao: "asc" }] });
  return (
    <div className="space-y-4">
      <div className="cartao">
        <h2 className="mb-3">{t("Adicionar item ao orçamento")}</h2>
        <Formulario acao={adicionarItemOrcamento.bind(null, obraId)} className="grid gap-3 sm:grid-cols-[1fr_2fr_1fr_auto] sm:items-end">
          <Campo rotulo={t("Categoria")}>
            <select className="campo" name="categoria" defaultValue="MATERIAL">
              {Object.entries(CATEGORIAS_ORCAMENTO).map(([k, v]) => <option key={k} value={k}>{t(v)}</option>)}
            </select>
          </Campo>
          <Campo rotulo={t("Descrição")}>
            <input className="campo" name="descricao" placeholder={t("Ex.: Madeira tratada para o deck")} required />
          </Campo>
          <Campo rotulo={t("Valor previsto")}>
            <input className="campo" name="valor" inputMode="decimal" placeholder="0.00" required />
          </Campo>
          <BotaoEnviar>{t("Adicionar")}</BotaoEnviar>
        </Formulario>
      </div>

      <div className="cartao overflow-x-auto">
        <div className="mb-3 flex flex-wrap justify-between gap-2">
          <h2>{t("Itens do orçamento")}</h2>
          <span className="text-sm">
            {t("Total orçado")} <b>{dinheiro(resumo.orcadoTotal)}</b> · {t("Contrato")} <b>{dinheiro(resumo.obra.valorContratoCent)}</b> · {t("Margem prevista")}{" "}
            <b className={resumo.lucroPrevisto < 0 ? "text-red-700" : "text-emerald-700"}>{dinheiro(resumo.lucroPrevisto)}</b>
          </span>
        </div>
        {itens.length === 0 ? (
          <Vazio>{t("Nenhum item. Adicione os custos previstos da obra por categoria.")}</Vazio>
        ) : (
          <table className="tabela">
            <thead><tr><th>{t("Categoria")}</th><th>{t("Descrição")}</th><th className="text-right">{t("Valor")}</th><th /></tr></thead>
            <tbody>
              {itens.map((i) => (
                <tr key={i.id}>
                  <td>{t(nomeCategoria(i.categoria))}</td>
                  <td><TextoUsuario texto={i.descricao} /></td>
                  <td className="text-right tabular-nums">{dinheiro(i.valorCent)}</td>
                  <td className="text-right">
                    <form action={removerItemOrcamento.bind(null, i.id)}>
                      <BotaoEnviar className="text-xs text-red-700 hover:underline" confirmar={t("Remover este item?")}>{t("Remover")}</BotaoEnviar>
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
  const t = getT();
  const registros = await db.registroPonto.findMany({ where: { obraId }, include: { usuario: true, obra: true }, orderBy: { entrada: "desc" } });

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
          <h2 className="mb-2">{t("Na obra agora")}</h2>
          <ul className="text-sm">
            {agora.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-2">
                {t("{nome} — entrou às {hora} ({data})", { nome: r.usuario.nome, hora: hora(r.entrada), data: data(r.entrada) })}
                <SeloLocal lat={r.latEntrada} lng={r.lngEntrada} precisao={r.precisaoEntrada} obra={r.obra} />
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="cartao overflow-x-auto">
        <h2 className="mb-3">{t("Horas por funcionário")}</h2>
        {porFuncionario.size === 0 ? (
          <Vazio>{t("Nenhuma hora registrada nesta obra.")}</Vazio>
        ) : (
          <table className="tabela">
            <thead><tr><th>{t("Funcionário")}</th><th className="text-right">{t("Dias")}</th><th className="text-right">{t("Horas")}</th><th className="text-right">{t("Custo")}</th></tr></thead>
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
        <Link href={`/registros?obra=${obraId}`} className="link mt-3 inline-block text-sm">{t("Ver e corrigir registros de ponto →")}</Link>
      </div>
    </div>
  );
}

async function AbaExtras({ obraId }: { obraId: string }) {
  const t = getT();
  const [obra, extras] = await Promise.all([
    db.obra.findUniqueOrThrow({ where: { id: obraId }, include: { cliente: true } }),
    db.extraObra.findMany({ where: { obraId }, orderBy: [{ data: "desc" }, { criadoEm: "desc" }], include: { lancamento: { select: { data: true, formaPagamento: true } } } }),
  ]);
  const total = extras.reduce((s, e) => s + e.valorCent, 0);
  const pago = extras.filter((e) => e.lancamentoId).reduce((s, e) => s + e.valorCent, 0);
  const abertos = extras.filter((e) => !e.lancamentoId);
  const aCobrar = abertos.filter((e) => !e.cobradoEm);
  // Mensagem de cobrança em inglês (regra 9) com os extras ainda não pagos
  const descricoesEn = abertos.length > 0 ? await traduzirTextos(abertos.map((e) => e.descricao), "en").catch(() => abertos.map((e) => e.descricao)) : [];
  const mensagem = mensagemExtras(
    obra.cliente.nome,
    obra.endereco || obra.nome,
    abertos.map((e, i) => ({ descricao: descricoesEn[i], valor: dinheiro(e.valorCent) })),
    dinheiro(abertos.reduce((s, e) => s + e.valorCent, 0)),
  );
  const selo: Record<string, string> = {
    A_COBRAR: "bg-amber-100 text-amber-900",
    COBRADO: "bg-sky-100 text-sky-900",
    PAGO: "bg-emerald-100 text-emerald-800",
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <Indicador compacto rotulo={t("Extras")} valor={dinheiro(total)} detalhe={t("{n} trabalho(s)", { n: extras.length })} />
        <Indicador compacto rotulo={t("Pago")} valor={dinheiro(pago)} tom="bom" />
        <Indicador compacto rotulo={t("Falta receber")} valor={dinheiro(total - pago)} tom={total - pago > 0 ? "ruim" : "neutro"} />
      </div>

      <div className="cartao">
        <h2 className="mb-1">{t("Adicionar trabalho extra")}</h2>
        <p className="mb-3 text-sm text-stone-600">{t("O que o cliente pediu além do combinado. Fica separado aqui para cobrar à parte.")}</p>
        <Formulario acao={adicionarExtra.bind(null, obraId)} limparAoSalvar className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Campo rotulo={t("O que é o extra *")}>
              <input className="campo" name="descricao" required placeholder={t("Ex.: Pintar o teto do porão")} />
            </Campo>
          </div>
          <Campo rotulo={t("Valor para cobrar do cliente *")}>
            <input className="campo text-lg" name="valor" inputMode="decimal" required placeholder="0.00" />
          </Campo>
          <Campo rotulo={t("Custo estimado (opcional)")}>
            <input className="campo" name="custo" inputMode="decimal" placeholder="0.00" />
          </Campo>
          <Campo rotulo={t("Data do pedido")}>
            <input className="campo" name="data" type="date" defaultValue={campoData(new Date())} />
          </Campo>
          <Campo rotulo={t("Observação")}>
            <input className="campo" name="observacao" placeholder={t("Ex.: pedido pelo WhatsApp")} />
          </Campo>
          <div className="sm:col-span-2"><BotaoEnviar className="botao w-full">{t("Adicionar extra")}</BotaoEnviar></div>
        </Formulario>
      </div>

      <div className="cartao">
        <h2 className="mb-2">{t("Trabalhos extras")}</h2>
        {extras.length === 0 ? (
          <Vazio>{t("Nenhum extra nesta obra.")}</Vazio>
        ) : (
          <ul className="divide-y divide-stone-100">
            {extras.map((e) => {
              const sit = situacaoExtra(e);
              const mult = e.custoCent > 0 ? e.valorCent / e.custoCent : null;
              return (
                <li key={e.id} className="py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="block text-xs text-stone-500">{data(e.data)}</span>
                      <span className="block font-medium"><TextoUsuario texto={e.descricao} /></span>
                      <span className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
                        <span className={`selo ${selo[sit]}`}>{t(SITUACOES_EXTRA[sit])}</span>
                        {mult !== null && (
                          <span className={`selo tabular-nums ${mult >= META_MULTIPLICADOR ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                            {mult.toFixed(2)}x
                          </span>
                        )}
                        {e.lancamento && <span className="text-stone-500">{t("pago em {data}", { data: data(e.lancamento.data) })}{e.lancamento.formaPagamento && ` · ${t(e.lancamento.formaPagamento)}`}</span>}
                        {sit === "COBRADO" && e.cobradoEm && <span className="text-stone-500">{t("cobrado em {data}", { data: data(e.cobradoEm) })}</span>}
                      </span>
                      {e.observacao && <span className="mt-1 block text-xs text-stone-500"><TextoUsuario texto={e.observacao} /></span>}
                      {mult !== null && mult < META_MULTIPLICADOR && (
                        <span className="mt-1 block text-xs font-semibold text-red-800">{t("⚠ Abaixo da meta 2x. Para chegar ao dobro, o preço seria {valor}.", { valor: dinheiro(e.custoCent * 2) })}</span>
                      )}
                    </div>
                    <span className="whitespace-nowrap font-semibold tabular-nums">{dinheiro(e.valorCent)}</span>
                  </div>
                  <div className="mt-2 space-y-2">
                    {!e.lancamentoId && (
                      <details className="rounded-lg border border-emerald-200 bg-emerald-50 p-2">
                        <summary className="cursor-pointer text-sm font-semibold text-emerald-800">{t("Recebi o pagamento deste extra")}</summary>
                        <Formulario acao={receberExtra.bind(null, e.id)} className="mt-2 grid gap-2 sm:grid-cols-3 sm:items-end">
                          <Campo rotulo={t("Data")}><input className="campo" name="data" type="date" defaultValue={campoData(new Date())} /></Campo>
                          <Campo rotulo={t("Forma de pagamento")}>
                            <select className="campo" name="formaPagamento" defaultValue="">
                              <option value="">—</option>
                              {FORMAS_PAGAMENTO.map((f) => <option key={f} value={f}>{t(f)}</option>)}
                            </select>
                          </Campo>
                          <BotaoEnviar className="botao">{t("Lançar no caixa")}</BotaoEnviar>
                        </Formulario>
                      </details>
                    )}
                    <details className="rounded-lg border border-stone-200 p-2">
                      <summary className="cursor-pointer text-sm font-semibold text-marca-700">{t("Editar")}</summary>
                      <Formulario acao={salvarExtra.bind(null, e.id)} className="mt-2 grid gap-2 sm:grid-cols-2">
                        <div className="sm:col-span-2"><Campo rotulo={t("O que é o extra *")}><input className="campo" name="descricao" defaultValue={e.descricao} required /></Campo></div>
                        <Campo rotulo={t("Valor para cobrar do cliente *")}><input className="campo" name="valor" inputMode="decimal" defaultValue={centavosParaCampo(e.valorCent)} required /></Campo>
                        <Campo rotulo={t("Custo estimado (opcional)")}><input className="campo" name="custo" inputMode="decimal" defaultValue={e.custoCent ? centavosParaCampo(e.custoCent) : ""} /></Campo>
                        <Campo rotulo={t("Data do pedido")}><input className="campo" name="data" type="date" defaultValue={campoData(e.data)} /></Campo>
                        <Campo rotulo={t("Observação")}><input className="campo" name="observacao" defaultValue={e.observacao ?? ""} /></Campo>
                        <div className="sm:col-span-2"><BotaoEnviar className="botao-secundario w-full">{t("Salvar")}</BotaoEnviar></div>
                      </Formulario>
                      <form action={excluirExtra.bind(null, e.id)} className="mt-2">
                        <BotaoEnviar className="text-sm font-semibold text-red-700 hover:underline" confirmar={e.lancamentoId ? t("Excluir este extra? O pagamento que já entrou continua no caixa.") : t("Excluir este extra?")}>
                          {t("Excluir extra")}
                        </BotaoEnviar>
                      </form>
                    </details>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {abertos.length > 0 && (
        <div className="cartao border-amber-200">
          <h2 className="mb-1">{t("Cobrar o cliente")}</h2>
          <p className="mb-3 text-sm text-stone-600">{t("Mensagem com os extras ainda não pagos de {cliente}. Depois de enviar, marque como cobrados.", { cliente: obra.cliente.nome })}</p>
          <EnviarMensagem mensagem={mensagem} telefone={obra.cliente.telefone} email={obra.cliente.email} assunto={`Extra work - ${obra.endereco || obra.nome}`} />
          {aCobrar.length > 0 && (
            <form action={marcarExtrasCobrados.bind(null, obraId)} className="mt-3">
              <BotaoEnviar className="botao w-full">{t("Já enviei: marcar {n} extra(s) como cobrado(s)", { n: aCobrar.length })}</BotaoEnviar>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
