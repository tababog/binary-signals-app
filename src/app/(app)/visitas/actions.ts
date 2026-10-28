"use server";

import { getT } from "@/i18n/servidor";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { lerDataHora, texto } from "@/lib/format";
import { PREFIXO_PERSONALIZADO, STATUS_VISITA, SUBSERVICOS, TIPOS_SERVICO } from "@/lib/constantes";
import { apagarComprovante, salvarComprovante } from "@/lib/uploads";
import type { EstadoForm } from "@/components/Formulario";
import { agendarFollowUps, CANAIS } from "@/lib/followup";
import { linkDaVisita, sincronizarAgenda } from "@/lib/agenda-google";

function atualizar() {
  revalidatePath("/visitas");
  revalidatePath("/");
}

export async function salvarVisita(id: string | null, _e: EstadoForm, form: FormData): Promise<EstadoForm> {
  await exigirAdmin();
  const dataHora = lerDataHora(form.get("dataHora"));
  if (!dataHora) return { erro: getT()("Informe a data e a hora da visita.") };
  // Serviço: um da lista, um criado antes em "Outros" ("P:<nome>") ou um novo digitado agora em "Outros"
  let tipo = String(form.get("tipoServico") ?? "");
  if (tipo === "OUTRO") {
    const nome = String(form.get("servicoOutro") ?? "").trim().slice(0, 60);
    if (!nome) return { erro: getT()("Escreva qual é o serviço em \"Outros\".") };
    await db.servicoPersonalizado.upsert({ where: { nome }, update: {}, create: { nome } });
    tipo = `${PREFIXO_PERSONALIZADO}${nome}`;
  } else if (!(tipo in TIPOS_SERVICO) && !tipo.startsWith(PREFIXO_PERSONALIZADO)) tipo = "";
  const validos = new Set((SUBSERVICOS[tipo] ?? []).flatMap((s) => [s.k, ...(s.subs ?? []).map((f) => `${s.k}.${f.k}`)]));
  const subServicos = form.getAll("subServicos").map(String).filter((c) => validos.has(c)).join(",");

  // Cliente já cadastrado ou um novo, criado aqui mesmo com nome e telefone
  let clienteId = String(form.get("clienteId") ?? "");
  if (clienteId === "NOVO" || !clienteId) {
    const nome = String(form.get("clienteNome") ?? "").trim();
    if (!nome) return { erro: getT()("Escolha o cliente ou informe o nome do cliente novo.") };
    const novo = await db.cliente.create({
      data: { nome, telefone: texto(form.get("clienteTelefone")), endereco: texto(form.get("endereco")) },
    });
    clienteId = novo.id;
  }

  const status = String(form.get("status") ?? "AGENDADA");
  // Quem vai fazer a visita: um dos sócios (administradores ativos)
  const responsavelId = String(form.get("responsavelId") ?? "");
  const responsavel = responsavelId ? await db.usuario.findFirst({ where: { id: responsavelId, papel: "ADMIN", ativo: true } }) : null;
  const dados = {
    responsavelId: responsavel?.id ?? null,
    clienteId,
    dataHora,
    endereco: texto(form.get("endereco")),
    tipoServico: tipo || null,
    subServicos: subServicos || null,
    descricao: texto(form.get("descricao")),
    status: status in STATUS_VISITA ? status : "AGENDADA",
  };
  if (id) {
    await db.visita.update({ where: { id }, data: dados });
    await sincronizarAgenda(id, linkDaVisita(id));
    const erro = await guardarFotos(id, form);
    atualizar();
    if (erro) return { erro };
    redirect("/visitas");
  }
  // Visita nova: abre a página dela já pedindo para colocar o lembrete no celular
  const visita = await db.visita.create({ data: dados });
  await sincronizarAgenda(visita.id, linkDaVisita(visita.id));
  const erro = await guardarFotos(visita.id, form);
  atualizar();
  redirect(`/visitas/${visita.id}?lembrete=1${erro ? "&erroFoto=1" : ""}`);
}

/** Guarda as fotos do trabalho enviadas no campo "fotos". Devolve a mensagem de erro, se alguma falhar. */
async function guardarFotos(visitaId: string, form: FormData) {
  for (const arquivo of form.getAll("fotos")) {
    try {
      const nome = await salvarComprovante(arquivo);
      if (nome) await db.fotoVisita.create({ data: { visitaId, arquivo: nome } });
    } catch (e) {
      return getT()((e as Error).message);
    }
  }
  return null;
}

export async function adicionarFotosVisita(visitaId: string, _e: EstadoForm, form: FormData): Promise<EstadoForm> {
  await exigirAdmin();
  const erro = await guardarFotos(visitaId, form);
  revalidatePath(`/visitas/${visitaId}`);
  return erro ? { erro } : {};
}

export async function excluirFotoVisita(fotoId: string) {
  await exigirAdmin();
  const foto = await db.fotoVisita.delete({ where: { id: fotoId } });
  await apagarComprovante(foto.arquivo);
  revalidatePath(`/visitas/${foto.visitaId}`);
}

export async function mudarStatusVisita(id: string, status: string) {
  await exigirAdmin();
  if (!(status in STATUS_VISITA)) return;
  const visita = await db.visita.update({ where: { id }, data: { status } });
  // Visita feita: começa o acompanhamento do cliente
  if (status === "REALIZADA") await agendarFollowUps(id, visita.dataHora < new Date() ? new Date() : visita.dataHora);
  // Cancelada ou realizada sai da agenda dos sócios; voltando para agendada, os lembretes são criados de novo
  await sincronizarAgenda(id, linkDaVisita(id));
  atualizar();
  revalidatePath(`/visitas/${id}`);
}

/** Resultado da negociação depois da visita: "FECHOU", "SEM_INTERESSE" ou "" para voltar a negociar. */
export async function definirResultado(id: string, resultado: string) {
  await exigirAdmin();
  await db.visita.update({
    where: { id },
    data: { resultado: resultado === "FECHOU" || resultado === "SEM_INTERESSE" ? resultado : null },
  });
  atualizar();
  revalidatePath(`/visitas/${id}`);
}

/** Registra que o follow-up foi enviado (chamado ao tocar em WhatsApp, SMS ou E-mail). */
export async function marcarFollowUpEnviado(followUpId: string, canal: string) {
  await exigirAdmin();
  if (!(canal in CANAIS)) return;
  const f = await db.followUp.update({ where: { id: followUpId }, data: { enviadoEm: new Date(), canal } });
  atualizar();
  revalidatePath(`/visitas/${f.visitaId}`);
}

export async function desfazerEnvio(followUpId: string) {
  await exigirAdmin();
  const f = await db.followUp.update({ where: { id: followUpId }, data: { enviadoEm: null, canal: null } });
  atualizar();
  revalidatePath(`/visitas/${f.visitaId}`);
}

export async function mudarDataFollowUp(followUpId: string, form: FormData) {
  await exigirAdmin();
  const data = lerDataHora(`${String(form.get("data") ?? "")}T10:00`);
  if (!data) return;
  const f = await db.followUp.update({ where: { id: followUpId }, data: { dataPrevista: data } });
  atualizar();
  revalidatePath(`/visitas/${f.visitaId}`);
}

export async function excluirFollowUp(followUpId: string) {
  await exigirAdmin();
  const f = await db.followUp.delete({ where: { id: followUpId } });
  atualizar();
  revalidatePath(`/visitas/${f.visitaId}`);
}

export async function adicionarFollowUp(visitaId: string, form: FormData) {
  await exigirAdmin();
  const data = lerDataHora(`${String(form.get("data") ?? "")}T10:00`);
  if (!data) return;
  const ultimo = await db.followUp.findFirst({ where: { visitaId }, orderBy: { ordem: "desc" } });
  await db.followUp.create({ data: { visitaId, ordem: (ultimo?.ordem ?? 0) + 1, dataPrevista: data } });
  atualizar();
  revalidatePath(`/visitas/${visitaId}`);
}

export async function excluirVisita(id: string) {
  await exigirAdmin();
  const fotos = await db.fotoVisita.findMany({ where: { visitaId: id } });
  // Tira os lembretes da agenda dos sócios antes de apagar
  await db.visita.update({ where: { id }, data: { status: "CANCELADA" } });
  await sincronizarAgenda(id, "");
  await db.visita.delete({ where: { id } });
  await Promise.all(fotos.map((f) => apagarComprovante(f.arquivo)));
  atualizar();
  redirect("/visitas");
}
