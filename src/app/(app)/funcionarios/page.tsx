import Link from "next/link";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { pagamento } from "@/lib/format";
import { Cabecalho } from "@/components/ui";

export default async function Funcionarios({ searchParams }: { searchParams: { tipo?: string } }) {
  const tipo = searchParams.tipo === "HELPER" || searchParams.tipo === "FIXO" ? searchParams.tipo : undefined;
  await exigirAdmin();
  const [usuarios, abertos] = await Promise.all([
    db.usuario.findMany({ where: tipo ? { vinculo: tipo } : undefined, orderBy: [{ ativo: "desc" }, { papel: "asc" }, { nome: "asc" }] }),
    db.registroPonto.findMany({ where: { saida: null }, include: { obra: true } }),
  ]);
  const naObra = new Map(abertos.map((r) => [r.usuarioId, r.obra.nome]));

  return (
    <>
      <Cabecalho titulo="Equipe" subtitulo="Funcionários, helpers e administradores">
        <Link href="/funcionarios/novo?vinculo=HELPER" className="botao-secundario">+ Novo helper</Link>
        <Link href="/funcionarios/novo" className="botao">+ Novo funcionário</Link>
      </Cabecalho>
      <div className="mb-4 flex flex-wrap gap-2 text-sm">
        {[
          { v: undefined, r: "Todos" },
          { v: "FIXO", r: "Funcionários" },
          { v: "HELPER", r: "Helpers" },
        ].map((f) => (
          <Link key={f.r} href={f.v ? `/funcionarios?tipo=${f.v}` : "/funcionarios"} className={`rounded-full px-3 py-1 ${tipo === f.v ? "bg-stone-800 text-white" : "bg-white"}`}>
            {f.r}
          </Link>
        ))}
      </div>
      <div className="cartao overflow-x-auto">
        <table className="tabela">
          <thead>
            <tr><th>Nome</th><th className="hidden sm:table-cell">Função</th><th>Acesso</th><th className="text-right">Pagamento</th><th>Agora</th></tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className={u.ativo ? "" : "opacity-50"}>
                <td>
                  <Link href={`/funcionarios/${u.id}`} className="link">{u.nome}</Link>
                  <div className="text-xs text-stone-500">{u.email ?? u.telefone}</div>
                </td>
                <td className="hidden sm:table-cell">{u.funcao ?? "—"}</td>
                <td>
                  {u.papel === "ADMIN" ? (
                    <span className="selo bg-marca-100 text-marca-700">Admin</span>
                  ) : u.vinculo === "HELPER" ? (
                    <span className="selo bg-sky-100 text-sky-800">Helper</span>
                  ) : (
                    <span className="selo bg-stone-100">Funcionário</span>
                  )}
                  {!u.ativo && <span className="selo ml-1 bg-red-100 text-red-700">Inativo</span>}
                  {u.ativo && u.conviteHash && u.conviteExpira && u.conviteExpira > new Date() && (
                    <span className="selo ml-1 bg-amber-100 text-amber-800">Convite pendente</span>
                  )}
                </td>
                <td className="whitespace-nowrap text-right tabular-nums">{pagamento(u)}</td>
                <td>{naObra.has(u.id) ? <span className="selo bg-emerald-100 text-emerald-800">Em {naObra.get(u.id)}</span> : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
