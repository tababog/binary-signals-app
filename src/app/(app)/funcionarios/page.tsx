import Link from "next/link";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { pagamento } from "@/lib/format";
import { Cabecalho } from "@/components/ui";
import { TextoUsuario } from "@/components/TextoUsuario";
import { getT } from "@/i18n/servidor";

export default async function Funcionarios({ searchParams }: { searchParams: { tipo?: string } }) {
  const tipo = searchParams.tipo === "HELPER" || searchParams.tipo === "FIXO" ? searchParams.tipo : undefined;
  await exigirAdmin();
  const t = getT();
  const [usuarios, abertos] = await Promise.all([
    db.usuario.findMany({ where: tipo ? { vinculo: tipo } : undefined, orderBy: [{ ativo: "desc" }, { papel: "asc" }, { nome: "asc" }] }),
    db.registroPonto.findMany({ where: { saida: null }, include: { obra: true } }),
  ]);
  const naObra = new Map(abertos.map((r) => [r.usuarioId, r.obra.nome]));

  return (
    <>
      <Cabecalho titulo={t("Equipe")} subtitulo={t("Funcionários, helpers e administradores")}>
        <Link href="/funcionarios/novo?vinculo=HELPER" className="botao-secundario">{t("+ Novo helper")}</Link>
        <Link href="/funcionarios/novo" className="botao">{t("+ Novo funcionário")}</Link>
      </Cabecalho>
      <div className="mb-4 flex flex-wrap gap-2 text-sm">
        {[
          { v: undefined, r: t("Todos") },
          { v: "FIXO", r: t("Funcionários") },
          { v: "HELPER", r: t("Helpers") },
        ].map((f) => (
          <Link key={f.r} href={f.v ? `/funcionarios?tipo=${f.v}` : "/funcionarios"} className={`rounded-full px-3 py-1 ${tipo === f.v ? "bg-stone-800 text-white" : "bg-white"}`}>
            {f.r}
          </Link>
        ))}
      </div>
      <div className="cartao overflow-x-auto">
        <table className="tabela">
          <thead>
            <tr><th>{t("Nome")}</th><th className="hidden sm:table-cell">{t("Função")}</th><th>{t("Acesso")}</th><th className="text-right">{t("Pagamento")}</th><th>{t("Agora")}</th></tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className={u.ativo ? "" : "opacity-50"}>
                <td>
                  <Link href={`/funcionarios/${u.id}`} className="link">{u.nome}</Link>
                  <div className="text-xs text-stone-500">{u.email ?? u.telefone}</div>
                </td>
                <td className="hidden sm:table-cell">{u.funcao ? <TextoUsuario texto={u.funcao} /> : "—"}</td>
                <td>
                  {u.papel === "ADMIN" ? (
                    <span className="selo bg-marca-100 text-marca-700">{t("Admin")}</span>
                  ) : u.vinculo === "HELPER" ? (
                    <span className="selo bg-sky-100 text-sky-800">{t("Helper")}</span>
                  ) : (
                    <span className="selo bg-stone-100">{t("Funcionário")}</span>
                  )}
                  {!u.ativo && <span className="selo ml-1 bg-red-100 text-red-700">{t("Inativo")}</span>}
                  {u.vinculo === "HELPER" && u.ativo && !u.documento && <span className="selo ml-1 bg-red-100 text-red-700">{t("Falta EIN/ITIN")}</span>}
                  {u.ativo && u.conviteHash && u.conviteExpira && u.conviteExpira > new Date() && (
                    <span className="selo ml-1 bg-amber-100 text-amber-800">{t("Convite pendente")}</span>
                  )}
                </td>
                <td className="whitespace-nowrap text-right tabular-nums">{pagamento(u)}</td>
                <td>{naObra.has(u.id) ? <span className="selo bg-emerald-100 text-emerald-800">{t("Em {obra}", { obra: naObra.get(u.id)! })}</span> : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
