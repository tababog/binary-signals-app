import { linkGoogleAgenda } from "@/lib/agenda";
import { getT } from "@/i18n/servidor";

type Visita = Parameters<typeof linkGoogleAgenda>[0];

/** Botões para colocar a visita na agenda do celular, que avisa antes da hora. */
export function LembreteVisita({ v, compacto }: { v: Visita; compacto?: boolean }) {
  const t = getT();
  const botoes = (
    <div className="flex flex-wrap gap-2">
      <a href={linkGoogleAgenda(v)} target="_blank" rel="noreferrer" className={compacto ? "botao-secundario px-2 py-1 text-sm" : "botao"}>
        {t("Google Agenda (Android)")}
      </a>
      <a href={`/api/visitas/${v.id}/lembrete`} className={compacto ? "botao-secundario px-2 py-1 text-sm" : "botao-secundario"}>
        {t("iPhone / outros calendários")}
      </a>
    </div>
  );
  if (!compacto) return botoes;
  return (
    <details className="w-full text-sm">
      <summary className="cursor-pointer select-none font-medium text-marca-700">{t("⏰ Lembrete")}</summary>
      <div className="mt-2">{botoes}</div>
    </details>
  );
}
