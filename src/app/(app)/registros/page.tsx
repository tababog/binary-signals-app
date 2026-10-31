import Link from "next/link";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { campoData, campoDataHora, data, dinheiro, hora, horas, inicioDoMes, lerData, lerDataHora } from "@/lib/format";
import { custoPonto, duracaoMs } from "@/lib/financeiro";
import { temAlertaLocal } from "@/lib/geo";
import { Cabecalho, Campo, Indicador, Vazio } from "@/components/ui";
import { Formulario } from "@/components/Formulario";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { SeloLocal } from "@/components/SeloLocal";
import { TextoUsuario } from "@/components/TextoUsuario";
import { corrigirRegistro, excluirRegistro, lancarRegistroManual } from "./actions";
import { getT } from "@/i18n/servidor";

type Filtros = { usuario?: string; obra?: string; de?: string; ate?: string; editar?: string; alertas?: string };

export default async function Registros({ searchParams }: { searchParams: Filtros }) {
  await exigirAdmin();
  const t = getT();
  const deStr = lerData(searchParams.de ?? null) ? searchParams.de! : campoData(inicioDoMes());
  const ateStr = lerData(searchParams.ate ?? null) ? searchParams.ate! : campoData(new Date());
  const de = lerDataHora(`${deStr}T00:00`)!;
  const ate = new Date(lerDataHora(`${ateStr}T23:59`)!.getTime() + 60_000);

  const [usuarios, obras, todos] = await Promise.all([
    db.usuario.findMany({ orderBy: { nome: "asc" }, select: { id: true, nome: true } }),
    db.obra.findMany({ orderBy: { nome: "asc" }, select: { id: true, nome: true } }),
    db.registroPonto.findMany({
      where: {
        usuarioId: searchParams.usuario || undefined,
        obraId: searchParams.obra || undefined,
        entrada: { gte: de, lt: ate },
      },
      include: { usuario: true, obra: true },
      orderBy: { entrada: "desc" },
    }),
  ]);
  const registros = searchParams.alertas ? todos.filter(temAlertaLocal) : todos;
  const totalAlertas = todos.filter(temAlertaLocal).length;
  const fechados = registros.filter((r) => r.saida);

  return (
    <>
      <Cabecalho titulo={t("Horas trabalhadas")} subtitulo={t("Registros de ponto de toda a equipe")} />

      <form className="cartao mb-4 grid gap-3 sm:grid-cols-6 sm:items-end">
        <Campo rotulo={t("Funcionário")}>
          <select className="campo" name="usuario" defaultValue={searchParams.usuario ?? ""}>
            <option value="">{t("Todos")}</option>
            {usuarios.map((u) => <option key={u.id} value={u.id}>{u.nome}</option>)}
          </select>
        </Campo>
        <Campo rotulo={t("Obra")}>
          <select className="campo" name="obra" defaultValue={searchParams.obra ?? ""}>
            <option value="">{t("Todas")}</option>
            {obras.map((o) => <option key={o.id} value={o.id}>{o.nome}</option>)}
          </select>
        </Campo>
        <Campo rotulo={t("De")}><input className="campo" type="date" name="de" defaultValue={deStr} /></Campo>
        <Campo rotulo={t("Até")}><input className="campo" type="date" name="ate" defaultValue={ateStr} /></Campo>
        <label className="flex items-center gap-2 pb-2 text-sm">
          <input type="checkbox" name="alertas" value="1" defaultChecked={!!searchParams.alertas} className="h-4 w-4" />
          {t("Só fora da obra / sem GPS")}
        </label>
        <button className="botao">{t("Filtrar")}</button>
      </form>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Indicador rotulo={t("Horas no período")} valor={horas(fechados.reduce((s, r) => s + duracaoMs(r), 0))} />
        <Indicador rotulo={t("Custo da equipe")} valor={dinheiro(custoPonto(fechados))} />
        <Indicador rotulo={t("Alertas de localização")} valor={String(totalAlertas)} tom={totalAlertas > 0 ? "ruim" : "bom"} detalhe={t("{n} registro(s), {abertos} em aberto", { n: registros.length, abertos: registros.length - fechados.length })} />
      </div>

      <div className="cartao mb-4 overflow-x-auto">
        {registros.length === 0 ? (
          <Vazio>{t("Nenhum registro no período.")}</Vazio>
        ) : (
          <table className="tabela">
            <thead>
              <tr><th>{t("Dia")}</th><th>{t("Funcionário")}</th><th>{t("Obra")}</th><th>{t("Entrada")}</th><th>{t("Saída")}</th><th className="text-right">{t("Horas")}</th><th className="text-right">{t("Custo")}</th><th /></tr>
            </thead>
            <tbody>
              {registros.map((r) =>
                searchParams.editar === r.id ? (
                  <tr key={r.id}>
                    <td colSpan={8}>
                      <Formulario acao={corrigirRegistro.bind(null, r.id)} className="grid gap-3 bg-stone-50 p-3 sm:grid-cols-4 sm:items-end">
                        <div className="sm:col-span-4 text-sm font-semibold">{r.usuario.nome} · {r.obra.nome}</div>
                        <Campo rotulo={t("Obra")}>
                          <select className="campo" name="obraId" defaultValue={r.obraId}>
                            {obras.map((o) => <option key={o.id} value={o.id}>{o.nome}</option>)}
                          </select>
                        </Campo>
                        <Campo rotulo={t("Entrada")}><input className="campo" type="datetime-local" name="entrada" defaultValue={campoDataHora(r.entrada)} required /></Campo>
                        <Campo rotulo={t("Saída")}><input className="campo" type="datetime-local" name="saida" defaultValue={campoDataHora(r.saida)} /></Campo>
                        <Campo rotulo={t("Observação")}><input className="campo" name="observacao" defaultValue={r.observacao ?? ""} placeholder={t("Motivo da correção")} /></Campo>
                        <div className="flex gap-2">
                          <BotaoEnviar>{t("Salvar")}</BotaoEnviar>
                          <Link href={`?${new URLSearchParams({ ...searchParams, editar: "" })}`} className="botao-secundario">{t("Fechar")}</Link>
                        </div>
                      </Formulario>
                    </td>
                  </tr>
                ) : (
                  <tr key={r.id}>
                    <td className="whitespace-nowrap">{data(r.entrada)}</td>
                    <td>{r.usuario.nome}</td>
                    <td><Link href={`/obras/${r.obraId}?aba=equipe`} className="link">{r.obra.nome}</Link></td>
                    <td className="whitespace-nowrap">
                      {hora(r.entrada)}
                      <div>{r.manual ? <span className="selo bg-stone-100 text-stone-600">{t("Lançado pelo admin")}</span> : <SeloLocal lat={r.latEntrada} lng={r.lngEntrada} precisao={r.precisaoEntrada} obra={r.obra} />}</div>
                    </td>
                    <td className="whitespace-nowrap">
                      {r.saida ? hora(r.saida) : <span className="selo bg-emerald-100 text-emerald-800">{t("Aberto")}</span>}
                      {r.saida && !r.manual && <div><SeloLocal lat={r.latSaida} lng={r.lngSaida} precisao={r.precisaoSaida} obra={r.obra} /></div>}
                      {r.observacao && <div className="text-xs text-stone-500"><TextoUsuario texto={r.observacao} /></div>}
                    </td>
                    <td className="text-right tabular-nums">{r.saida ? horas(duracaoMs(r)) : "—"}</td>
                    <td className="text-right tabular-nums">{r.saida ? dinheiro(custoPonto([r])) : "—"}</td>
                    <td className="whitespace-nowrap text-right">
                      <Link href={`?${new URLSearchParams({ ...searchParams, editar: r.id })}`} className="text-xs text-marca-700 hover:underline">{t("Corrigir")}</Link>
                      <form action={excluirRegistro.bind(null, r.id)} className="ml-2 inline">
                        <BotaoEnviar className="text-xs text-red-700 hover:underline" confirmar={t("Excluir este registro de ponto?")}>{t("Excluir")}</BotaoEnviar>
                      </form>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="cartao">
        <h2 className="mb-1">{t("Lançar horas manualmente")}</h2>
        <p className="mb-3 text-sm text-stone-500">{t("Para quando o funcionário esqueceu de registrar o ponto.")}</p>
        <Formulario acao={lancarRegistroManual} className="grid gap-3 sm:grid-cols-3 sm:items-end">
          <Campo rotulo={t("Funcionário")}>
            <select className="campo" name="usuarioId" required defaultValue="">
              <option value="" disabled>{t("Selecione...")}</option>
              {usuarios.map((u) => <option key={u.id} value={u.id}>{u.nome}</option>)}
            </select>
          </Campo>
          <Campo rotulo={t("Obra")}>
            <select className="campo" name="obraId" required defaultValue="">
              <option value="" disabled>{t("Selecione...")}</option>
              {obras.map((o) => <option key={o.id} value={o.id}>{o.nome}</option>)}
            </select>
          </Campo>
          <Campo rotulo={t("Observação")}><input className="campo" name="observacao" /></Campo>
          <Campo rotulo={t("Entrada")}><input className="campo" type="datetime-local" name="entrada" required /></Campo>
          <Campo rotulo={t("Saída (em branco = ainda trabalhando)")}><input className="campo" type="datetime-local" name="saida" /></Campo>
          <BotaoEnviar>{t("Lançar")}</BotaoEnviar>
        </Formulario>
      </div>
    </>
  );
}
