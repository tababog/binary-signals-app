"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { texto } from "@/lib/format";
import { dadosContato } from "@/lib/contato";
import type { EstadoForm } from "@/components/Formulario";

export async function salvarFornecedor(id: string | null, _e: EstadoForm, form: FormData): Promise<EstadoForm> {
  await exigirAdmin();
  const dados = { ...dadosContato(form), categoria: texto(form.get("categoria")) };
  if (!dados.nome) return { erro: "Informe o nome do fornecedor." };

  const fornecedor = id
    ? await db.fornecedor.update({ where: { id }, data: dados })
    : await db.fornecedor.create({ data: dados });
  revalidatePath("/fornecedores");
  redirect(`/fornecedores/${fornecedor.id}`);
}

export async function excluirFornecedor(id: string) {
  await exigirAdmin();
  // As despesas já lançadas continuam na obra, só perdem o vínculo com o fornecedor.
  await db.lancamento.updateMany({ where: { fornecedorId: id }, data: { fornecedorId: null } });
  await db.fornecedor.delete({ where: { id } });
  revalidatePath("/fornecedores");
  redirect("/fornecedores");
}
