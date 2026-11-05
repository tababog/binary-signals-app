import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { Cabecalho, Vazio } from "@/components/ui";
import { getT } from "@/i18n/servidor";

// Atalho do "+" e do Painel: escolher a obra em um toque e cair direto no formulário de despesa ou recebimento.
export default async function EscolherObra({ params }: { params: { tipo: string } }) {
  await exigirAdmin();
  if (params.tipo !== "despesa" && params.tipo !== "recebimento") notFound();
  const t = getT();
  // Obras em andamento primeiro, depois as que tiveram lançamento mais recente
  const obras = await db.obra.findMany({
    where: { status: { not: "CONCLUIDA" } },
    include: { cliente: { select: { nome: true } }, lancamentos: { select: { criadoEm: true }, orderBy: { criadoEm: "desc" }, take: 1 } },
  });
  const ordem = (s: string) => (s === "EM_ANDAMENTO" ? 0 : s === "PLANEJADA" ? 1 : 2);
  obras.sort((a, b) => ordem(a.status) - ordem(b.status) || (b.lancamentos[0]?.criadoEm.getTime() ?? 0) - (a.lancamentos[0]?.criadoEm.getTime() ?? 0));

  return (
    <>
      <Cabecalho titulo={params.tipo === "despesa" ? t("Lançar despesa") : t("Receber pagamento")} subtitulo={t("Em qual obra?")} />
      {obras.length === 0 ? (
        <Vazio>{t("Nenhuma obra em aberto.")}</Vazio>
      ) : (
        <ul className="mx-auto grid max-w-2xl gap-2 sm:grid-cols-2">
          {obras.map((o) => (
            <li key={o.id}>
              <Link href={`/obras/${o.id}/${params.tipo}`} className="cartao flex items-center justify-between gap-3 active:bg-marca-50">
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{o.nome}</span>
                  <span className="block truncate text-sm text-stone-500">{o.cliente.nome}</span>
                </span>
                <span className="text-xl text-marca-700" aria-hidden="true">›</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
