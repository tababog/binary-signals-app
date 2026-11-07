"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { responderProposta, type EstadoResposta } from "@/app/p/[token]/actions";
import { ACEITE_TRABALHO_EXTRA, FORMAS_PAGAMENTO_PROPOSTA } from "@/lib/pagamento-proposta";
import type { OpcaoProposta } from "@/lib/proposta";

const dolar = (c: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: c % 100 ? 2 : 0 }).format(c / 100);

const OBRIGADO: Record<string, string> = {
  APROVADA: "Thank you! Your approval and signature were received. We will contact you shortly with the contract and the start date.",
  RECUSADA: "Thank you for letting us know. If anything changes, we would be glad to help with your project.",
  FALAR: "Thank you! Alessandro or Emmanuel will contact you soon.",
};

function Botoes({ escolher }: { escolher: (acao: string) => void }) {
  const { pending } = useFormStatus();
  return (
    <div className="grid gap-2 sm:grid-cols-[2fr_1fr_1fr]">
      <button type="submit" disabled={pending} onClick={() => escolher("APROVAR")} className="rounded-xl bg-marca-600 px-3 py-3 text-base font-bold text-white hover:bg-marca-700 disabled:opacity-60">
        {pending ? "Sending..." : "Approve selected option"}
      </button>
      <button type="submit" disabled={pending} onClick={() => escolher("RECUSAR")} className="rounded-xl border-2 border-red-300 bg-white px-3 py-3 font-bold text-red-700 disabled:opacity-60">
        Decline
      </button>
      <button type="submit" disabled={pending} onClick={() => escolher("FALAR")} className="rounded-xl border-2 border-logo bg-white px-3 py-3 font-bold text-logo disabled:opacity-60">
        I&apos;d like to talk
      </button>
    </div>
  );
}

/** Opções, assinatura na tela e os botões aprovar / recusar / falar da proposta para o cliente (inglês). */
export function RespostaProposta({ token, opcoes, hoje, previa }: { token: string; opcoes: OpcaoProposta[]; hoje: string; previa: boolean }) {
  const [estado, despachar] = useFormState<EstadoResposta, FormData>(responderProposta.bind(null, token), undefined);
  const [escolhida, setEscolhida] = useState<number | null>(null);
  const [forma, setForma] = useState<string | null>(null);
  const opcaoEscolhida = opcoes.find((o) => o.ordem === escolhida);
  const [erro, setErro] = useState<string | null>(null);
  const acao = useRef<HTMLInputElement>(null);
  const assinaturaCampo = useRef<HTMLInputElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const desenhando = useRef(false);
  const assinou = useRef(false);

  function preparar() {
    const c = canvas.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    c.width = Math.round(r.width * 2);
    c.height = Math.round(r.height * 2);
    const x = c.getContext("2d")!;
    x.scale(2, 2);
    x.lineWidth = 2.2;
    x.lineCap = "round";
    x.lineJoin = "round";
    x.strokeStyle = "#1b3f7d";
    assinou.current = false;
    if (assinaturaCampo.current) assinaturaCampo.current.value = "";
  }
  useEffect(preparar, []);

  const ponto = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top] as const;
  };

  if (estado?.ok) {
    return <div className="rounded-2xl bg-emerald-50 p-4 font-semibold text-emerald-800">{OBRIGADO[estado.ok]}</div>;
  }

  return (
    <form
      action={despachar}
      onSubmit={(e) => {
        setErro(null);
        if (previa) {
          e.preventDefault();
          setErro("Preview only: answers are disabled while you are logged in to the Tababog app.");
          return;
        }
        if (acao.current?.value !== "APROVAR") return;
        if (escolhida === null) {
          e.preventDefault();
          setErro("Please choose Option 1 or Option 2 above.");
        } else if (opcaoEscolhida && opcaoEscolhida.pagamentos.length > 1 && !forma) {
          e.preventDefault();
          setErro("Please choose how you would like to pay.");
        } else if (!(e.currentTarget.elements.namedItem("nome") as HTMLInputElement).value.trim()) {
          e.preventDefault();
          setErro("Please type your full name.");
        } else if (!assinou.current) {
          e.preventDefault();
          setErro("Please sign in the box.");
        } else if (!(e.currentTarget.elements.namedItem("aceiteExtras") as HTMLInputElement).checked) {
          e.preventDefault();
          setErro("Please confirm that you understand the extra work terms.");
        }
      }}
      className="space-y-4"
    >
      <input type="hidden" name="acao" ref={acao} />
      <input type="hidden" name="assinatura" ref={assinaturaCampo} />
      <div className={`grid gap-3 ${opcoes.length > 1 ? "md:grid-cols-2" : ""}`}>
        {opcoes.map((o, i) => (
          <label
            key={o.ordem}
            className={`flex cursor-pointer flex-col gap-2 rounded-2xl border-2 p-4 ${escolhida === o.ordem ? "border-marca-600 ring-4 ring-marca-100" : "border-stone-200"}`}
          >
            <span className="text-xl font-bold text-logo">Option {i + 1} · {o.nome}</span>
            {o.descricao && <span className="whitespace-pre-line text-sm">{o.descricao}</span>}
            {(o.escopo?.length ?? 0) > 0 && (
              <span className="block">
                <span className="block text-xs font-bold uppercase tracking-wide text-stone-500">Scope of work</span>
                <ul className="mt-1 space-y-1 text-sm">
                  {o.escopo!.map((l, k) => (
                    <li key={k} className="flex gap-2">
                      <span className="text-emerald-700" aria-hidden="true">✓</span>
                      <span>{l}</span>
                    </li>
                  ))}
                </ul>
              </span>
            )}
            {o.itens.length > 0 && (
              <span className="block">
                <span className="block text-xs font-bold uppercase tracking-wide text-stone-500">Materials and items included</span>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
                  {o.itens.map((it, k) => <li key={k}>{it}</li>)}
                </ul>
              </span>
            )}
            {o.dias > 0 && <span className="text-sm text-stone-600">About {o.dias} working {o.dias === 1 ? "day" : "days"}</span>}
            <span className="mt-auto block border-t border-stone-200 pt-3">
              <span className="block text-xs font-bold uppercase tracking-wide text-stone-500">Price for this option</span>
              <span className="block text-3xl font-extrabold tabular-nums text-logo">{dolar(o.precoCent)}</span>
            </span>
            <span className="rounded-lg bg-stone-50 px-3 py-2 text-sm">
              <b>Payment:</b>{" "}
              {o.pagamentos.length === 1 ? FORMAS_PAGAMENTO_PROPOSTA[o.pagamentos[0]].texto : `your choice of ${o.pagamentos.map((f) => FORMAS_PAGAMENTO_PROPOSTA[f].nome).join(" or ")}`}
            </span>
            <span className="flex items-center gap-2 pt-1 font-bold text-logo">
              <input
                type="radio"
                name="opcao"
                value={o.ordem}
                checked={escolhida === o.ordem}
                onChange={() => {
                  setEscolhida(o.ordem);
                  setForma(null);
                }}
                className="h-5 w-5 accent-marca-600"
              />
              Choose Option {i + 1}
            </span>
          </label>
        ))}
      </div>

      {opcaoEscolhida && opcaoEscolhida.pagamentos.length > 1 && (
        <fieldset className="rounded-2xl border-2 border-marca-600 p-4">
          <legend className="px-1 font-bold text-logo">How would you like to pay?</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {opcaoEscolhida.pagamentos.map((f) => (
              <label key={f} className={`flex cursor-pointer gap-3 rounded-xl border-2 p-3 ${forma === f ? "border-marca-600 bg-marca-50" : "border-stone-200"}`}>
                <input type="radio" name="pagamento" value={f} checked={forma === f} onChange={() => setForma(f)} className="mt-1 h-5 w-5 accent-marca-600" />
                <span>
                  <b className="block text-logo">{FORMAS_PAGAMENTO_PROPOSTA[f].nome}</b>
                  <span className="text-sm text-stone-600">{FORMAS_PAGAMENTO_PROPOSTA[f].texto}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="grid gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-4">
        <label className="text-sm font-semibold" htmlFor="nome">Full name</label>
        <input id="nome" name="nome" autoComplete="name" className="w-full rounded-lg border border-stone-300 bg-white p-3 text-base" placeholder="Your full name" />
        <span className="text-sm font-semibold">Signature</span>
        <canvas
          ref={canvas}
          className="h-40 w-full touch-none rounded-lg border border-dashed border-stone-400 bg-white"
          aria-label="Signature box"
          onPointerDown={(e) => {
            desenhando.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            const x = e.currentTarget.getContext("2d")!;
            x.beginPath();
            x.moveTo(...ponto(e));
          }}
          onPointerMove={(e) => {
            if (!desenhando.current) return;
            const x = e.currentTarget.getContext("2d")!;
            x.lineTo(...ponto(e));
            x.stroke();
            assinou.current = true;
          }}
          onPointerUp={(e) => {
            desenhando.current = false;
            if (assinou.current && assinaturaCampo.current) assinaturaCampo.current.value = e.currentTarget.toDataURL("image/png");
          }}
        />
        <div className="flex justify-between text-sm text-stone-600">
          <span>Sign with your finger or mouse · Date: {hoje}</span>
          <button type="button" onClick={preparar} className="text-logo underline">Clear</button>
        </div>
        <label className="flex items-start gap-3 rounded-lg border border-stone-300 bg-white p-3 text-sm">
          <input type="checkbox" name="aceiteExtras" className="mt-0.5 h-5 w-5 flex-none accent-marca-600" />
          <span>{ACEITE_TRABALHO_EXTRA}</span>
        </label>
        <label className="text-sm font-semibold" htmlFor="mensagem">Message for us (optional)</label>
        <textarea id="mensagem" name="mensagem" rows={2} className="w-full rounded-lg border border-stone-300 bg-white p-3 text-base" placeholder="Questions, best time to call..." />
        <Botoes escolher={(a) => { if (acao.current) acao.current.value = a; }} />
        {(erro || estado?.erro) && <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-800">{erro ?? estado?.erro}</p>}
      </div>
    </form>
  );
}
