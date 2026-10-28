import { db } from "@/lib/db";
import { exigirUsuario } from "@/lib/auth";
import { data, dataHora, hora, horas, inicioDoMes } from "@/lib/format";
import { duracaoMs } from "@/lib/financeiro";
import { Cabecalho, Indicador, Vazio } from "@/components/ui";
import { BaterPonto } from "@/components/BaterPonto";
import { getT } from "@/i18n/servidor";

export default async function Ponto() {
  const usuario = await exigirUsuario();
  const t = getT();
  const inicioMes = inicioDoMes();
  const hoje = data(new Date());

  const [obras, aberto, registros] = await Promise.all([
    db.obra.findMany({ where: { status: { in: ["EM_ANDAMENTO", "PLANEJADA", "PAUSADA"] } }, orderBy: [{ status: "asc" }, { nome: "asc" }], select: { id: true, nome: true } }),
    db.registroPonto.findFirst({ where: { usuarioId: usuario.id, saida: null }, include: { obra: true } }),
    db.registroPonto.findMany({ where: { usuarioId: usuario.id, entrada: { gte: inicioMes } }, include: { obra: true }, orderBy: { entrada: "desc" } }),
  ]);

  const fechados = registros.filter((r) => r.saida);
  const msHoje = registros.filter((r) => data(r.entrada) === hoje).reduce((s, r) => s + duracaoMs(r), 0);
  const msMes = fechados.reduce((s, r) => s + duracaoMs(r), 0);

  return (
    <>
      <Cabecalho titulo={t("Olá, {nome}", { nome: usuario.nome.split(" ")[0] })} subtitulo={t("Registre aqui a hora que chega e a hora que sai da obra")} />
      <div className="mx-auto max-w-md space-y-4">
        <div className="cartao">
          <BaterPonto obras={obras} aberto={aberto ? { obra: aberto.obra.nome, desde: dataHora(aberto.entrada) } : null} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Indicador rotulo={t("Hoje")} valor={horas(msHoje)} />
          <Indicador rotulo={t("Este mês")} valor={horas(msMes)} detalhe={t("{n} dia(s)", { n: new Set(fechados.map((r) => data(r.entrada))).size })} />
        </div>
        <div className="cartao">
          <h2 className="mb-2">{t("Meus registros do mês")}</h2>
          {registros.length === 0 ? (
            <Vazio>{t("Nenhum registro neste mês.")}</Vazio>
          ) : (
            <ul className="divide-y divide-stone-100 text-sm">
              {registros.map((r) => (
                <li key={r.id} className="flex justify-between py-2">
                  <span>
                    <b>{data(r.entrada)}</b> · {r.obra.nome}
                    <span className="block text-stone-500">{hora(r.entrada)} → {r.saida ? hora(r.saida) : t("em andamento")}</span>
                  </span>
                  <span className="tabular-nums">{r.saida ? horas(duracaoMs(r)) : "—"}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
