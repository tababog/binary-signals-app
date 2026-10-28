import { campoData, centavosParaCampo } from "@/lib/format";
import { STATUS_OBRA } from "@/lib/constantes";
import { Campo } from "./ui";
import { CampoEndereco } from "./CampoEndereco";
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
  progresso: number;
  latitude: number | null;
  longitude: number | null;
  raioMetros: number;
  diasPrevistos: number;
};

export function CamposObra({ valor, clientes, clienteInicial }: { valor?: Obra; clientes: { id: string; nome: string }[]; clienteInicial?: string }) {
  const t = getT();
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Campo rotulo={t("Nome da obra *")}>
        <input className="campo" name="nome" defaultValue={valor?.nome} placeholder={t("Ex.: Deck da casa na Main St")} required />
      </Campo>
      <Campo rotulo={t("Cliente *")}>
        <select className="campo" name="clienteId" defaultValue={valor?.clienteId ?? clienteInicial ?? ""} required>
          <option value="" disabled>{t("Selecione...")}</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
      </Campo>
      <div className="sm:col-span-2">
        <Campo rotulo={t("Endereço da obra")}>
          <CampoEndereco defaultValue={valor?.endereco} />
        </Campo>
      </div>
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
      <Campo rotulo={t("Início")}>
        <input className="campo" name="dataInicio" type="date" defaultValue={campoData(valor?.dataInicio)} />
      </Campo>
      <Campo rotulo={t("Previsão de entrega")}>
        <input className="campo" name="dataPrevista" type="date" defaultValue={campoData(valor?.dataPrevista)} />
      </Campo>
      <Campo rotulo={t("Dias de trabalho previstos (para orçar os custos fixos)")}>
        <input className="campo" name="diasPrevistos" type="number" min={0} max={1000} defaultValue={valor?.diasPrevistos ?? 0} />
      </Campo>
      <Campo rotulo={t("Andamento da obra (%)")}>
        <input className="campo" name="progresso" type="number" min={0} max={100} defaultValue={valor?.progresso ?? 0} />
      </Campo>
      <CamposLocalObra latitude={valor?.latitude ?? null} longitude={valor?.longitude ?? null} raioMetros={valor?.raioMetros ?? 200} />
      <div className="sm:col-span-2">
        <Campo rotulo={t("Descrição / escopo")}>
          <textarea className="campo" name="descricao" rows={3} defaultValue={valor?.descricao ?? ""} />
        </Campo>
      </div>
    </div>
  );
}
