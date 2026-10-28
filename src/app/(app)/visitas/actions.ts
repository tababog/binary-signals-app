"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { lerDataHora, texto } from "@/lib/format";
import { STATUS_VISITA, TIPOS_SERVICO } from "@/lib/constantes";
import type { EstadoForm } from "@/components/Formulario";
import { agendarFollowUps, CANAIS } from "@/lib/followup";

function atualizar() {
  revalidatePath("/visitas");
  revalidatePath("/");
}

export async function salvarVisita(id: string | null, _e: EstadoForm, form: FormData): Promise<EstadoForm> {
  await exigirAdmin();
  const dataHora = lerDataHora(form.get("dataHora"));
  if (!dataHora) return { erro: "Informe a data e a hora da visita." };
  const tipo = String(form.get("tipoServico") ?? "");

  // Cliente já cadastrado ou um novo, criado aqui mesmo com nome e telefone
  let clienteId = String(form.get("clienteId") ?? "");
  if (clienteId === "NOVO" || !clienteId) {
    const nome = String(form.get("clienteNome") ?? "").trim();
    if (!nome) return { erro: "Escolha o cliente ou informe o nome do cliente novo." };
    const novo = await db.cliente.create({
      data: { nome, telefone: texto(form.get("clienteTelefone")), endereco: texto(form.get("endereco")) },
    });
    clienteId = novo.id;
  }

  const status = String(form.get("status") ?? "AGENDADA");
  const dados = {
    clienteId,
    dataHora,
    endereco: texto(form.get("endereco")),
    tipoServico: tipo in TIPOS_SERVICO ? tipo : null,
    descricao: texto(form.get("descricao")),
    status: status in STATUS_VISITA ? status : "AGENDADA",
  };
  if (id) {
    await db.visita.update({ where: { id }, data: dados });
    atualizar();
    redirect("/visitas");
  }
  // Visita nova: abre a página dela já pedindo para colocar o lembrete no celular
  const visita = await db.visita.create({ data: dados });
  atualizar();
  redirect(`/visitas/${visita.id}?lembrete=1`);
}

export async function mudarStatusVisita(id: string, status: string) {
  await exigirAdmin();
  if (!(status in STATUS_VISITA)) return;
  const visita = await db.visita.update({ where: { id }, data: { status } });
  // Visita feita: começa o acompanhamento do cliente
  if (status === "REALIZADA") await agendarFollowUps(id, visita.dataHora < new Date() ? new Date() : visita.dataHora);
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
  await db.visita.delete({ where: { id } });
  atualizar();
  redirect("/visitas");
}
