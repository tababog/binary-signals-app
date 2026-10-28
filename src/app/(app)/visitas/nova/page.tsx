import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { Cabecalho, Voltar } from "@/components/ui";
import { Formulario } from "@/components/Formulario";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { CamposVisita } from "@/components/CamposVisita";
import { salvarVisita } from "../actions";

export default async function NovaVisita({ searchParams }: { searchParams: { cliente?: string } }) {
  await exigirAdmin();
  const clientes = await db.cliente.findMany({ orderBy: { nome: "asc" }, select: { id: true, nome: true, endereco: true } });
  return (
    <>
      <Voltar href="/visitas" rotulo="Visitas" />
      <Cabecalho titulo="Agendar visita" />
      <div className="cartao max-w-2xl">
        <Formulario acao={salvarVisita.bind(null, null)}>
          <CamposVisita clientes={clientes} clienteInicial={searchParams.cliente} />
          <BotaoEnviar>Agendar</BotaoEnviar>
        </Formulario>
      </div>
    </>
  );
}
