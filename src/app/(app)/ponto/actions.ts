"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { exigirUsuario } from "@/lib/auth";
import { localValido } from "@/lib/geo";
import { recalcularCustosDoDia, valoresDoRegistro } from "@/lib/custo-ponto";

const SEM_GPS = "Não foi possível pegar sua localização. Ative a localização do celular e permita o acesso para registrar o ponto.";

export async function registrarEntrada(obraId: string, local: unknown): Promise<{ erro?: string }> {
  const usuario = await exigirUsuario();
  if (!localValido(local)) return { erro: SEM_GPS };
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
      ...valoresDoRegistro(usuario),
      latEntrada: local.lat,
      lngEntrada: local.lng,
      precisaoEntrada: local.precisao,
    },
  });
  revalidatePath("/ponto");
  return {};
}

export async function registrarSaida(local: unknown): Promise<{ erro?: string }> {
  const usuario = await exigirUsuario();
  if (!localValido(local)) return { erro: SEM_GPS };
  const aberto = await db.registroPonto.findFirst({ where: { usuarioId: usuario.id, saida: null } });
  if (!aberto) return { erro: "Você não tem entrada aberta." };

  await db.registroPonto.update({
    where: { id: aberto.id },
    data: { saida: new Date(), latSaida: local.lat, lngSaida: local.lng, precisaoSaida: local.precisao },
  });
  await recalcularCustosDoDia(usuario.id, aberto.entrada);
  revalidatePath("/ponto");
  return {};
}
