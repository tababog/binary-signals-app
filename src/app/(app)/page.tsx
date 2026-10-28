import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { exigirUsuario } from "@/lib/auth";
import { data, dinheiro, hora } from "@/lib/format";
import { nomeStatus } from "@/lib/constantes";
import { resumoObra } from "@/lib/financeiro";
import { Cabecalho, SeloStatus, Vazio } from "@/components/ui";
import { ItemVisita } from "@/components/ItemVisita";
import { SeloLocal } from "@/components/SeloLocal";
import { temAlertaLocal } from "@/lib/geo";

export default async function Painel() {
  const usuario = await exigirUsuario();
  if (usuario.papel !== "ADMIN") redirect("/ponto");

  const seteDias = new Date(Date.now() - 7 * 24 * 3600 * 1000);
  const [obras, naObra, ultimos, recentes, visitas] = await Promise.all([
    db.obra.findMany({ where: { status: { not: "CONCLUIDA" } }, orderBy: { criadoEm: "desc" } }),
    db.registroPonto.findMany({ where: { saida: null }, include: { usuario: true, obra: true }, orderBy: { entrada: "asc" } }),
    db.lancamento.findMany({ include: { obra: true }, orderBy: { criadoEm: "desc" }, take: 8 }),
    db.registroPonto.findMany({ where: { entrada: { gte: seteDias } }, include: { usuario: true, obra: true }, orderBy: { entrada: "desc" } }),
    db.visita.findMany({ where: { status: "AGENDADA" }, include: { cliente: true }, orderBy: { dataHora: "asc" }, take: 6 }),
  ]);
  const agora = new Date();
  const alertas = recentes.filter(temAlertaLocal);
  const resumos = await Promise.all(obras.map((o) => resumoObra(o.id)));

  return (
    <>
      <Cabecalho titulo="Painel" subtitulo={`Obras em aberto: ${obras.length}`}>
        <Link href="/obras/nova" className="botao">+ Nova obra</Link>
      </Cabecalho>

      {/* Ordem pedida: obras, equipe, visitas, lançamentos. Uma coluna no celular, duas no computador. */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="lg:col-span-2">
        <div className="cartao overflow-x-auto">
          <h2 className="mb-3">Obras em aberto</h2>
          {resumos.length === 0 ? (
            <Vazio>Nenhuma obra em aberto.</Vazio>
          ) : (
            <table className="tabela">
              <thead>
                <tr><th>Obra</th><th>Andamento</th><th className="text-right">Custo / Orçado</th><th className="text-right">Saldo</th></tr>
              </thead>
              <tbody>
                {resumos.map((r) => {
                  const estourou = r.orcadoTotal > 0 && r.custoTotal > r.orcadoTotal;
                  return (
                    <tr key={r.obra.id}>
                      <td>
                        <Link href={`/obras/${r.obra.id}`} className="link">{r.obra.nome}</Link>
                        <div className="text-xs text-stone-500">{r.obra.cliente.nome}</div>
                      </td>
                      <td>
                        <SeloStatus status={r.obra.status} rotulo={nomeStatus(r.obra.status)} />
                        <div className="text-xs text-stone-500">{r.obra.progresso}%</div>
                      </td>
                      <td className={`text-right tabular-nums ${estourou ? "text-red-700" : ""}`}>
                        {dinheiro(r.custoTotal)}
                        <div className="text-xs text-stone-500">de {dinheiro(r.orcadoTotal)}{estourou && " ⚠️"}</div>
                      </td>
                      <td className={`text-right tabular-nums ${r.saldoCaixa < 0 ? "text-red-700" : "text-emerald-700"}`}>{dinheiro(r.saldoCaixa)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        </div>
        <div className="space-y-4">
          <div className="cartao">
            <h2 className="mb-2">Equipe trabalhando agora</h2>
            {naObra.length === 0 ? (
              <Vazio>Ninguém com ponto aberto.</Vazio>
            ) : (
              <ul className="space-y-1 text-sm">
                {naObra.map((r) => (
                  <li key={r.id}>
                    <b>{r.usuario.nome}</b> em {r.obra.nome}
                    <span className="text-stone-500"> desde {hora(r.entrada)}</span>{" "}
                    <SeloLocal lat={r.latEntrada} lng={r.lngEntrada} precisao={r.precisaoEntrada} obra={r.obra} />
                  </li>
                ))}
              </ul>
            )}
          </div>
          {alertas.length > 0 && (
            <div className="cartao border-red-200 bg-red-50">
              <h2 className="mb-2">⚠ Ponto fora da obra (7 dias)</h2>
              <ul className="space-y-1 text-sm">
                {alertas.slice(0, 6).map((r) => (
                  <li key={r.id}>
                    <b>{r.usuario.nome}</b> · {r.obra.nome} · {data(r.entrada)} {hora(r.entrada)}
                  </li>
                ))}
              </ul>
              <Link href="/registros?alertas=1" className="link mt-2 inline-block text-sm">Ver todos os alertas →</Link>
            </div>
          )}
        </div>
        <div className="cartao self-start">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h2>Visitas agendadas</h2>
            <Link href="/visitas/nova" className="botao px-3 py-1.5 text-sm">+ Agendar</Link>
          </div>
          {visitas.length === 0 ? (
            <Vazio>Nenhuma visita agendada.</Vazio>
          ) : (
            <ul className="divide-y divide-stone-100">{visitas.map((v) => <ItemVisita key={v.id} v={v} agora={agora} />)}</ul>
          )}
          <Link href="/visitas" className="link mt-2 inline-block text-sm">Ver todas as visitas →</Link>
        </div>
        <div className="lg:col-span-2">
          <div className="cartao">
            <h2 className="mb-2">Últimos lançamentos</h2>
            {ultimos.length === 0 ? (
              <Vazio>Nada lançado ainda.</Vazio>
            ) : (
              <ul className="divide-y divide-stone-100 text-sm">
                {ultimos.map((l) => (
                  <li key={l.id} className="flex justify-between gap-2 py-1.5">
                    <span>
                      {l.descricao}
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
