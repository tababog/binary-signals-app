import Link from "next/link";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { campoData, campoDataHora, data, dinheiro, hora, horas, inicioDoMes, lerData, lerDataHora } from "@/lib/format";
import { custoPonto, duracaoMs } from "@/lib/financeiro";
import { Cabecalho, Campo, Indicador, Vazio } from "@/components/ui";
import { Formulario } from "@/components/Formulario";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { corrigirRegistro, excluirRegistro, lancarRegistroManual } from "./actions";

type Filtros = { usuario?: string; obra?: string; de?: string; ate?: string; editar?: string };

export default async function Registros({ searchParams }: { searchParams: Filtros }) {
  await exigirAdmin();
  const deStr = lerData(searchParams.de ?? null) ? searchParams.de! : campoData(inicioDoMes());
  const ateStr = lerData(searchParams.ate ?? null) ? searchParams.ate! : campoData(new Date());
  const de = lerDataHora(`${deStr}T00:00`)!;
  const ate = new Date(lerDataHora(`${ateStr}T23:59`)!.getTime() + 60_000);

  const [usuarios, obras, registros] = await Promise.all([
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
  const fechados = registros.filter((r) => r.saida);

  return (
    <>
      <Cabecalho titulo="Horas trabalhadas" subtitulo="Registros de ponto de toda a equipe" />

      <form className="cartao mb-4 grid gap-3 sm:grid-cols-5 sm:items-end">
        <Campo rotulo="Funcionário">
          <select className="campo" name="usuario" defaultValue={searchParams.usuario ?? ""}>
            <option value="">Todos</option>
            {usuarios.map((u) => <option key={u.id} value={u.id}>{u.nome}</option>)}
          </select>
        </Campo>
        <Campo rotulo="Obra">
          <select className="campo" name="obra" defaultValue={searchParams.obra ?? ""}>
            <option value="">Todas</option>
            {obras.map((o) => <option key={o.id} value={o.id}>{o.nome}</option>)}
          </select>
        </Campo>
        <Campo rotulo="De"><input className="campo" type="date" name="de" defaultValue={deStr} /></Campo>
        <Campo rotulo="Até"><input className="campo" type="date" name="ate" defaultValue={ateStr} /></Campo>
        <button className="botao">Filtrar</button>
      </form>

      <div className="mb-4 grid grid-cols-3 gap-3">
        <Indicador rotulo="Horas no período" valor={horas(fechados.reduce((s, r) => s + duracaoMs(r), 0))} />
        <Indicador rotulo="Custo da equipe" valor={dinheiro(custoPonto(fechados))} />
        <Indicador rotulo="Registros" valor={String(registros.length)} detalhe={`${registros.length - fechados.length} em aberto`} />
      </div>

      <div className="cartao mb-4 overflow-x-auto">
        {registros.length === 0 ? (
          <Vazio>Nenhum registro no período.</Vazio>
        ) : (
          <table className="tabela">
            <thead>
              <tr><th>Dia</th><th>Funcionário</th><th>Obra</th><th>Entrada</th><th>Saída</th><th className="text-right">Horas</th><th className="text-right">Custo</th><th /></tr>
            </thead>
            <tbody>
              {registros.map((r) =>
                searchParams.editar === r.id ? (
                  <tr key={r.id}>
                    <td colSpan={8}>
                      <Formulario acao={corrigirRegistro.bind(null, r.id)} className="grid gap-3 bg-stone-50 p-3 sm:grid-cols-4 sm:items-end">
                        <div className="sm:col-span-4 text-sm font-semibold">{r.usuario.nome} · {r.obra.nome}</div>
                        <Campo rotulo="Entrada"><input className="campo" type="datetime-local" name="entrada" defaultValue={campoDataHora(r.entrada)} required /></Campo>
                        <Campo rotulo="Saída"><input className="campo" type="datetime-local" name="saida" defaultValue={campoDataHora(r.saida)} /></Campo>
                        <Campo rotulo="Observação"><input className="campo" name="observacao" defaultValue={r.observacao ?? ""} placeholder="Motivo da correção" /></Campo>
                        <div className="flex gap-2">
                          <BotaoEnviar>Salvar</BotaoEnviar>
                          <Link href={`?${new URLSearchParams({ ...searchParams, editar: "" })}`} className="botao-secundario">Fechar</Link>
                        </div>
                      </Formulario>
                    </td>
                  </tr>
                ) : (
                  <tr key={r.id}>
                    <td className="whitespace-nowrap">{data(r.entrada)}</td>
                    <td>{r.usuario.nome}</td>
                    <td><Link href={`/obras/${r.obraId}?aba=equipe`} className="link">{r.obra.nome}</Link></td>
                    <td>
                      {hora(r.entrada)}
                      {r.latEntrada != null && (
                        <a className="ml-1 text-xs text-stone-500 hover:underline" target="_blank" href={`https://www.google.com/maps?q=${r.latEntrada},${r.lngEntrada}`}>📍</a>
                      )}
                    </td>
                    <td>
                      {r.saida ? hora(r.saida) : <span className="selo bg-emerald-100 text-emerald-800">Aberto</span>}
                      {r.latSaida != null && (
                        <a className="ml-1 text-xs text-stone-500 hover:underline" target="_blank" href={`https://www.google.com/maps?q=${r.latSaida},${r.lngSaida}`}>📍</a>
                      )}
                      {r.observacao && <div className="text-xs text-stone-500">{r.observacao}</div>}
                    </td>
                    <td className="text-right tabular-nums">{r.saida ? horas(duracaoMs(r)) : "—"}</td>
                    <td className="text-right tabular-nums">{r.saida ? dinheiro(custoPonto([r])) : "—"}</td>
                    <td className="whitespace-nowrap text-right">
                      <Link href={`?${new URLSearchParams({ ...searchParams, editar: r.id })}`} className="text-xs text-marca-700 hover:underline">Corrigir</Link>
                      <form action={excluirRegistro.bind(null, r.id)} className="ml-2 inline">
                        <BotaoEnviar className="text-xs text-red-700 hover:underline" confirmar="Excluir este registro de ponto?">Excluir</BotaoEnviar>
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
        <h2 className="mb-1">Lançar horas manualmente</h2>
        <p className="mb-3 text-sm text-stone-500">Para quando o funcionário esqueceu de registrar o ponto.</p>
        <Formulario acao={lancarRegistroManual} className="grid gap-3 sm:grid-cols-3 sm:items-end">
          <Campo rotulo="Funcionário">
            <select className="campo" name="usuarioId" required defaultValue="">
              <option value="" disabled>Selecione...</option>
              {usuarios.map((u) => <option key={u.id} value={u.id}>{u.nome}</option>)}
            </select>
          </Campo>
          <Campo rotulo="Obra">
            <select className="campo" name="obraId" required defaultValue="">
              <option value="" disabled>Selecione...</option>
              {obras.map((o) => <option key={o.id} value={o.id}>{o.nome}</option>)}
            </select>
          </Campo>
          <Campo rotulo="Observação"><input className="campo" name="observacao" /></Campo>
          <Campo rotulo="Entrada"><input className="campo" type="datetime-local" name="entrada" required /></Campo>
          <Campo rotulo="Saída"><input className="campo" type="datetime-local" name="saida" required /></Campo>
          <BotaoEnviar>Lançar</BotaoEnviar>
        </Formulario>
      </div>
    </>
  );
}
