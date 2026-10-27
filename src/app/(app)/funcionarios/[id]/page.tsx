import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { data, dinheiro, hora, horas, inicioDoMes } from "@/lib/format";
import { custoPonto, duracaoMs } from "@/lib/financeiro";
import { Cabecalho, Indicador, Vazio, Voltar } from "@/components/ui";
import { Formulario } from "@/components/Formulario";
import { CamposFuncionario } from "@/components/CamposFuncionario";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { atualizarFuncionario } from "../actions";

export default async function Funcionario({ params, searchParams }: { params: { id: string }; searchParams: { salvo?: string } }) {
  await exigirAdmin();
  const usuario = await db.usuario.findUnique({ where: { id: params.id } });
  if (!usuario) notFound();

  const inicioMes = inicioDoMes();
  const registros = await db.registroPonto.findMany({
    where: { usuarioId: usuario.id, entrada: { gte: inicioMes } },
    include: { obra: true },
    orderBy: { entrada: "desc" },
  });
  const fechados = registros.filter((r) => r.saida);

  return (
    <>
      <Voltar href="/funcionarios" rotulo="Funcionários" />
      <Cabecalho titulo={usuario.nome} subtitulo={usuario.funcao ?? undefined} />

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Indicador rotulo="Horas no mês" valor={horas(fechados.reduce((s, r) => s + duracaoMs(r), 0))} />
        <Indicador rotulo="Custo no mês" valor={dinheiro(custoPonto(fechados))} />
        <Indicador rotulo="Dias trabalhados" valor={String(new Set(fechados.map((r) => data(r.entrada))).size)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="cartao">
          <h2 className="mb-3">Dados e acesso</h2>
          {searchParams.salvo && <p className="mb-3 rounded-lg bg-emerald-50 p-2 text-sm text-emerald-800">Alterações salvas.</p>}
          <Formulario acao={atualizarFuncionario.bind(null, usuario.id)}>
            <CamposFuncionario valor={usuario} />
            <label className="flex items-center gap-2">
              <input type="checkbox" name="ativo" defaultChecked={usuario.ativo} className="h-4 w-4" />
              <span className="text-sm">Acesso ativo (desmarque quando o funcionário sair da empresa)</span>
            </label>
            <BotaoEnviar>Salvar alterações</BotaoEnviar>
          </Formulario>
        </div>

        <div className="cartao overflow-x-auto">
          <h2 className="mb-3">Ponto deste mês</h2>
          {registros.length === 0 ? (
            <Vazio>Nenhum registro neste mês.</Vazio>
          ) : (
            <table className="tabela">
              <thead><tr><th>Dia</th><th>Obra</th><th>Entrada</th><th>Saída</th><th className="text-right">Horas</th></tr></thead>
              <tbody>
                {registros.map((r) => (
                  <tr key={r.id}>
                    <td>{data(r.entrada)}</td>
                    <td><Link href={`/obras/${r.obraId}`} className="link">{r.obra.nome}</Link></td>
                    <td>{hora(r.entrada)}</td>
                    <td>{r.saida ? hora(r.saida) : <span className="selo bg-emerald-100 text-emerald-800">Trabalhando</span>}</td>
                    <td className="text-right tabular-nums">{r.saida ? horas(duracaoMs(r)) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <Link href={`/registros?usuario=${usuario.id}`} className="link mt-3 inline-block text-sm">Ver todos os registros →</Link>
        </div>
      </div>
    </>
  );
}
