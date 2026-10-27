"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { exigirUsuario } from "@/lib/auth";

type Local = { lat: number; lng: number } | null;

export async function registrarEntrada(obraId: string, local: Local): Promise<{ erro?: string }> {
  const usuario = await exigirUsuario();
  const aberto = await db.registroPonto.findFirst({ where: { usuarioId: usuario.id, saida: null } });
  if (aberto) return { erro: "Você já está com uma entrada aberta. Registre a saída primeiro." };

  const obra = await db.obra.findUnique({ where: { id: obraId } });
  if (!obra || obra.status === "CONCLUIDA") return { erro: "Escolha uma obra ativa." };

  // O horário é sempre o do servidor, o funcionário não consegue alterar.
  await db.registroPonto.create({
    data: {
      usuarioId: usuario.id,
      obraId,
      entrada: new Date(),
      valorHoraCent: usuario.valorHoraCent,
      latEntrada: local?.lat,
      lngEntrada: local?.lng,
    },
  });
  revalidatePath("/ponto");
  return {};
}

export async function registrarSaida(local: Local): Promise<{ erro?: string }> {
  const usuario = await exigirUsuario();
  const aberto = await db.registroPonto.findFirst({ where: { usuarioId: usuario.id, saida: null } });
  if (!aberto) return { erro: "Você não tem entrada aberta." };

  await db.registroPonto.update({
    where: { id: aberto.id },
    data: { saida: new Date(), latSaida: local?.lat, lngSaida: local?.lng },
  });
  revalidatePath("/ponto");
  return {};
}
