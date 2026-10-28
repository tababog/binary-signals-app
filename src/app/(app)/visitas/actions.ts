"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { lerDataHora, texto } from "@/lib/format";
import { STATUS_VISITA, TIPOS_SERVICO } from "@/lib/constantes";
import type { EstadoForm } from "@/components/Formulario";

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
  await db.visita.update({ where: { id }, data: { status } });
  atualizar();
}

export async function excluirVisita(id: string) {
  await exigirAdmin();
  await db.visita.delete({ where: { id } });
  atualizar();
  redirect("/visitas");
}
