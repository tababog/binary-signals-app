import { Campo } from "./ui";
import { CampoEndereco } from "./CampoEndereco";
import { getT } from "@/i18n/servidor";

type Contato = {
  nome?: string;
  documento?: string | null;
  telefone?: string | null;
  email?: string | null;
  endereco?: string | null;
  observacoes?: string | null;
};

export function CamposContato({ valor = {}, rotuloDocumento }: { valor?: Contato; rotuloDocumento?: string }) {
  const t = getT();
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Campo rotulo={t("Nome *")}>
        <input className="campo" name="nome" defaultValue={valor.nome} required />
      </Campo>
      <Campo rotulo={rotuloDocumento ?? t("Tax ID / EIN (opcional)")}>
        <input className="campo" name="documento" defaultValue={valor.documento ?? ""} />
      </Campo>
      <Campo rotulo={t("Telefone / WhatsApp")}>
        <input className="campo" name="telefone" type="tel" defaultValue={valor.telefone ?? ""} />
      </Campo>
      <Campo rotulo={t("E-mail")}>
        <input className="campo" name="email" type="email" defaultValue={valor.email ?? ""} />
      </Campo>
      <div className="sm:col-span-2">
        <Campo rotulo={t("Endereço")}>
          <CampoEndereco defaultValue={valor.endereco} />
        </Campo>
      </div>
      <div className="sm:col-span-2">
        <Campo rotulo={t("Observações")}>
          <textarea className="campo" name="observacoes" rows={3} defaultValue={valor.observacoes ?? ""} />
        </Campo>
      </div>
    </div>
  );
}
