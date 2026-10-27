import { campoData, centavosParaCampo } from "@/lib/format";
import { STATUS_OBRA } from "@/lib/constantes";
import { Campo } from "./ui";

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
};

export function CamposObra({ valor, clientes, clienteInicial }: { valor?: Obra; clientes: { id: string; nome: string }[]; clienteInicial?: string }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Campo rotulo="Nome da obra *">
        <input className="campo" name="nome" defaultValue={valor?.nome} placeholder="Ex.: Reforma casa Rua das Flores" required />
      </Campo>
      <Campo rotulo="Cliente *">
        <select className="campo" name="clienteId" defaultValue={valor?.clienteId ?? clienteInicial ?? ""} required>
          <option value="" disabled>Selecione...</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
      </Campo>
      <div className="sm:col-span-2">
        <Campo rotulo="Endereço da obra">
          <input className="campo" name="endereco" defaultValue={valor?.endereco ?? ""} />
        </Campo>
      </div>
      <Campo rotulo="Valor fechado com o cliente (contrato)">
        <input className="campo" name="valorContrato" inputMode="decimal" placeholder="0,00" defaultValue={valor ? centavosParaCampo(valor.valorContratoCent) : ""} />
      </Campo>
      <Campo rotulo="Situação">
        <select className="campo" name="status" defaultValue={valor?.status ?? "PLANEJADA"}>
          {Object.entries(STATUS_OBRA).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </Campo>
      <Campo rotulo="Início">
        <input className="campo" name="dataInicio" type="date" defaultValue={campoData(valor?.dataInicio)} />
      </Campo>
      <Campo rotulo="Previsão de entrega">
        <input className="campo" name="dataPrevista" type="date" defaultValue={campoData(valor?.dataPrevista)} />
      </Campo>
      <Campo rotulo="Andamento da obra (%)">
        <input className="campo" name="progresso" type="number" min={0} max={100} defaultValue={valor?.progresso ?? 0} />
      </Campo>
      <div className="sm:col-span-2">
        <Campo rotulo="Descrição / escopo">
          <textarea className="campo" name="descricao" rows={3} defaultValue={valor?.descricao ?? ""} />
        </Campo>
      </div>
    </div>
  );
}
