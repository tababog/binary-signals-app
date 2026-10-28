import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { campoData, campoDataHora, data } from "@/lib/format";
import { STATUS_VISITA } from "@/lib/constantes";
import { Cabecalho, Voltar } from "@/components/ui";
import { Formulario } from "@/components/Formulario";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { CamposVisita } from "@/components/CamposVisita";
import {
  adicionarFollowUp,
  definirResultado,
  desfazerEnvio,
  excluirFollowUp,
  excluirVisita,
  mudarDataFollowUp,
  mudarStatusVisita,
  salvarVisita,
} from "../actions";
import { EnviarFollowUp } from "@/components/EnviarFollowUp";
import { CANAIS, assuntoFollowUp, mensagemFollowUp, telefoneInternacional, type Idioma } from "@/lib/followup";
import { LembreteVisita } from "@/components/LembreteVisita";
import { dataHora } from "@/lib/format";

export default async function Visita({ params, searchParams }: { params: { id: string }; searchParams: { lembrete?: string } }) {
  const usuario = await exigirAdmin();
  const [visita, clientes] = await Promise.all([
    db.visita.findUnique({ where: { id: params.id }, include: { cliente: true, followUps: { orderBy: { dataPrevista: "asc" } } } }),
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

      {visita.status === "REALIZADA" && <SecaoFollowUp visita={visita} remetente={usuario.nome} />}

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

type VisitaComFollowUps = NonNullable<Awaited<ReturnType<typeof buscarVisita>>>;
async function buscarVisita(id: string) {
  return db.visita.findUnique({ where: { id }, include: { cliente: true, followUps: true } });
}

const RESULTADOS: Record<string, { rotulo: string; cor: string }> = {
  FECHOU: { rotulo: "Fechou contrato 🎉", cor: "bg-emerald-100 text-emerald-800" },
  SEM_INTERESSE: { rotulo: "Sem interesse", cor: "bg-stone-200 text-stone-700" },
};

function SecaoFollowUp({ visita, remetente }: { visita: VisitaComFollowUps; remetente: string }) {
  const pendentes = visita.followUps.filter((f) => !f.enviadoEm);
  const proximo = visita.resultado ? null : pendentes[0];
  const idiomas: Idioma[] = ["en", "pt", "es"];
  const dados = (ordem: number) => ({ cliente: visita.cliente.nome, servico: visita.tipoServico, remetente, ordem });

  return (
    <div className="cartao mb-4 max-w-2xl">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2>Follow-up com o cliente</h2>
        {visita.resultado ? (
          <span className={`selo ${RESULTADOS[visita.resultado]?.cor}`}>{RESULTADOS[visita.resultado]?.rotulo}</span>
        ) : (
          <span className="selo bg-sky-100 text-sky-800">Em negociação</span>
        )}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {visita.resultado ? (
          <form action={definirResultado.bind(null, visita.id, "")}>
            <BotaoEnviar className="botao-secundario">Voltar a negociar</BotaoEnviar>
          </form>
        ) : (
          <>
            <form action={definirResultado.bind(null, visita.id, "FECHOU")}>
              <BotaoEnviar>Fechou contrato</BotaoEnviar>
            </form>
            <form action={definirResultado.bind(null, visita.id, "SEM_INTERESSE")}>
              <BotaoEnviar className="botao-secundario">Sem interesse</BotaoEnviar>
            </form>
          </>
        )}
        {visita.resultado === "FECHOU" && (
          <Link href={`/obras/nova?cliente=${visita.clienteId}`} className="botao">Criar a obra</Link>
        )}
      </div>

      {proximo && (
        <div className="mb-4 rounded-lg border border-marca-500 bg-marca-50 p-3">
          <p className="mb-2 text-sm font-semibold">
            {proximo.ordem}º follow-up · {proximo.dataPrevista <= new Date() ? "para enviar hoje" : `previsto para ${data(proximo.dataPrevista)}`}
          </p>
          <EnviarFollowUp
            followUpId={proximo.id}
            mensagens={Object.fromEntries(idiomas.map((i) => [i, mensagemFollowUp(i, dados(proximo.ordem))])) as Record<Idioma, string>}
            assuntos={Object.fromEntries(idiomas.map((i) => [i, assuntoFollowUp(i)])) as Record<Idioma, string>}
            telefone={telefoneInternacional(visita.cliente.telefone)}
            email={visita.cliente.email}
          />
        </div>
      )}

      <ul className="divide-y divide-stone-100 text-sm">
        {visita.followUps.map((f) => (
          <li key={f.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
            <span>
              <b>{f.ordem}º</b> ·{" "}
              {f.enviadoEm ? (
                <>enviado em {data(f.enviadoEm)} por {CANAIS[f.canal as keyof typeof CANAIS] ?? f.canal}</>
              ) : (
                <>previsto para {data(f.dataPrevista)}{f.dataPrevista < new Date() && !visita.resultado && <span className="selo ml-2 bg-amber-100 text-amber-800">Atrasado</span>}</>
              )}
            </span>
            {f.enviadoEm ? (
              <form action={desfazerEnvio.bind(null, f.id)}>
                <BotaoEnviar className="text-xs text-stone-500 hover:underline">Desfazer</BotaoEnviar>
              </form>
            ) : (
              <span className="flex items-center gap-2">
                <form action={mudarDataFollowUp.bind(null, f.id)} className="flex items-center gap-1">
                  <input className="campo w-auto px-2 py-1 text-xs" type="date" name="data" defaultValue={campoData(f.dataPrevista)} aria-label="Nova data" />
                  <BotaoEnviar className="text-xs text-marca-700 hover:underline">Mudar</BotaoEnviar>
                </form>
                <form action={excluirFollowUp.bind(null, f.id)}>
                  <BotaoEnviar className="text-xs text-red-700 hover:underline">Excluir</BotaoEnviar>
                </form>
              </span>
            )}
          </li>
        ))}
      </ul>
      {!visita.resultado && (
        <form action={adicionarFollowUp.bind(null, visita.id)} className="mt-3 flex items-center gap-2 text-sm">
          <input className="campo w-auto px-2 py-1" type="date" name="data" required aria-label="Data do novo follow-up" />
          <BotaoEnviar className="botao-secundario px-3 py-1 text-sm">+ Follow-up</BotaoEnviar>
        </form>
      )}
    </div>
  );
}
