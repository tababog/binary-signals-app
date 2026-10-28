import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { campoDataHora } from "@/lib/format";
import { STATUS_VISITA } from "@/lib/constantes";
import { Cabecalho, Voltar } from "@/components/ui";
import { Formulario } from "@/components/Formulario";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { CamposVisita } from "@/components/CamposVisita";
import { excluirVisita, mudarStatusVisita, salvarVisita } from "../actions";
import { LembreteVisita } from "@/components/LembreteVisita";
import { dataHora } from "@/lib/format";

export default async function Visita({ params, searchParams }: { params: { id: string }; searchParams: { lembrete?: string } }) {
  await exigirAdmin();
  const [visita, clientes] = await Promise.all([
    db.visita.findUnique({ where: { id: params.id }, include: { cliente: true } }),
    db.cliente.findMany({ orderBy: { nome: "asc" }, select: { id: true, nome: true, endereco: true } }),
  ]);
  if (!visita) notFound();

  return (
    <>
      <Voltar href="/visitas" rotulo="Visitas" />
      <Cabecalho titulo={`Visita — ${visita.cliente.nome}`} subtitulo={(STATUS_VISITA as Record<string, string>)[visita.status]}>
        {visita.status === "AGENDADA" && (
          <>
            <form action={mudarStatusVisita.bind(null, visita.id, "REALIZADA")}>
              <BotaoEnviar>Marcar como realizada</BotaoEnviar>
            </form>
            <form action={mudarStatusVisita.bind(null, visita.id, "CANCELADA")}>
              <BotaoEnviar className="botao-secundario">Cancelar visita</BotaoEnviar>
            </form>
          </>
        )}
        {visita.status !== "AGENDADA" && (
          <form action={mudarStatusVisita.bind(null, visita.id, "AGENDADA")}>
            <BotaoEnviar className="botao-secundario">Voltar para agendada</BotaoEnviar>
          </form>
        )}
        <Link href={`/obras/nova?cliente=${visita.clienteId}`} className="botao-secundario">Fechou? Criar obra</Link>
      </Cabecalho>

      {visita.status === "AGENDADA" && visita.dataHora > new Date() && (
        <div className={`cartao mb-4 max-w-2xl ${searchParams.lembrete ? "border-marca-500 bg-marca-50" : ""}`}>
          <h2 className="mb-1">⏰ Lembrete no celular</h2>
          <p className="mb-3 text-sm text-stone-600">
            {searchParams.lembrete && <b>Visita agendada para {dataHora(visita.dataHora)}. </b>}
            Coloque na agenda do celular para não esquecer. No iPhone e em outros calendários, o evento já vem com dois
            avisos: 1 dia antes e 1 hora antes. No Google Agenda, valem os avisos padrão da sua agenda.
          </p>
          <LembreteVisita v={visita} />
        </div>
      )}

      <div className="cartao max-w-2xl">
        <Formulario acao={salvarVisita.bind(null, visita.id)}>
          <input type="hidden" name="status" value={visita.status} />
          <CamposVisita
            clientes={clientes}
            valor={{ ...visita, dataHora: campoDataHora(visita.dataHora) }}
          />
          <BotaoEnviar>Salvar alterações</BotaoEnviar>
        </Formulario>
      </div>
      <form action={excluirVisita.bind(null, visita.id)} className="mt-6">
        <BotaoEnviar className="botao-perigo" confirmar="Excluir esta visita?">Excluir visita</BotaoEnviar>
      </form>
    </>
  );
}
