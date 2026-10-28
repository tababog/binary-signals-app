import { campoData } from "@/lib/format";
import { CamposContato } from "./CamposContato";
import { CampoDocumentoFiscal } from "./CampoDocumentoFiscal";
import { Campo } from "./ui";
import { getT } from "@/i18n/servidor";

type Fornecedor = {
  nome: string;
  documento: string | null;
  tipoDocumento: string | null;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  observacoes: string | null;
  tipo: string;
  categoria: string | null;
  licenca: string | null;
  seguroValidade: Date | null;
};

export function CamposFornecedor({ valor, tipoInicial }: { valor?: Fornecedor; tipoInicial?: string }) {
  const tipo = valor?.tipo ?? tipoInicial ?? "FORNECEDOR";
  const t = getT();
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo rotulo={t("Tipo")}>
          <select className="campo" name="tipo" defaultValue={tipo}>
            <option value="FORNECEDOR">{t("Fornecedor (material)")}</option>
            <option value="SUBCONTRATADO">{t("Subcontratado (repasso o serviço)")}</option>
          </select>
        </Campo>
        <Campo rotulo={t("Especialidade / categoria (ex.: elétrica, encanamento, madeira)")}>
          <input className="campo" name="categoria" defaultValue={valor?.categoria ?? ""} />
        </Campo>
      </div>
      <CamposContato valor={valor} comDocumento={false} />
      <div className="grid gap-4 sm:grid-cols-2">
        <CampoDocumentoFiscal tipo={valor?.tipoDocumento} documento={valor?.documento} obrigatorio={tipo === "SUBCONTRATADO"} />
        <p className="-mt-2 text-xs text-stone-500 sm:col-span-2">{t("Obrigatório para subcontratados: EIN se for empresa, ITIN (ou SSN) se for pessoa física. Vai no 1099 do fim do ano.")}</p>
      </div>
      <fieldset className="grid gap-4 rounded-lg border border-stone-200 p-3 sm:grid-cols-2">
        <legend className="px-1 text-sm font-semibold">{t("Para subcontratados")}</legend>
        <Campo rotulo={t("Licença (ex.: CT E-1, HIC)")}>
          <input className="campo" name="licenca" defaultValue={valor?.licenca ?? ""} />
        </Campo>
        <Campo rotulo={t("Seguro (COI) válido até")}>
          <input className="campo" name="seguroValidade" type="date" defaultValue={campoData(valor?.seguroValidade)} />
        </Campo>
        <p className="text-xs text-stone-500 sm:col-span-2">
          {t("Peça sempre o certificado de seguro (COI) e o W-9. Subcontratado sem seguro pode virar responsabilidade da Tababog em caso de acidente.")}
        </p>
      </fieldset>
    </div>
  );
}
