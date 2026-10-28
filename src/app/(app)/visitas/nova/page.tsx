import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { Cabecalho, Voltar } from "@/components/ui";
import { Formulario } from "@/components/Formulario";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { CamposVisita } from "@/components/CamposVisita";
import { salvarVisita } from "../actions";
import { getT } from "@/i18n/servidor";

export default async function NovaVisita({ searchParams }: { searchParams: { cliente?: string } }) {
  await exigirAdmin();
  const t = getT();
  const [clientes, personalizados] = await Promise.all([
    db.cliente.findMany({ orderBy: { nome: "asc" }, select: { id: true, nome: true, endereco: true } }),
    db.servicoPersonalizado.findMany({ orderBy: { nome: "asc" } }),
  ]);
  return (
    <>
      <Voltar href="/visitas" rotulo={t("Visitas")} />
      <Cabecalho titulo={t("Agendar visita")} />
      <div className="cartao max-w-2xl">
        <Formulario acao={salvarVisita.bind(null, null)}>
          <CamposVisita clientes={clientes} personalizados={personalizados.map((p) => p.nome)} clienteInicial={searchParams.cliente} />
          <BotaoEnviar>{t("Agendar")}</BotaoEnviar>
        </Formulario>
      </div>
    </>
  );
}
