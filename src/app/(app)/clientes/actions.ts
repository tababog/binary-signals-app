"use server";

import { getT } from "@/i18n/servidor";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { dadosContato } from "@/lib/contato";
import type { EstadoForm } from "@/components/Formulario";

export async function salvarCliente(id: string | null, _e: EstadoForm, form: FormData): Promise<EstadoForm> {
  await exigirAdmin();
  const dados = dadosContato(form);
  if (!dados.nome) return { erro: getT()("Informe o nome do cliente.") };

  const cliente = id
    ? await db.cliente.update({ where: { id }, data: dados })
    : await db.cliente.create({ data: dados });
  revalidatePath("/clientes");
  redirect(`/clientes/${cliente.id}`);
}

export async function excluirCliente(id: string) {
  await exigirAdmin();
  const obras = await db.obra.count({ where: { clienteId: id } });
  if (obras > 0) throw new Error("Este cliente tem obras cadastradas e não pode ser excluído.");
  await db.cliente.delete({ where: { id } });
  revalidatePath("/clientes");
  redirect("/clientes");
}
