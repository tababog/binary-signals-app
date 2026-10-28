"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { lerData, texto } from "@/lib/format";
import { dadosContato } from "@/lib/contato";
import type { EstadoForm } from "@/components/Formulario";

export async function salvarFornecedor(id: string | null, _e: EstadoForm, form: FormData): Promise<EstadoForm> {
  await exigirAdmin();
  const dados = {
    ...dadosContato(form),
    tipo: form.get("tipo") === "SUBCONTRATADO" ? "SUBCONTRATADO" : "FORNECEDOR",
    categoria: texto(form.get("categoria")),
    licenca: texto(form.get("licenca")),
    seguroValidade: lerData(form.get("seguroValidade")),
  };
  if (!dados.nome) return { erro: "Informe o nome." };

  const fornecedor = id
    ? await db.fornecedor.update({ where: { id }, data: dados })
    : await db.fornecedor.create({ data: dados });
  revalidatePath("/fornecedores");
  revalidatePath("/subcontratados");
  redirect(`/fornecedores/${fornecedor.id}`);
}

export async function excluirFornecedor(id: string) {
  await exigirAdmin();
  // As despesas já lançadas continuam na obra, só perdem o vínculo com o fornecedor.
  await db.lancamento.updateMany({ where: { fornecedorId: id }, data: { fornecedorId: null } });
  const f = await db.fornecedor.delete({ where: { id } });
  revalidatePath("/fornecedores");
  revalidatePath("/subcontratados");
  redirect(f.tipo === "SUBCONTRATADO" ? "/subcontratados" : "/fornecedores");
}
