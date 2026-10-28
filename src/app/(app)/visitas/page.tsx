import Link from "next/link";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { Cabecalho, Vazio } from "@/components/ui";
import { ItemVisita } from "@/components/ItemVisita";
import { getT } from "@/i18n/servidor";

export default async function Visitas() {
  await exigirAdmin();
  const t = getT();
  const agora = new Date();
  const [proximas, anteriores] = await Promise.all([
    db.visita.findMany({ where: { status: "AGENDADA" }, include: { cliente: true }, orderBy: { dataHora: "asc" } }),
    db.visita.findMany({ where: { status: { not: "AGENDADA" } }, include: { cliente: true }, orderBy: { dataHora: "desc" }, take: 30 }),
  ]);

  return (
    <>
      <Cabecalho titulo={t("Visitas")} subtitulo={t("Visitas aos clientes para levantamento e orçamento")}>
        <Link href="/visitas/nova" className="botao">{t("+ Agendar visita")}</Link>
      </Cabecalho>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="cartao">
          <h2 className="mb-2">{t("Agendadas")}</h2>
          {proximas.length === 0 ? (
            <Vazio>{t("Nenhuma visita agendada.")}</Vazio>
          ) : (
            <ul className="divide-y divide-stone-100">{proximas.map((v) => <ItemVisita key={v.id} v={v} agora={agora} />)}</ul>
          )}
        </div>
        <div className="cartao">
          <h2 className="mb-2">{t("Realizadas e canceladas")}</h2>
          {anteriores.length === 0 ? (
            <Vazio>{t("Nenhuma ainda.")}</Vazio>
          ) : (
            <ul className="divide-y divide-stone-100">{anteriores.map((v) => <ItemVisita key={v.id} v={v} agora={agora} />)}</ul>
          )}
        </div>
      </div>
    </>
  );
}
