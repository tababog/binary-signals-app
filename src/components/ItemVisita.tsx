import Link from "next/link";
import { data, dataHora } from "@/lib/format";
import { LembreteVisita } from "./LembreteVisita";
import { MensagemCliente } from "./MensagemCliente";
import { descreverSubservicos, nomeTipoServico } from "@/lib/constantes";
import { getT } from "@/i18n/servidor";

type Visita = {
  id: string;
  dataHora: Date;
  endereco: string | null;
  tipoServico: string | null;
  subServicos?: string | null;
  status: string;
  descricao: string | null;
  resultado?: string | null;
  cliente: { nome: string; telefone: string | null; email?: string | null };
  responsavel?: { nome: string } | null;
};

/** Uma visita na lista: cliente, hora, serviço, e atalhos para o mapa e o telefone. */
export function ItemVisita({ v, agora }: { v: Visita; agora: Date }) {
  const t = getT();
  const atrasada = v.status === "AGENDADA" && v.dataHora < agora;
  const dia = data(v.dataHora);
  const hoje = v.status === "AGENDADA" && !atrasada && dia === data(agora);
  const amanha = v.status === "AGENDADA" && dia === data(new Date(agora.getTime() + 24 * 3600 * 1000));
  return (
    <li className="flex flex-wrap items-start justify-between gap-2 py-2">
      <div className="min-w-0">
        <Link href={`/visitas/${v.id}`} className="link">{v.cliente.nome}</Link>
        <div className="text-sm text-stone-600">
          {dataHora(v.dataHora)}
          {v.tipoServico && ` · ${t(nomeTipoServico(v.tipoServico))}`}
          {v.subServicos && ` (${descreverSubservicos(v.tipoServico, v.subServicos, t)})`}
          {atrasada && <span className="selo ml-2 bg-amber-100 text-amber-800">{t("Passou do horário")}</span>}
          {hoje && <span className="selo ml-2 bg-marca-600 text-white">{t("Hoje")}</span>}
          {amanha && <span className="selo ml-2 bg-marca-100 text-marca-700">{t("Amanhã")}</span>}
          {v.status === "REALIZADA" && (
            v.resultado === "FECHOU" ? (
              <span className="selo ml-2 bg-emerald-100 text-emerald-800">{t("Fechou contrato")}</span>
            ) : v.resultado === "SEM_INTERESSE" ? (
              <span className="selo ml-2 bg-stone-200 text-stone-600">{t("Sem interesse")}</span>
            ) : (
              <span className="selo ml-2 bg-sky-100 text-sky-800">{t("Em negociação")}</span>
            )
          )}
          {v.status === "CANCELADA" && <span className="selo ml-2 bg-stone-200 text-stone-600">{t("Cancelada")}</span>}
        </div>
        {v.responsavel && <div className="text-xs font-medium text-marca-700">{t("👤 Visita do {nome}", { nome: v.responsavel.nome.split(" ")[0] })}</div>}
        {v.endereco && <div className="truncate text-xs text-stone-500">{v.endereco}</div>}
      </div>
      <div className="flex gap-2 text-sm">
        {v.endereco && (
          <a className="botao-secundario px-2 py-1" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.endereco)}`}>
            {t("Mapa")}
          </a>
        )}
        {v.cliente.telefone && (
          <a className="botao-secundario px-2 py-1" href={`tel:${v.cliente.telefone.replace(/[^\d+]/g, "")}`}>{t("Ligar")}</a>
        )}
        {(v.cliente.telefone || v.cliente.email) && <MensagemCliente nome={v.cliente.nome} telefone={v.cliente.telefone} email={v.cliente.email ?? null} />}
      </div>
      {v.status === "AGENDADA" && !atrasada && <LembreteVisita v={v} compacto />}
    </li>
  );
}
