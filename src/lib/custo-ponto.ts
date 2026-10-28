import { db } from "./db";
import { campoData, lerDataHora } from "./format";

type Pagamento = { tipoPagamento: string; valorHoraCent: number; valorDiariaCent: number };

/** Valores copiados do cadastro para o registro de ponto, para aumentos futuros não mudarem o custo de obras passadas. */
export function valoresDoRegistro(u: Pagamento) {
  return u.tipoPagamento === "DIARIA"
    ? { valorHoraCent: 0, valorDiariaCent: u.valorDiariaCent }
    : { valorHoraCent: u.valorHoraCent, valorDiariaCent: 0 };
}

/**
 * Recalcula o custo dos registros fechados de um funcionário em um dia (no fuso configurado).
 * Por hora: horas × valor da hora. Diarista: a diária do dia é dividida entre os registros do dia
 * proporcionalmente às horas, para que duas obras no mesmo dia dividam uma diária só.
 */
export async function recalcularCustosDoDia(usuarioId: string, quando: Date) {
  const dia = campoData(quando);
  const inicio = lerDataHora(`${dia}T00:00`)!;
  const fim = new Date(lerDataHora(`${dia}T23:59`)!.getTime() + 60_000);
  const registros = await db.registroPonto.findMany({
    where: { usuarioId, entrada: { gte: inicio, lt: fim }, saida: { not: null } },
  });

  const duracao = (r: (typeof registros)[number]) => Math.max(0, r.saida!.getTime() - r.entrada.getTime());
  const diaristas = registros.filter((r) => r.valorDiariaCent > 0);
  const totalDiarista = diaristas.reduce((s, r) => s + duracao(r), 0);

  await Promise.all(
    registros.map((r) => {
      const custoCent =
        r.valorDiariaCent > 0
          ? totalDiarista > 0
            ? Math.round((r.valorDiariaCent * duracao(r)) / totalDiarista)
            : Math.round(r.valorDiariaCent / diaristas.length)
          : Math.round((duracao(r) / 3_600_000) * r.valorHoraCent);
      return db.registroPonto.update({ where: { id: r.id }, data: { custoCent } });
    }),
  );
}
