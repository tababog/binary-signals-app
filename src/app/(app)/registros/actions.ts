"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { lerDataHora, texto } from "@/lib/format";
import type { EstadoForm } from "@/components/Formulario";

function atualizar() {
  revalidatePath("/registros");
  revalidatePath("/ponto");
}

export async function corrigirRegistro(id: string, _e: EstadoForm, form: FormData): Promise<EstadoForm> {
  await exigirAdmin();
  const entrada = lerDataHora(form.get("entrada"));
  const saida = lerDataHora(form.get("saida"));
  if (!entrada) return { erro: "Informe a entrada." };
  if (saida && saida <= entrada) return { erro: "A saída precisa ser depois da entrada." };
  await db.registroPonto.update({ where: { id }, data: { entrada, saida, observacao: texto(form.get("observacao")) } });
  atualizar();
  return {};
}

export async function lancarRegistroManual(_e: EstadoForm, form: FormData): Promise<EstadoForm> {
  await exigirAdmin();
  const usuarioId = String(form.get("usuarioId") ?? "");
  const obraId = String(form.get("obraId") ?? "");
  const entrada = lerDataHora(form.get("entrada"));
  const saida = lerDataHora(form.get("saida"));
  if (!usuarioId || !obraId) return { erro: "Escolha o funcionário e a obra." };
  if (!entrada || !saida) return { erro: "Informe entrada e saída." };
  if (saida <= entrada) return { erro: "A saída precisa ser depois da entrada." };

  const usuario = await db.usuario.findUniqueOrThrow({ where: { id: usuarioId } });
  await db.registroPonto.create({
    data: { usuarioId, obraId, entrada, saida, manual: true, valorHoraCent: usuario.valorHoraCent, observacao: texto(form.get("observacao")) ?? "Lançado pelo administrador" },
  });
  atualizar();
  return {};
}

export async function excluirRegistro(id: string) {
  await exigirAdmin();
  await db.registroPonto.delete({ where: { id } });
  atualizar();
}
