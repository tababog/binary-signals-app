import Link from "next/link";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { dinheiro } from "@/lib/format";
import { Cabecalho, Vazio } from "@/components/ui";
import { SeloSeguro } from "@/components/SeloSeguro";

/** Lista de fornecedores ou de subcontratados (a página /subcontratados usa a mesma lista). */
export async function ListaFornecedores({ tipo, q: busca }: { tipo: "FORNECEDOR" | "SUBCONTRATADO"; q?: string }) {
  await exigirAdmin();
  const q = busca?.trim();
  const sub = tipo === "SUBCONTRATADO";
  const [fornecedores, totais] = await Promise.all([
    db.fornecedor.findMany({
      where: q ? { tipo, OR: [{ nome: { contains: q, mode: "insensitive" } }, { categoria: { contains: q, mode: "insensitive" } }, { documento: { contains: q } }] } : { tipo },
      orderBy: { nome: "asc" },
    }),
    db.lancamento.groupBy({ by: ["fornecedorId"], where: { tipo: "SAIDA", fornecedorId: { not: null } }, _sum: { valorCent: true } }),
  ]);
  const totalPor = new Map(totais.map((t) => [t.fornecedorId, t._sum.valorCent ?? 0]));

  return (
    <>
      <Cabecalho
        titulo={sub ? "Subcontratados" : "Fornecedores"}
        subtitulo={sub ? "Quem recebe por serviço repassado (subcontractors)" : `${fornecedores.length} cadastrado(s)`}
      >
        <Link href={`/fornecedores/novo?tipo=${tipo}`} className="botao">{sub ? "+ Novo subcontratado" : "+ Novo fornecedor"}</Link>
      </Cabecalho>
      <form className="mb-4">
        <input className="campo" name="q" defaultValue={q} placeholder={sub ? "Buscar por nome ou especialidade" : "Buscar por nome ou categoria"} />
      </form>
      <div className="cartao overflow-x-auto">
        {fornecedores.length === 0 ? (
          <Vazio>{sub ? "Nenhum subcontratado cadastrado." : "Nenhum fornecedor encontrado."}</Vazio>
        ) : (
          <table className="tabela">
            <thead>
              <tr><th>Nome</th><th className="hidden sm:table-cell">{sub ? "Especialidade" : "Categoria"}</th><th>{sub ? "Seguro" : "Telefone"}</th><th className="text-right">{sub ? "Total pago" : "Total comprado"}</th></tr>
            </thead>
            <tbody>
              {fornecedores.map((f) => (
                <tr key={f.id}>
                  <td><Link href={`/fornecedores/${f.id}`} className="link">{f.nome}</Link></td>
                  <td className="hidden sm:table-cell">{f.categoria ?? "—"}</td>
                  <td>{sub ? <SeloSeguro validade={f.seguroValidade} /> : f.telefone ?? "—"}</td>
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
