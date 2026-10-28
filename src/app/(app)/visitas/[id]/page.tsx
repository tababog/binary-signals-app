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
  adicionarFotosVisita,
  excluirFotoVisita,
} from "../actions";
import { FotosTrabalho } from "@/components/FotosTrabalho";
import { descreverSubservicos, nomeTipoServico } from "@/lib/constantes";
import { EnviarFollowUp } from "@/components/EnviarFollowUp";
import { CANAIS, assuntoFollowUp, mensagemFollowUp, telefoneInternacional, type Idioma } from "@/lib/followup";
import { LembreteVisita } from "@/components/LembreteVisita";
import { dataHora } from "@/lib/format";
import { getT } from "@/i18n/servidor";

export default async function Visita({ params, searchParams }: { params: { id: string }; searchParams: { lembrete?: string; erroFoto?: string } }) {
  const usuario = await exigirAdmin();
  const t = getT();
  const [visita, clientes, personalizados] = await Promise.all([
    db.visita.findUnique({
      where: { id: params.id },
      include: { cliente: true, followUps: { orderBy: { dataPrevista: "asc" } }, fotos: { orderBy: { criadoEm: "asc" } } },
    }),
    db.cliente.findMany({ orderBy: { nome: "asc" }, select: { id: true, nome: true, endereco: true } }),
    db.servicoPersonalizado.findMany({ orderBy: { nome: "asc" } }),
  ]);
  if (!visita) notFound();

  return (
    <>
      <Voltar href="/visitas" rotulo={t("Visitas")} />
      <Cabecalho titulo={t("Visita — {cliente}", { cliente: visita.cliente.nome })} subtitulo={t((STATUS_VISITA as Record<string, string>)[visita.status])}>
        {visita.status === "AGENDADA" && (
          <>
            <form action={mudarStatusVisita.bind(null, visita.id, "REALIZADA")}>
              <BotaoEnviar>{t("Marcar como realizada")}</BotaoEnviar>
            </form>
            <form action={mudarStatusVisita.bind(null, visita.id, "CANCELADA")}>
              <BotaoEnviar className="botao-secundario">{t("Cancelar visita")}</BotaoEnviar>
            </form>
          </>
        )}
        {visita.status !== "AGENDADA" && (
          <form action={mudarStatusVisita.bind(null, visita.id, "AGENDADA")}>
            <BotaoEnviar className="botao-secundario">{t("Voltar para agendada")}</BotaoEnviar>
          </form>
        )}
        <Link href={`/orcamentos/novo?visita=${visita.id}`} className="botao-secundario">{t("Montar orçamento")}</Link>
        <Link href={`/obras/nova?cliente=${visita.clienteId}`} className="botao-secundario">{t("Fechou? Criar obra")}</Link>
      </Cabecalho>

      {visita.status === "AGENDADA" && visita.dataHora > new Date() && (
        <div className={`cartao mb-4 max-w-2xl ${searchParams.lembrete ? "border-marca-500 bg-marca-50" : ""}`}>
          <h2 className="mb-1">{t("⏰ Lembrete no celular")}</h2>
          <p className="mb-3 text-sm text-stone-600">
            {searchParams.lembrete && <b>{t("Visita agendada para {quando}.", { quando: dataHora(visita.dataHora) })} </b>}
            {t("Coloque na agenda do celular para não esquecer. No iPhone e em outros calendários, o evento já vem com dois avisos: 1 dia antes e 1 hora antes. No Google Agenda, valem os avisos padrão da sua agenda.")}
          </p>
          <LembreteVisita v={visita} />
        </div>
      )}

      {visita.status === "REALIZADA" && <SecaoFollowUp visita={visita} remetente={usuario.nome} />}

      <div className="cartao mb-4 max-w-2xl">
        <h2 className="mb-1">{t("Fotos do trabalho")}</h2>
        {visita.tipoServico && (
          <p className="mb-3 text-sm text-stone-600">
            <b>{t(nomeTipoServico(visita.tipoServico))}</b>
            {visita.subServicos && ` · ${descreverSubservicos(visita.tipoServico, visita.subServicos, t)}`}
          </p>
        )}
        {searchParams.erroFoto && <p className="mb-3 rounded-lg bg-amber-50 p-2 text-sm text-amber-900">{t("A visita foi salva, mas alguma foto não foi enviada. Adicione de novo abaixo.")}</p>}
        {visita.fotos.length > 0 && (
          <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {visita.fotos.map((f) => (
              <div key={f.id} className="relative">
                <a href={`/api/comprovantes/${f.arquivo}`} target="_blank" rel="noreferrer">
                  <img src={`/api/comprovantes/${f.arquivo}`} alt="" loading="lazy" className="aspect-square w-full rounded-lg object-cover" />
                </a>
                <form action={excluirFotoVisita.bind(null, f.id)} className="absolute right-1 top-1">
                  <BotaoEnviar className="rounded-full bg-white/90 px-2 text-sm text-red-700 shadow" confirmar={t("Excluir esta foto?")}>×</BotaoEnviar>
                </form>
              </div>
            ))}
          </div>
        )}
        <Formulario acao={adicionarFotosVisita.bind(null, visita.id)} className="space-y-3" limparAoSalvar>
          <FotosTrabalho />
          <BotaoEnviar className="botao-secundario">{t("Salvar fotos")}</BotaoEnviar>
        </Formulario>
      </div>

      <div className="cartao max-w-2xl">
        <Formulario acao={salvarVisita.bind(null, visita.id)}>
          <input type="hidden" name="status" value={visita.status} />
          <CamposVisita
            clientes={clientes}
            personalizados={personalizados.map((p) => p.nome)}
            comFotos={false}
            valor={{ ...visita, dataHora: campoDataHora(visita.dataHora) }}
          />
          <BotaoEnviar>{t("Salvar alterações")}</BotaoEnviar>
        </Formulario>
      </div>
      <form action={excluirVisita.bind(null, visita.id)} className="mt-6">
        <BotaoEnviar className="botao-perigo" confirmar={t("Excluir esta visita?")}>{t("Excluir visita")}</BotaoEnviar>
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
  const t = getT();
  const idiomas: Idioma[] = ["en", "pt", "es"];
  const dados = (ordem: number) => ({ cliente: visita.cliente.nome, servico: visita.tipoServico, remetente, ordem });

  return (
    <div className="cartao mb-4 max-w-2xl">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2>{t("Follow-up com o cliente")}</h2>
        {visita.resultado ? (
          <span className={`selo ${RESULTADOS[visita.resultado]?.cor}`}>{t(RESULTADOS[visita.resultado]?.rotulo ?? "")}</span>
        ) : (
          <span className="selo bg-sky-100 text-sky-800">{t("Em negociação")}</span>
        )}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {visita.resultado ? (
          <form action={definirResultado.bind(null, visita.id, "")}>
            <BotaoEnviar className="botao-secundario">{t("Voltar a negociar")}</BotaoEnviar>
          </form>
        ) : (
          <>
            <form action={definirResultado.bind(null, visita.id, "FECHOU")}>
              <BotaoEnviar>{t("Fechou contrato")}</BotaoEnviar>
            </form>
            <form action={definirResultado.bind(null, visita.id, "SEM_INTERESSE")}>
              <BotaoEnviar className="botao-secundario">{t("Sem interesse")}</BotaoEnviar>
            </form>
          </>
        )}
        {visita.resultado === "FECHOU" && (
          <Link href={`/obras/nova?cliente=${visita.clienteId}`} className="botao">{t("Criar a obra")}</Link>
        )}
      </div>

      {proximo && (
        <div className="mb-4 rounded-lg border border-marca-500 bg-marca-50 p-3">
          <p className="mb-2 text-sm font-semibold">
            {t("{n}º follow-up", { n: proximo.ordem })} · {proximo.dataPrevista <= new Date() ? t("para enviar hoje") : t("previsto para {data}", { data: data(proximo.dataPrevista) })}
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
                <>{t("enviado em {data} por {canal}", { data: data(f.enviadoEm), canal: CANAIS[f.canal as keyof typeof CANAIS] ?? f.canal ?? "" })}</>
              ) : (
                <>{t("previsto para {data}", { data: data(f.dataPrevista) })}{f.dataPrevista < new Date() && !visita.resultado && <span className="selo ml-2 bg-amber-100 text-amber-800">{t("Atrasado")}</span>}</>
              )}
            </span>
            {f.enviadoEm ? (
              <form action={desfazerEnvio.bind(null, f.id)}>
                <BotaoEnviar className="text-xs text-stone-500 hover:underline">{t("Desfazer")}</BotaoEnviar>
              </form>
            ) : (
              <span className="flex items-center gap-2">
                <form action={mudarDataFollowUp.bind(null, f.id)} className="flex items-center gap-1">
                  <input className="campo w-auto px-2 py-1 text-xs" type="date" name="data" defaultValue={campoData(f.dataPrevista)} aria-label={t("Nova data")} />
                  <BotaoEnviar className="text-xs text-marca-700 hover:underline">{t("Mudar")}</BotaoEnviar>
                </form>
                <form action={excluirFollowUp.bind(null, f.id)}>
                  <BotaoEnviar className="text-xs text-red-700 hover:underline">{t("Excluir")}</BotaoEnviar>
                </form>
              </span>
            )}
          </li>
        ))}
      </ul>
      {!visita.resultado && (
        <form action={adicionarFollowUp.bind(null, visita.id)} className="mt-3 flex items-center gap-2 text-sm">
          <input className="campo w-auto px-2 py-1" type="date" name="data" required aria-label={t("Data do novo follow-up")} />
          <BotaoEnviar className="botao-secundario px-3 py-1 text-sm">{t("+ Follow-up")}</BotaoEnviar>
        </form>
      )}
    </div>
  );
}
