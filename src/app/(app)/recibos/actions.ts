"use server";

import { getT } from "@/i18n/servidor";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { exigirUsuario } from "@/lib/auth";
import { texto } from "@/lib/format";
import { apagarComprovante, salvarComprovante } from "@/lib/uploads";
import type { EstadoForm } from "@/components/Formulario";

/** Funcionário com permissão manda a foto do recibo de material de uma obra em aberto. Sem valores: quem lança é o administrador. */
export async function enviarRecibo(_e: EstadoForm, form: FormData): Promise<EstadoForm> {
  const usuario = await exigirUsuario();
  const t = getT();
  if (usuario.papel !== "ADMIN" && !usuario.podeEnviarRecibos) return { erro: t("Você não tem acesso para enviar recibos. Fale com o administrador.") };
  const obraId = String(form.get("obraId") ?? "");
  const obra = obraId ? await db.obra.findUnique({ where: { id: obraId } }) : null;
  if (!obra || obra.status === "CONCLUIDA") return { erro: t("Escolha uma obra ativa.") };

  let arquivo: string | null;
  try {
    arquivo = await salvarComprovante(form.get("comprovante"));
  } catch (e) {
    return { erro: t((e as Error).message) };
  }
  if (!arquivo) return { erro: t("Tire a foto do recibo.") };

  await db.reciboFuncionario.create({
    data: { obraId, usuarioId: usuario.id, arquivo, descricao: texto(form.get("descricao")), pagoDoBolso: form.get("pagoDoBolso") === "on" },
  });
  revalidatePath("/recibos");
  revalidatePath("/");
  return { ok: t("Recibo enviado. Obrigado!") };
}

/** Recibo repetido ou enviado por engano: o administrador descarta (apaga a foto também). */
export async function descartarRecibo(id: string) {
  const usuario = await exigirUsuario();
  if (usuario.papel !== "ADMIN") return;
  const recibo = await db.reciboFuncionario.findUnique({ where: { id } });
  if (!recibo || recibo.lancadoEm) return;
  await db.reciboFuncionario.delete({ where: { id } });
  await apagarComprovante(recibo.arquivo);
  revalidatePath("/");
  revalidatePath("/recibos");
}
