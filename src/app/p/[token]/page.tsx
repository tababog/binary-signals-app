/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { usuarioAtual } from "@/lib/auth";
import { getT } from "@/i18n/servidor";
import { Portfolio, RodapeEmpresa } from "@/components/Portfolio";
import { RespostaProposta } from "@/components/RespostaProposta";
import { CLAUSULA_TRABALHO_EXTRA, FORMAS_PAGAMENTO_PROPOSTA, VALIDADE_DIAS, lerConteudo, substituida, vencida, type FormaPagamentoProposta } from "@/lib/proposta";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your proposal · Tababog Construction", robots: { index: false, follow: false } };

const dataLonga = (d: Date) => d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/New_York" });
const dolar = (c: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: c % 100 ? 2 : 0 }).format(c / 100);

/** Proposta para o cliente (pública, por link): portfólio inteiro e, no final, o orçamento com assinatura. Sempre em inglês. */
export default async function PaginaProposta({ params }: { params: { token: string } }) {
  const proposta = await db.proposta.findUnique({ where: { token: params.token } });
  if (!proposta) notFound();

  // Administrador logado vê a prévia sem marcar como "vista" e sem poder responder
  const usuario = await usuarioAtual();
  const previa = usuario?.papel === "ADMIN";
  if (!previa && !proposta.vistaEm) await db.proposta.update({ where: { id: proposta.id }, data: { vistaEm: new Date() } });

  const c = lerConteudo(proposta.conteudo);
  const expirou = vencida(proposta.criadaEm);
  const trocada = await substituida(proposta.id, proposta.orcamentoId);
  const fechada = proposta.resposta === "APROVADA" || proposta.resposta === "RECUSADA";
  const escolhida = c.opcoes.find((o) => o.ordem === proposta.opcaoOrdem);

  return (
    <main className="min-h-screen bg-white">
      {previa && (
        <div className="bg-amber-100 px-4 py-2 text-center text-sm font-semibold text-amber-900">
          {getT()("Prévia: é assim que o cliente vê. Você está logado no app, então as respostas ficam desligadas aqui.")}
        </div>
      )}
      <Portfolio />

      <section id="estimate" className="mx-auto mt-11 max-w-4xl border-t-[6px] border-logo px-4 pt-2">
        <h2 className="mb-3 mt-6 text-2xl font-bold text-logo">Your Estimate</h2>
        <dl className="mb-4 grid gap-x-5 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div><dt className="font-semibold">Prepared for</dt><dd className="text-stone-600">{c.cliente}</dd></div>
          {c.endereco && <div><dt className="font-semibold">Project address</dt><dd className="text-stone-600">{c.endereco}</dd></div>}
          <div><dt className="font-semibold">Estimate #</dt><dd className="text-stone-600">{c.numero} · {dataLonga(proposta.criadaEm)}</dd></div>
          <div><dt className="font-semibold">Project</dt><dd className="text-stone-600">{c.projeto}</dd></div>
        </dl>

        {fechada ? (
          <div className={`rounded-2xl p-4 ${proposta.resposta === "APROVADA" ? "bg-emerald-50 text-emerald-900" : "bg-stone-100 text-stone-800"}`}>
            {proposta.resposta === "APROVADA" && escolhida ? (
              <>
                <p className="text-lg font-bold">Thank you! Your approval and signature were received.</p>
                <p className="mt-1 font-semibold">
                  Approved: {escolhida.nome} option, {dolar(escolhida.precoCent)}. Signed by {proposta.nomeAssinatura} on {dataLonga(proposta.respondidaEm!)}.
                </p>
                {proposta.assinatura && <img src={proposta.assinatura} alt="Signature" className="mt-3 h-20 rounded bg-white" />}
                {proposta.formaPagamento && (
                  <p className="mt-2 text-sm">Payment: {FORMAS_PAGAMENTO_PROPOSTA[proposta.formaPagamento as FormaPagamentoProposta]?.texto}</p>
                )}
                <p className="mt-2 text-sm">We will contact you shortly with the contract and the start date.</p>
              </>
            ) : (
              <p className="font-semibold">Thank you for letting us know. You declined this proposal. If anything changes, we would be glad to help with your project.</p>
            )}
          </div>
        ) : (
          <>
            <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-stone-600">
              <li>
                <b className="text-stone-800">Extra work:</b> {CLAUSULA_TRABALHO_EXTRA}
              </li>
              <li>This estimate is valid for {VALIDADE_DIAS} days.</li>
              <li>After you approve, you will receive the home improvement contract to sign. Under Connecticut law you may cancel within three business days.</li>
            </ul>
            {trocada ? (
              <div className="rounded-2xl bg-amber-50 p-4 font-semibold text-amber-900">This proposal was replaced by a newer one. Please use the latest link we sent you.</div>
            ) : expirou ? (
              <div className="rounded-2xl bg-amber-50 p-4 font-semibold text-amber-900">This estimate has expired. Please contact us for an updated proposal.</div>
            ) : (
              <RespostaProposta token={params.token} opcoes={c.opcoes} hoje={dataLonga(new Date())} previa={previa} />
            )}
          </>
        )}
      </section>
      <RodapeEmpresa />
    </main>
  );
}
