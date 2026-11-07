import { exigirAdmin } from "@/lib/auth";
import { getT } from "@/i18n/servidor";
import { Cabecalho } from "@/components/ui";
import { Portfolio } from "@/components/Portfolio";

/** Portfólio como o cliente vê na proposta (em inglês). */
export default async function PaginaPortfolio() {
  await exigirAdmin();
  const t = getT();
  return (
    <>
      <Cabecalho titulo={t("Portfólio")} subtitulo={t("É o que o cliente vê no começo da proposta (sempre em inglês).")} />
      <div className="-mx-4 overflow-hidden sm:mx-0 sm:rounded-2xl sm:border sm:border-stone-200">
        <Portfolio />
      </div>
    </>
  );
}
