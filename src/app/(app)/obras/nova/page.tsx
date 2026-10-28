import Link from "next/link";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { Cabecalho, Voltar } from "@/components/ui";
import { Formulario } from "@/components/Formulario";
import { CamposObra } from "@/components/CamposObra";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { salvarObra } from "../actions";
import { getT } from "@/i18n/servidor";

export default async function NovaObra({ searchParams }: { searchParams: { cliente?: string } }) {
  await exigirAdmin();
  const t = getT();
  const clientes = await db.cliente.findMany({ orderBy: { nome: "asc" }, select: { id: true, nome: true } });

  return (
    <>
      <Voltar href="/obras" rotulo={t("Obras")} />
      <Cabecalho titulo={t("Nova obra")} />
      <div className="cartao">
        {clientes.length === 0 ? (
          <p className="text-sm">
            {t("Cadastre um cliente antes de criar a obra.")} <Link href="/clientes/novo" className="link">{t("Cadastrar cliente")}</Link>
          </p>
        ) : (
          <Formulario acao={salvarObra.bind(null, null)}>
            <CamposObra clientes={clientes} clienteInicial={searchParams.cliente} />
            <BotaoEnviar>{t("Criar obra")}</BotaoEnviar>
          </Formulario>
        )}
      </div>
    </>
  );
}
