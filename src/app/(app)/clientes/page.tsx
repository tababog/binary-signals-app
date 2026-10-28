import Link from "next/link";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { Cabecalho, Vazio } from "@/components/ui";
import { getT } from "@/i18n/servidor";

export default async function Clientes({ searchParams }: { searchParams: { q?: string } }) {
  await exigirAdmin();
  const t = getT();
  const q = searchParams.q?.trim();
  const clientes = await db.cliente.findMany({
    where: q ? { OR: [{ nome: { contains: q, mode: "insensitive" } }, { documento: { contains: q } }, { telefone: { contains: q } }] } : undefined,
    include: { _count: { select: { obras: true } } },
    orderBy: { nome: "asc" },
  });

  return (
    <>
      <Cabecalho titulo={t("Clientes")} subtitulo={t("{n} cadastrado(s)", { n: clientes.length })}>
        <Link href="/clientes/novo" className="botao">{t("+ Cliente novo")}</Link>
      </Cabecalho>
      <form className="mb-4">
        <input className="campo" name="q" defaultValue={q} placeholder={t("Buscar por nome ou telefone")} />
      </form>
      <div className="cartao overflow-x-auto">
        {clientes.length === 0 ? (
          <Vazio>{t("Nenhum cliente encontrado.")}</Vazio>
        ) : (
          <table className="tabela">
            <thead>
              <tr><th>{t("Nome")}</th><th>{t("Telefone")}</th><th className="hidden sm:table-cell">{t("E-mail")}</th><th>{t("Obras")}</th></tr>
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
