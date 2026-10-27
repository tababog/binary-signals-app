import Link from "next/link";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { Cabecalho, Vazio } from "@/components/ui";

export default async function Clientes({ searchParams }: { searchParams: { q?: string } }) {
  await exigirAdmin();
  const q = searchParams.q?.trim();
  const clientes = await db.cliente.findMany({
    where: q ? { OR: [{ nome: { contains: q } }, { documento: { contains: q } }, { telefone: { contains: q } }] } : undefined,
    include: { _count: { select: { obras: true } } },
    orderBy: { nome: "asc" },
  });

  return (
    <>
      <Cabecalho titulo="Clientes" subtitulo={`${clientes.length} cadastrado(s)`}>
        <Link href="/clientes/novo" className="botao">+ Novo cliente</Link>
      </Cabecalho>
      <form className="mb-4">
        <input className="campo" name="q" defaultValue={q} placeholder="Buscar por nome, CPF/CNPJ ou telefone" />
      </form>
      <div className="cartao overflow-x-auto">
        {clientes.length === 0 ? (
          <Vazio>Nenhum cliente encontrado.</Vazio>
        ) : (
          <table className="tabela">
            <thead>
              <tr><th>Nome</th><th>Telefone</th><th className="hidden sm:table-cell">E-mail</th><th>Obras</th></tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr key={c.id}>
                  <td><Link href={`/clientes/${c.id}`} className="link">{c.nome}</Link></td>
                  <td>{c.telefone ?? "—"}</td>
                  <td className="hidden sm:table-cell">{c.email ?? "—"}</td>
                  <td>{c._count.obras}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
