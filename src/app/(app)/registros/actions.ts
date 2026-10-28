"use server";

import { getT } from "@/i18n/servidor";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { lerDataHora, texto } from "@/lib/format";
import type { EstadoForm } from "@/components/Formulario";
import { recalcularCustosDoDia, valoresDoRegistro } from "@/lib/custo-ponto";

function atualizar() {
  revalidatePath("/registros");
  revalidatePath("/ponto");
}

export async function corrigirRegistro(id: string, _e: EstadoForm, form: FormData): Promise<EstadoForm> {
  await exigirAdmin();
  const entrada = lerDataHora(form.get("entrada"));
  const saida = lerDataHora(form.get("saida"));
  if (!entrada) return { erro: getT()("Informe a entrada.") };
  if (saida && saida <= entrada) return { erro: getT()("A saída precisa ser depois da entrada.") };
  const antes = await db.registroPonto.findUniqueOrThrow({ where: { id } });
  await db.registroPonto.update({ where: { id }, data: { entrada, saida, custoCent: saida ? undefined : null, observacao: texto(form.get("observacao")) } });
  // A correção pode mudar o dia do registro: recalcula o dia antigo e o novo
  await recalcularCustosDoDia(antes.usuarioId, antes.entrada);
  await recalcularCustosDoDia(antes.usuarioId, entrada);
  atualizar();
  return {};
}

export async function lancarRegistroManual(_e: EstadoForm, form: FormData): Promise<EstadoForm> {
  await exigirAdmin();
  const usuarioId = String(form.get("usuarioId") ?? "");
  const obraId = String(form.get("obraId") ?? "");
  const entrada = lerDataHora(form.get("entrada"));
  const saida = lerDataHora(form.get("saida"));
  if (!usuarioId || !obraId) return { erro: getT()("Escolha o funcionário e a obra.") };
  if (!entrada || !saida) return { erro: getT()("Informe entrada e saída.") };
  if (saida <= entrada) return { erro: getT()("A saída precisa ser depois da entrada.") };

  const usuario = await db.usuario.findUniqueOrThrow({ where: { id: usuarioId } });
  await db.registroPonto.create({
    data: { usuarioId, obraId, entrada, saida, manual: true, ...valoresDoRegistro(usuario), observacao: texto(form.get("observacao")) ?? "Lançado pelo administrador" },
  });
  await recalcularCustosDoDia(usuarioId, entrada);
  atualizar();
  return {};
}

export async function excluirRegistro(id: string) {
  await exigirAdmin();
  const r = await db.registroPonto.delete({ where: { id } });
  await recalcularCustosDoDia(r.usuarioId, r.entrada);
  atualizar();
}
