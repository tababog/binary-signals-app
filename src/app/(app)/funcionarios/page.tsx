import Link from "next/link";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { dinheiro } from "@/lib/format";
import { Cabecalho } from "@/components/ui";

export default async function Funcionarios() {
  await exigirAdmin();
  const [usuarios, abertos] = await Promise.all([
    db.usuario.findMany({ orderBy: [{ ativo: "desc" }, { papel: "asc" }, { nome: "asc" }] }),
    db.registroPonto.findMany({ where: { saida: null }, include: { obra: true } }),
  ]);
  const naObra = new Map(abertos.map((r) => [r.usuarioId, r.obra.nome]));

  return (
    <>
      <Cabecalho titulo="Funcionários e usuários" subtitulo="Cada funcionário entra no app com e-mail e senha para registrar o ponto">
        <Link href="/funcionarios/novo" className="botao">+ Novo funcionário</Link>
      </Cabecalho>
      <div className="cartao overflow-x-auto">
        <table className="tabela">
          <thead>
            <tr><th>Nome</th><th className="hidden sm:table-cell">Função</th><th>Acesso</th><th className="text-right">Valor/hora</th><th>Agora</th></tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className={u.ativo ? "" : "opacity-50"}>
                <td>
                  <Link href={`/funcionarios/${u.id}`} className="link">{u.nome}</Link>
                  <div className="text-xs text-stone-500">{u.email}</div>
                </td>
                <td className="hidden sm:table-cell">{u.funcao ?? "—"}</td>
                <td>
                  {u.papel === "ADMIN" ? <span className="selo bg-marca-100 text-marca-700">Admin</span> : <span className="selo bg-stone-100">Funcionário</span>}
                  {!u.ativo && <span className="selo ml-1 bg-red-100 text-red-700">Inativo</span>}
                  {u.ativo && u.conviteHash && u.conviteExpira && u.conviteExpira > new Date() && (
                    <span className="selo ml-1 bg-amber-100 text-amber-800">Convite pendente</span>
                  )}
                </td>
                <td className="text-right tabular-nums">{dinheiro(u.valorHoraCent)}</td>
                <td>{naObra.has(u.id) ? <span className="selo bg-emerald-100 text-emerald-800">Em {naObra.get(u.id)}</span> : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
