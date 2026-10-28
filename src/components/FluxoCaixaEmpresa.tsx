"use client";

import { useEffect, useRef, useState } from "react";
import { dinheiro } from "@/lib/moeda";
import { useT } from "@/i18n/cliente";
import type { FluxoCaixa, Grupo } from "@/lib/planilha-fluxo";

const CORES: Record<Grupo, string> = { OBRA: "bg-amber-500", FIXO: "bg-sky-500", SOCIOS: "bg-violet-500" };
const NOMES: Record<Grupo, string> = { OBRA: "Custos diretos das obras", FIXO: "Custos fixos da empresa", SOCIOS: "Retiradas dos sócios" };

/**
 * Resumo do fluxo de caixa da planilha do Drive, pensado para a tela do celular:
 * escolhe o mês (ou o acumulado) e vê entradas, saídas por grupo, resultado e saldo.
 */
export function FluxoCaixaEmpresa({ fluxo }: { fluxo: FluxoCaixa }) {
  const t = useT();
  const n = fluxo.meses.length;
  // Abre no último mês com movimento
  const ultimo = Math.max(0, ...fluxo.meses.map((_, m) => m).filter((m) => fluxo.totalEntradas[m] || fluxo.totalSaidas[m]));
  const [sel, setSel] = useState<number>(ultimo);
  const todos = sel === -1;
  const selecionado = useRef<HTMLButtonElement>(null);
  // No celular o mês escolhido pode ficar fora da tela: rola a fila de meses até ele
  // (chaves no corpo: no Chrome novo scrollIntoView devolve uma Promise, que o React tomaria por função de limpeza)
  useEffect(() => {
    selecionado.current?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [sel]);

  const v = (valores: number[]) => (todos ? valores.reduce((s, x) => s + x, 0) : valores[sel] ?? 0);
  const entradas = v(fluxo.totalEntradas);
  const saidas = v(fluxo.totalSaidas);
  const resultado = v(fluxo.resultado);
  const saldoInicial = todos ? fluxo.saldoInicial[0] ?? 0 : fluxo.saldoInicial[sel] ?? 0;
  const saldoFinal = todos ? fluxo.saldoFinal[n - 1] ?? 0 : fluxo.saldoFinal[sel] ?? 0;
  const extrato = fluxo.extrato ? (todos ? fluxo.extrato[n - 1] : fluxo.extrato[sel]) : null;

  const grupos = (Object.keys(NOMES) as Grupo[]).map((g) => {
    const itens = fluxo.saidas
      .filter((s) => s.grupo === g)
      .map((s) => ({ item: s.item, valor: v(s.valores) }))
      .filter((s) => s.valor !== 0)
      .sort((a, b) => b.valor - a.valor);
    return { g, itens, total: itens.reduce((s, i) => s + i.valor, 0) };
  });
  const custoObra = grupos.find((x) => x.g === "OBRA")!.total;
  const custoFixo = grupos.find((x) => x.g === "FIXO")!.total;
  const custoEmpresa = custoObra + custoFixo;
  const multiplicador = custoEmpresa > 0 ? entradas / custoEmpresa : 0;
  const maiorResultado = Math.max(1, ...fluxo.resultado.map(Math.abs));

  return (
    <div className="space-y-4">
      {/* Meses: rolam de lado no celular */}
      <div className="-mx-4 overflow-x-auto px-4">
        <div className="flex w-max gap-2 pb-1">
          {fluxo.meses.map((m, i) => (
            <button
              key={m}
              ref={sel === i ? selecionado : undefined}
              type="button"
              onClick={() => setSel(i)}
              className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${sel === i ? "border-marca-600 bg-marca-600 text-white" : "border-stone-300 bg-white text-stone-700"}`}
            >
              {m}
            </button>
          ))}
          <button
            ref={todos ? selecionado : undefined}
            type="button"
            onClick={() => setSel(-1)}
            className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${todos ? "border-marca-600 bg-marca-600 text-white" : "border-stone-300 bg-white text-stone-700"}`}
          >
            {t("Acumulado")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Bloco rotulo={t("Entrou")} valor={dinheiro(entradas)} cor="text-emerald-700" />
        <Bloco rotulo={t("Saiu")} valor={dinheiro(saidas)} cor="text-red-700" />
        <Bloco rotulo={t("Resultado")} valor={dinheiro(resultado)} cor={resultado < 0 ? "text-red-700" : "text-emerald-700"} />
        <Bloco
          rotulo={t("Saldo em caixa")}
          valor={dinheiro(saldoFinal)}
          detalhe={t("Começou com {valor}", { valor: dinheiro(saldoInicial) })}
        />
      </div>

      {extrato !== null && extrato !== undefined && (
        <p className={`rounded-lg p-2 text-sm ${extrato === saldoFinal ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-900"}`}>
          {extrato === saldoFinal
            ? t("✓ Bate com o extrato do banco ({valor}).", { valor: dinheiro(extrato) })
            : t("⚠ Extrato do banco: {valor}. Diferença de {dif}.", { valor: dinheiro(extrato), dif: dinheiro(saldoFinal - extrato) })}
        </p>
      )}

      {custoEmpresa > 0 && (
        <div className={`rounded-lg p-3 text-sm ${multiplicador >= 2 ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-900"}`}>
          <b>{t("Multiplicador: {x}x", { x: multiplicador.toFixed(2) })}</b>{" "}
          {t("(entradas ÷ custos de obra e fixos, sem as retiradas). Meta: 2x.")}
          {multiplicador < 2 && <> {t("Para chegar a 2x faltaram {valor}.", { valor: dinheiro(custoEmpresa * 2 - entradas) })}</>}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <Grupo titulo={t("Entradas")} total={entradas} cor="bg-emerald-500" itens={fluxo.entradas.map((e) => ({ item: e.item, valor: v(e.valores) })).filter((e) => e.valor !== 0)} />
          {grupos.map(({ g, itens, total }) =>
            itens.length ? <Grupo key={g} titulo={t(NOMES[g])} total={total} cor={CORES[g]} itens={itens} negativo /> : null,
          )}
        </div>

        <div className="cartao">
          <h3 className="mb-2 font-semibold">{t("Resultado mês a mês")}</h3>
          <ul className="space-y-1.5">
            {fluxo.meses.map((m, i) => {
              const r = fluxo.resultado[i] ?? 0;
              return (
                <li key={m}>
                  <button type="button" onClick={() => setSel(i)} className="grid w-full grid-cols-[2.5rem_1fr_6.5rem] items-center gap-2 text-left text-sm">
                    <span className={sel === i ? "font-bold" : "text-stone-600"}>{m}</span>
                    <span className="relative h-4 rounded bg-stone-100">
                      <span
                        className={`absolute inset-y-0 left-0 rounded ${r < 0 ? "bg-red-400" : "bg-emerald-500"}`}
                        style={{ width: `${Math.max(2, (Math.abs(r) / maiorResultado) * 100)}%` }}
                      />
                    </span>
                    <span className={`text-right tabular-nums ${r < 0 ? "text-red-700" : "text-emerald-700"}`}>{dinheiro(r)}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-xs text-stone-500">
            {t("Resultado = tudo o que entrou − tudo o que saiu no mês, incluindo as retiradas dos sócios.")}
          </p>
        </div>
      </div>

      <p className="text-xs text-stone-500">
        {t("Fonte: planilha “{nome}” no Google Drive.", { nome: fluxo.planilha.nome })}{" "}
        {fluxo.planilha.link !== "#" && <a href={fluxo.planilha.link} target="_blank" rel="noreferrer" className="link">{t("Abrir no Drive")}</a>}
      </p>
    </div>
  );
}

function Bloco({ rotulo, valor, cor = "text-stone-900", detalhe }: { rotulo: string; valor: string; cor?: string; detalhe?: string }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50 p-3">
      <div className="text-xs font-medium uppercase tracking-wide text-stone-500">{rotulo}</div>
      <div className={`mt-0.5 text-lg font-bold tabular-nums ${cor}`}>{valor}</div>
      {detalhe && <div className="text-xs text-stone-500">{detalhe}</div>}
    </div>
  );
}

function Grupo({ titulo, total, cor, itens, negativo }: { titulo: string; total: number; cor: string; itens: { item: string; valor: number }[]; negativo?: boolean }) {
  const maior = Math.max(1, ...itens.map((i) => Math.abs(i.valor)));
  return (
    <details className="cartao" open={!negativo}>
      <summary className="flex cursor-pointer items-center justify-between gap-2">
        <span className="flex items-center gap-2 font-semibold"><span className={`h-3 w-3 rounded-full ${cor}`} />{titulo}</span>
        <span className={`tabular-nums font-semibold ${negativo ? "text-red-700" : "text-emerald-700"}`}>{negativo ? "− " : ""}{dinheiro(total)}</span>
      </summary>
      <ul className="mt-3 space-y-2">
        {itens.map((i) => (
          <li key={i.item} className="text-sm">
            <div className="flex justify-between gap-2">
              <span>{i.item}</span>
              <span className="tabular-nums">{dinheiro(i.valor)}</span>
            </div>
            <div className="mt-0.5 h-1.5 rounded bg-stone-100">
              <div className={`h-1.5 rounded ${cor}`} style={{ width: `${Math.max(2, (Math.abs(i.valor) / maior) * 100)}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </details>
  );
}
