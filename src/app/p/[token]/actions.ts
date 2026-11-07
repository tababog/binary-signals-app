"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { lerConteudo, substituida, vencida } from "@/lib/proposta";

export type EstadoResposta = { erro?: string; ok?: string } | undefined;

const ASSINATURA_MAX = 400_000;

/**
 * Resposta do cliente à proposta (página pública, sem login; o token do link é a autorização).
 * Aprovar exige a opção, o nome completo e a assinatura; grava data, IP e navegador.
 * Aprovada: orçamento vira "Aprovado" e a visita "Fechou contrato" (encerra os follow-ups).
 * Recusada: orçamento vira "Recusado". "Falar": avisa no Painel e o cliente ainda pode aprovar depois.
 */
export async function responderProposta(token: string, _: EstadoResposta, form: FormData): Promise<EstadoResposta> {
  const proposta = await db.proposta.findUnique({ where: { token }, include: { orcamento: true } });
  if (!proposta) return { erro: "This proposal link is not valid." };
  if (proposta.resposta === "APROVADA" || proposta.resposta === "RECUSADA") return { erro: "This proposal has already been answered." };
  if (await substituida(proposta.id, proposta.orcamentoId)) return { erro: "This proposal was replaced by a newer one. Please use the latest link we sent you." };

  const acao = String(form.get("acao") ?? "");
  const nome = String(form.get("nome") ?? "").trim().slice(0, 120);
  const mensagem = String(form.get("mensagem") ?? "").trim().slice(0, 2000) || null;
  const h = headers();
  const registro = {
    respondidaEm: new Date(),
    ip: (h.get("x-forwarded-for") ?? h.get("x-real-ip") ?? "").split(",")[0].trim().slice(0, 64) || null,
    navegador: (h.get("user-agent") ?? "").slice(0, 300) || null,
    respostaVista: false,
    // Se o cliente não escreveu nada agora, mantém o recado anterior (ex.: pediu para conversar e depois respondeu)
    mensagem: mensagem ?? proposta.mensagem,
  };

  if (acao === "APROVAR") {
    if (vencida(proposta.criadaEm)) return { erro: "This proposal has expired. Please contact us for an updated estimate." };
    const ordem = Number(form.get("opcao"));
    const opcao = lerConteudo(proposta.conteudo).opcoes.find((o) => o.ordem === ordem);
    if (!opcao) return { erro: "Please choose one of the options above." };
    const forma = opcao.pagamentos.length === 1 ? opcao.pagamentos[0] : String(form.get("pagamento") ?? "");
    if (!(opcao.pagamentos as string[]).includes(forma)) return { erro: "Please choose how you would like to pay." };
    if (nome.length < 3) return { erro: "Please type your full name." };
    const assinatura = String(form.get("assinatura") ?? "");
    if (!assinatura.startsWith("data:image/png;base64,") || assinatura.length < 2000) return { erro: "Please sign in the box." };
    if (assinatura.length > ASSINATURA_MAX) return { erro: "The signature is too large. Please clear it and sign again." };
    if (form.get("aceiteExtras") !== "on") return { erro: "Please confirm that you understand the extra work terms." };

    await db.$transaction([
      db.proposta.update({ where: { id: proposta.id }, data: { ...registro, resposta: "APROVADA", opcaoOrdem: ordem, formaPagamento: forma, aceitouExtras: true, nomeAssinatura: nome, assinatura } }),
      db.orcamento.update({ where: { id: proposta.orcamentoId }, data: { status: "APROVADO" } }),
      ...(proposta.orcamento.visitaId ? [db.visita.update({ where: { id: proposta.orcamento.visitaId }, data: { resultado: "FECHOU" } })] : []),
    ]);
    revalidatePath(`/p/${token}`);
    return { ok: "APROVADA" };
  }

  if (acao === "RECUSAR") {
    await db.$transaction([
      db.proposta.update({ where: { id: proposta.id }, data: { ...registro, resposta: "RECUSADA", nomeAssinatura: nome || null } }),
      db.orcamento.update({ where: { id: proposta.orcamentoId }, data: { status: "RECUSADO" } }),
    ]);
    revalidatePath(`/p/${token}`);
    return { ok: "RECUSADA" };
  }

  if (acao === "FALAR") {
    await db.proposta.update({ where: { id: proposta.id }, data: { ...registro, resposta: "FALAR", nomeAssinatura: nome || null } });
    revalidatePath(`/p/${token}`);
    return { ok: "FALAR" };
  }

  return { erro: "Please choose an answer." };
}
