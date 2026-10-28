import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { dinheiro } from "@/lib/format";
import { nomeStatus } from "@/lib/constantes";
import { Cabecalho, SeloStatus, Vazio, Voltar } from "@/components/ui";
import { Formulario } from "@/components/Formulario";
import { CamposContato } from "@/components/CamposContato";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { excluirCliente, salvarCliente } from "../actions";
import { getT } from "@/i18n/servidor";

export default async function Cliente({ params }: { params: { id: string } }) {
  await exigirAdmin();
  const t = getT();
  const cliente = await db.cliente.findUnique({
    where: { id: params.id },
    include: { obras: { orderBy: { criadoEm: "desc" } } },
  });
  if (!cliente) notFound();

  return (
    <>
      <Voltar href="/clientes" rotulo={t("Clientes")} />
      <Cabecalho titulo={cliente.nome}>
        <Link href={`/visitas/nova?cliente=${cliente.id}`} className="botao-secundario">{t("+ Agendar visita")}</Link>
        <Link href={`/obras/nova?cliente=${cliente.id}`} className="botao">{t("+ Nova obra para este cliente")}</Link>
      </Cabecalho>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="cartao">
          <h2 className="mb-3">{t("Dados do cliente")}</h2>
          <Formulario acao={salvarCliente.bind(null, cliente.id)}>
            <CamposContato valor={cliente} />
            <BotaoEnviar>{t("Salvar alterações")}</BotaoEnviar>
          </Formulario>
        </div>

        <div className="space-y-4">
          <div className="cartao">
            <h2 className="mb-3">{t("Obras")}</h2>
            {cliente.obras.length === 0 ? (
              <Vazio>{t("Nenhuma obra para este cliente ainda.")}</Vazio>
            ) : (
              <ul className="divide-y divide-stone-100">
                {cliente.obras.map((o) => (
                  <li key={o.id} className="flex items-center justify-between py-2">
                    <Link href={`/obras/${o.id}`} className="link">{o.nome}</Link>
                    <span className="flex items-center gap-2 text-sm">
                      {dinheiro(o.valorContratoCent)}
                      <SeloStatus status={o.status} rotulo={t(nomeStatus(o.status))} />
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {cliente.obras.length === 0 && (
            <form action={excluirCliente.bind(null, cliente.id)}>
              <BotaoEnviar className="botao-perigo" confirmar={t("Excluir este cliente?")}>{t("Excluir cliente")}</BotaoEnviar>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
