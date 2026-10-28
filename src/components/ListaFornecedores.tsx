import Link from "next/link";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { dinheiro } from "@/lib/format";
import { Cabecalho, Vazio } from "@/components/ui";
import { SeloSeguro } from "@/components/SeloSeguro";
import { TextoUsuario } from "@/components/TextoUsuario";
import { getT } from "@/i18n/servidor";
import { documentoMascarado } from "@/lib/documento-fiscal";

/** Lista de fornecedores ou de subcontratados (a página /subcontratados usa a mesma lista). */
export async function ListaFornecedores({ tipo, q: busca }: { tipo: "FORNECEDOR" | "SUBCONTRATADO"; q?: string }) {
  await exigirAdmin();
  const q = busca?.trim();
  const sub = tipo === "SUBCONTRATADO";
  const t = getT();
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
        titulo={sub ? t("Subcontratados") : t("Fornecedores")}
        subtitulo={sub ? t("Quem recebe por serviço repassado (subcontractors)") : t("{n} cadastrado(s)", { n: fornecedores.length })}
      >
        <Link href={`/fornecedores/novo?tipo=${tipo}`} className="botao">{sub ? t("+ Novo subcontratado") : t("+ Novo fornecedor")}</Link>
      </Cabecalho>
      <form className="mb-4">
        <input className="campo" name="q" defaultValue={q} placeholder={sub ? t("Buscar por nome ou especialidade") : t("Buscar por nome ou categoria")} />
      </form>
      <div className="cartao overflow-x-auto">
        {fornecedores.length === 0 ? (
          <Vazio>{sub ? t("Nenhum subcontratado cadastrado.") : t("Nenhum fornecedor encontrado.")}</Vazio>
        ) : (
          <table className="tabela">
            <thead>
              <tr><th>{t("Nome")}</th><th className="hidden sm:table-cell">{sub ? t("Especialidade") : t("Categoria")}</th><th>{sub ? t("Seguro") : t("Telefone")}</th><th className="text-right">{sub ? t("Total pago") : t("Total comprado")}</th></tr>
            </thead>
            <tbody>
              {fornecedores.map((f) => (
                <tr key={f.id}>
                  <td>
                    <Link href={`/fornecedores/${f.id}`} className="link">{f.nome}</Link>
                    {f.documento ? (
                      <div className="text-xs text-stone-500">{documentoMascarado(f.tipoDocumento, f.documento)}</div>
                    ) : (
                      sub && <span className="selo mt-0.5 bg-red-100 text-red-700">{t("Falta EIN/ITIN")}</span>
                    )}
                  </td>
                  <td className="hidden sm:table-cell">{f.categoria ? <TextoUsuario texto={f.categoria} /> : "—"}</td>
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
