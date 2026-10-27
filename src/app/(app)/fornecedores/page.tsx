import Link from "next/link";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { dinheiro } from "@/lib/format";
import { Cabecalho, Vazio } from "@/components/ui";

export default async function Fornecedores({ searchParams }: { searchParams: { q?: string } }) {
  await exigirAdmin();
  const q = searchParams.q?.trim();
  const [fornecedores, totais] = await Promise.all([
    db.fornecedor.findMany({
      where: q ? { OR: [{ nome: { contains: q } }, { categoria: { contains: q } }, { documento: { contains: q } }] } : undefined,
      orderBy: { nome: "asc" },
    }),
    db.lancamento.groupBy({ by: ["fornecedorId"], where: { tipo: "SAIDA", fornecedorId: { not: null } }, _sum: { valorCent: true } }),
  ]);
  const totalPor = new Map(totais.map((t) => [t.fornecedorId, t._sum.valorCent ?? 0]));

  return (
    <>
      <Cabecalho titulo="Fornecedores" subtitulo={`${fornecedores.length} cadastrado(s)`}>
        <Link href="/fornecedores/novo" className="botao">+ Novo fornecedor</Link>
      </Cabecalho>
      <form className="mb-4">
        <input className="campo" name="q" defaultValue={q} placeholder="Buscar por nome, categoria ou CNPJ" />
      </form>
      <div className="cartao overflow-x-auto">
        {fornecedores.length === 0 ? (
          <Vazio>Nenhum fornecedor encontrado.</Vazio>
        ) : (
          <table className="tabela">
            <thead>
              <tr><th>Nome</th><th className="hidden sm:table-cell">Categoria</th><th>Telefone</th><th className="text-right">Total comprado</th></tr>
            </thead>
            <tbody>
              {fornecedores.map((f) => (
                <tr key={f.id}>
                  <td><Link href={`/fornecedores/${f.id}`} className="link">{f.nome}</Link></td>
                  <td className="hidden sm:table-cell">{f.categoria ?? "—"}</td>
                  <td>{f.telefone ?? "—"}</td>
                  <td className="text-right tabular-nums">{dinheiro(totalPor.get(f.id) ?? 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
