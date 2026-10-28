import { campoData, centavosParaCampo } from "@/lib/format";
import { STATUS_OBRA } from "@/lib/constantes";
import { Campo } from "./ui";
import { ClienteEndereco } from "./ClienteEndereco";
import { PrazoObra } from "./PrazoObra";
import { CamposLocalObra } from "./CamposLocalObra";
import { getT } from "@/i18n/servidor";

type Obra = {
  nome: string;
  clienteId: string;
  endereco: string | null;
  descricao: string | null;
  status: string;
  valorContratoCent: number;
  dataInicio: Date | null;
  dataPrevista: Date | null;
  latitude: number | null;
  longitude: number | null;
  raioMetros: number;
  diasPrevistos: number;
};

export function CamposObra({ valor, clientes, clienteInicial }: { valor?: Obra; clientes: { id: string; nome: string; endereco: string | null }[]; clienteInicial?: string }) {
  const t = getT();
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Campo rotulo={t("Nome da obra *")}>
        <input className="campo" name="nome" defaultValue={valor?.nome} placeholder={t("Ex.: Deck da casa na Main St")} required />
      </Campo>
      <ClienteEndereco clientes={clientes} clienteId={valor?.clienteId ?? clienteInicial ?? ""} endereco={valor?.endereco ?? null} />
      <Campo rotulo={t("Valor fechado com o cliente (contrato)")}>
        <input className="campo" name="valorContrato" inputMode="decimal" placeholder="0.00" defaultValue={valor ? centavosParaCampo(valor.valorContratoCent) : ""} />
      </Campo>
      <Campo rotulo={t("Situação")}>
        <select className="campo" name="status" defaultValue={valor?.status ?? "PLANEJADA"}>
          {Object.entries(STATUS_OBRA).map(([k, v]) => (
            <option key={k} value={k}>{t(v)}</option>
          ))}
        </select>
      </Campo>
      <PrazoObra inicio={campoData(valor?.dataInicio)} previsao={campoData(valor?.dataPrevista)} dias={valor?.diasPrevistos ?? 0} />
      <CamposLocalObra latitude={valor?.latitude ?? null} longitude={valor?.longitude ?? null} raioMetros={valor?.raioMetros ?? 200} />
      <div className="sm:col-span-2">
        <Campo rotulo={t("Descrição / escopo")}>
          <textarea className="campo" name="descricao" rows={3} defaultValue={valor?.descricao ?? ""} />
        </Campo>
      </div>
    </div>
  );
}
