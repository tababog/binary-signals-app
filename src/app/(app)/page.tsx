import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { exigirUsuario } from "@/lib/auth";
import { campoData, campoDataHora, data, dinheiro, hora, lerDataHora } from "@/lib/format";
import { nomeStatus, nomeTipoServico } from "@/lib/constantes";
import { Cabecalho, Campo, SeloStatus, Vazio } from "@/components/ui";
import { Formulario } from "@/components/Formulario";
import { ItemVisita } from "@/components/ItemVisita";
import { TextoUsuario } from "@/components/TextoUsuario";
import { SeloLocal } from "@/components/SeloLocal";
import { temAlertaLocal } from "@/lib/geo";
import { getT } from "@/i18n/servidor";
import { fecharPonto, lancarRegistroManual, trocarObraRegistro } from "./registros/actions";
import { BotaoEnviar } from "@/components/BotaoEnviar";

export default async function Painel() {
  const usuario = await exigirUsuario();
  if (usuario.papel !== "ADMIN") redirect("/ponto");
  const t = getT();

  const seteDias = new Date(Date.now() - 7 * 24 * 3600 * 1000);
  const fimDeHoje = new Date(lerDataHora(`${campoData(new Date())}T23:59`)!.getTime() + 60_000);
  const [obras, naObra, ultimos, recentes, visitas, followUps, equipe] = await Promise.all([
    db.obra.findMany({ where: { status: { not: "CONCLUIDA" } }, include: { cliente: true }, orderBy: { criadoEm: "desc" } }),
    db.registroPonto.findMany({ where: { saida: null }, include: { usuario: true, obra: true }, orderBy: { entrada: "asc" } }),
    db.lancamento.findMany({ include: { obra: true }, orderBy: { criadoEm: "desc" }, take: 8 }),
    db.registroPonto.findMany({ where: { entrada: { gte: seteDias } }, include: { usuario: true, obra: true }, orderBy: { entrada: "desc" } }),
    db.visita.findMany({ where: { status: "AGENDADA" }, include: { cliente: true, responsavel: true }, orderBy: { dataHora: "asc" }, take: 6 }),
    // Follow-ups que vencem hoje ou já passaram, de clientes ainda em negociação
    db.followUp.findMany({
      where: { enviadoEm: null, dataPrevista: { lt: fimDeHoje }, visita: { status: "REALIZADA", resultado: null } },
      include: { visita: { include: { cliente: true } } },
      orderBy: { dataPrevista: "asc" },
    }),
    db.usuario.findMany({ where: { ativo: true }, orderBy: { nome: "asc" }, select: { id: true, nome: true } }),
  ]);
  const agora = new Date();
  const alertas = recentes.filter(temAlertaLocal);

  return (
    <>
      <Cabecalho titulo={t("Painel")} subtitulo={t("Obras em aberto: {n}", { n: obras.length })}>
        <Link href="/obras/nova" className="botao">{t("+ Nova obra")}</Link>
      </Cabecalho>

      {/* Ordem pedida: obras, equipe, visitas, lançamentos. Uma coluna no celular, duas no computador. */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="lg:col-span-2">
        <div className="cartao overflow-x-auto">
          <h2 className="mb-3">{t("Obras em aberto")}</h2>
          {obras.length === 0 ? (
            <Vazio>{t("Nenhuma obra em aberto.")}</Vazio>
          ) : (
            <table className="tabela">
              <thead>
                <tr><th>{t("Obra")}</th><th>{t("Situação")}</th></tr>
              </thead>
              <tbody>
                {obras.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <Link href={`/obras/${o.id}`} className="link">{o.nome}</Link>
                      <div className="text-xs text-stone-500">{o.cliente.nome}</div>
                    </td>
                    <td>
                      <SeloStatus status={o.status} rotulo={t(nomeStatus(o.status))} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        </div>
        <div className="space-y-4">
          <div className="cartao">
            <h2 className="mb-2">{t("Equipe trabalhando agora")}</h2>
            {naObra.length === 0 ? (
              <Vazio>{t("Ninguém com ponto aberto.")}</Vazio>
            ) : (
              <ul className="space-y-1 text-sm">
                {naObra.map((r) => (
                  <li key={r.id} className="border-b border-stone-100 pb-2 last:border-0">
                    <b>{r.usuario.nome}</b> {t("em")} {r.obra.nome}
                    <span className="text-stone-500"> {t("desde {hora}", { hora: hora(r.entrada) })}</span>{" "}
                    <SeloLocal lat={r.latEntrada} lng={r.lngEntrada} precisao={r.precisaoEntrada} obra={r.obra} />
                    {/* Esqueceu de marcar a saída: o administrador fecha aqui com a hora que ele saiu */}
                    <details className="mt-1">
                      <summary className="cursor-pointer text-xs font-medium text-marca-700">{t("Fechar ponto")}</summary>
                      <Formulario acao={fecharPonto.bind(null, r.id)} className="mt-1 flex flex-wrap items-end gap-2">
                        <Campo rotulo={t("Hora da saída")}>
                          <input className="campo py-1 text-sm" type="datetime-local" name="saida" defaultValue={campoDataHora(agora)} min={campoDataHora(r.entrada)} required />
                        </Campo>
                        <BotaoEnviar className="botao px-3 py-1 text-sm">{t("Fechar")}</BotaoEnviar>
                      </Formulario>
                    </details>
                    {/* Marcou a obra errada: o administrador troca aqui */}
                    <details className="mt-1">
                      <summary className="cursor-pointer text-xs font-medium text-marca-700">{t("Trocar obra")}</summary>
                      <form action={trocarObraRegistro.bind(null, r.id)} className="mt-1 flex gap-2">
                        <select className="campo py-1 text-sm" name="obraId" defaultValue={r.obraId} aria-label={t("Obra")}>
                          {(obras.some((o) => o.id === r.obraId) ? obras : [r.obra, ...obras]).map((o) => (
                            <option key={o.id} value={o.id}>{o.nome}</option>
                          ))}
                        </select>
                        <BotaoEnviar className="botao-secundario px-3 py-1 text-sm">{t("Salvar")}</BotaoEnviar>
                      </form>
                    </details>
                  </li>
                ))}
              </ul>
            )}
            {/* Esqueceu de marcar a entrada: o administrador lança aqui (sem saída = ainda trabalhando) */}
            <details className="mt-3 border-t border-stone-100 pt-2">
              <summary className="cursor-pointer text-sm font-semibold text-marca-700">{t("+ Lançar ponto")}</summary>
              <Formulario acao={lancarRegistroManual} className="mt-2 grid gap-2" limparAoSalvar>
                <Campo rotulo={t("Funcionário")}>
                  <select className="campo" name="usuarioId" required defaultValue="">
                    <option value="" disabled>{t("Selecione...")}</option>
                    {equipe.map((u) => <option key={u.id} value={u.id}>{u.nome}</option>)}
                  </select>
                </Campo>
                <Campo rotulo={t("Obra")}>
                  <select className="campo" name="obraId" required defaultValue="">
                    <option value="" disabled>{t("Selecione...")}</option>
                    {obras.map((o) => <option key={o.id} value={o.id}>{o.nome}</option>)}
                  </select>
                </Campo>
                <div className="grid grid-cols-2 gap-2">
                  <Campo rotulo={t("Entrada")}><input className="campo" type="datetime-local" name="entrada" required /></Campo>
                  <Campo rotulo={t("Saída (em branco = ainda trabalhando)")}><input className="campo" type="datetime-local" name="saida" /></Campo>
                </div>
                <BotaoEnviar>{t("Lançar")}</BotaoEnviar>
              </Formulario>
            </details>
          </div>
          {alertas.length > 0 && (
            <div className="cartao border-red-200 bg-red-50">
              <h2 className="mb-2">{t("⚠ Ponto fora da obra (7 dias)")}</h2>
              <ul className="space-y-1 text-sm">
                {alertas.slice(0, 6).map((r) => (
                  <li key={r.id}>
                    <b>{r.usuario.nome}</b> · {r.obra.nome} · {data(r.entrada)} {hora(r.entrada)}
                  </li>
                ))}
              </ul>
              <Link href="/registros?alertas=1" className="link mt-2 inline-block text-sm">{t("Ver todos os alertas →")}</Link>
            </div>
          )}
        </div>
        <div className="cartao self-start">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h2>{t("Visitas agendadas")}</h2>
            <Link href="/visitas/nova" className="botao px-3 py-1.5 text-sm">{t("+ Agendar")}</Link>
          </div>
          {visitas.length === 0 ? (
            <Vazio>{t("Nenhuma visita agendada.")}</Vazio>
          ) : (
            <ul className="divide-y divide-stone-100">{visitas.map((v) => <ItemVisita key={v.id} v={v} agora={agora} />)}</ul>
          )}
          <Link href="/visitas" className="link mt-2 inline-block text-sm">{t("Ver todas as visitas →")}</Link>
        </div>
        {followUps.length > 0 && (
          <div className="cartao self-start border-sky-200 bg-sky-50 lg:col-start-2">
            <h2 className="mb-2">{t("💬 Follow-ups de hoje")}</h2>
            <ul className="divide-y divide-sky-100 text-sm">
              {followUps.map((f) => (
                <li key={f.id} className="flex items-center justify-between gap-2 py-2">
                  <span>
                    <b>{f.visita.cliente.nome}</b>
                    {f.visita.tipoServico && ` · ${t(nomeTipoServico(f.visita.tipoServico))}`}
                    <span className="block text-xs text-stone-500">
                      {t("{n}º follow-up", { n: f.ordem })}{f.dataPrevista < lerDataHora(`${campoData(new Date())}T00:00`)! && ` · ${t("atrasado desde {data}", { data: data(f.dataPrevista) })}`}
                    </span>
                  </span>
                  <Link href={`/visitas/${f.visitaId}`} className="botao px-3 py-1.5 text-sm">{t("Enviar")}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="lg:col-span-2">
          <div className="cartao">
            <h2 className="mb-2">{t("Últimos lançamentos")}</h2>
            {ultimos.length === 0 ? (
              <Vazio>{t("Nada lançado ainda.")}</Vazio>
            ) : (
              <ul className="divide-y divide-stone-100 text-sm">
                {ultimos.map((l) => (
                  <li key={l.id} className="flex justify-between gap-2 py-1.5">
                    <span>
                      <TextoUsuario texto={l.descricao} />
                      <span className="block text-xs text-stone-500">{l.obra.nome} · {data(l.data)}</span>
                    </span>
                    <span className={`whitespace-nowrap tabular-nums ${l.tipo === "ENTRADA" ? "text-emerald-700" : "text-red-700"}`}>
                      {l.tipo === "ENTRADA" ? "+" : "−"} {dinheiro(l.valorCent)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
