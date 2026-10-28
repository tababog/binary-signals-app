import Link from "next/link";
import { dataHora } from "@/lib/format";
import { nomeTipoServico } from "@/lib/constantes";

type Visita = {
  id: string;
  dataHora: Date;
  endereco: string | null;
  tipoServico: string | null;
  status: string;
  cliente: { nome: string; telefone: string | null };
};

/** Uma visita na lista: cliente, hora, serviço, e atalhos para o mapa e o telefone. */
export function ItemVisita({ v, agora }: { v: Visita; agora: Date }) {
  const atrasada = v.status === "AGENDADA" && v.dataHora < agora;
  return (
    <li className="flex flex-wrap items-start justify-between gap-2 py-2">
      <div className="min-w-0">
        <Link href={`/visitas/${v.id}`} className="link">{v.cliente.nome}</Link>
        <div className="text-sm text-stone-600">
          {dataHora(v.dataHora)}
          {v.tipoServico && ` · ${nomeTipoServico(v.tipoServico)}`}
          {atrasada && <span className="selo ml-2 bg-amber-100 text-amber-800">Passou do horário</span>}
          {v.status === "REALIZADA" && <span className="selo ml-2 bg-emerald-100 text-emerald-800">Realizada</span>}
          {v.status === "CANCELADA" && <span className="selo ml-2 bg-stone-200 text-stone-600">Cancelada</span>}
        </div>
        {v.endereco && <div className="truncate text-xs text-stone-500">{v.endereco}</div>}
      </div>
      <div className="flex gap-2 text-sm">
        {v.endereco && (
          <a className="botao-secundario px-2 py-1" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.endereco)}`}>
            Mapa
          </a>
        )}
        {v.cliente.telefone && (
          <a className="botao-secundario px-2 py-1" href={`tel:${v.cliente.telefone.replace(/[^\d+]/g, "")}`}>Ligar</a>
        )}
      </div>
    </li>
  );
}
