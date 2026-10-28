import Link from "next/link";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { dinheiro } from "@/lib/format";
import { STATUS_OBRA, nomeStatus } from "@/lib/constantes";
import { resumoObra } from "@/lib/financeiro";
import { Cabecalho, SeloStatus, Vazio } from "@/components/ui";
import { getT } from "@/i18n/servidor";

export default async function Obras({ searchParams }: { searchParams: { status?: string } }) {
  await exigirAdmin();
  const t = getT();
  const status = searchParams.status && searchParams.status in STATUS_OBRA ? searchParams.status : undefined;
  const obras = await db.obra.findMany({ where: status ? { status } : undefined, orderBy: { criadoEm: "desc" } });
  const resumos = await Promise.all(obras.map((o) => resumoObra(o.id)));

  return (
    <>
      <Cabecalho titulo={t("Obras")} subtitulo={t("{n} obra(s)", { n: obras.length })}>
        <Link href="/obras/nova" className="botao">{t("+ Nova obra")}</Link>
      </Cabecalho>

      <div className="mb-4 flex flex-wrap gap-2 text-sm">
        <Link href="/obras" className={`rounded-full px-3 py-1 ${!status ? "bg-stone-800 text-white" : "bg-white"}`}>{t("Todas")}</Link>
        {Object.entries(STATUS_OBRA).map(([k, v]) => (
          <Link key={k} href={`/obras?status=${k}`} className={`rounded-full px-3 py-1 ${status === k ? "bg-stone-800 text-white" : "bg-white"}`}>{t(v)}</Link>
        ))}
      </div>

      {resumos.length === 0 ? (
        <div className="cartao"><Vazio>{t("Nenhuma obra cadastrada.")}</Vazio></div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {resumos.map((r) => (
            <Link key={r.obra.id} href={`/obras/${r.obra.id}`} className="cartao block hover:border-marca-500">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold">{r.obra.nome}</div>
                  <div className="text-sm text-stone-500">{r.obra.cliente.nome}</div>
                </div>
                <SeloStatus status={r.obra.status} rotulo={t(nomeStatus(r.obra.status))} />
              </div>
              <dl className="mt-3 grid grid-cols-3 gap-2 text-sm">
                <div><dt className="text-xs text-stone-500">{t("Contrato")}</dt><dd className="tabular-nums">{dinheiro(r.obra.valorContratoCent)}</dd></div>
                <div><dt className="text-xs text-stone-500">{t("Custo até agora")}</dt><dd className="tabular-nums">{dinheiro(r.custoTotal)}</dd></div>
                <div><dt className="text-xs text-stone-500">{t("Saldo em caixa")}</dt><dd className={`tabular-nums ${r.saldoCaixa < 0 ? "text-red-700" : "text-emerald-700"}`}>{dinheiro(r.saldoCaixa)}</dd></div>
              </dl>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
