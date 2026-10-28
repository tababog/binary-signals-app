import { Campo } from "./ui";

type Contato = {
  nome?: string;
  documento?: string | null;
  telefone?: string | null;
  email?: string | null;
  endereco?: string | null;
  observacoes?: string | null;
};

export function CamposContato({ valor = {}, rotuloDocumento = "Tax ID / EIN (opcional)" }: { valor?: Contato; rotuloDocumento?: string }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Campo rotulo="Nome *">
        <input className="campo" name="nome" defaultValue={valor.nome} required />
      </Campo>
      <Campo rotulo={rotuloDocumento}>
        <input className="campo" name="documento" defaultValue={valor.documento ?? ""} />
      </Campo>
      <Campo rotulo="Telefone / WhatsApp">
        <input className="campo" name="telefone" type="tel" defaultValue={valor.telefone ?? ""} />
      </Campo>
      <Campo rotulo="E-mail">
        <input className="campo" name="email" type="email" defaultValue={valor.email ?? ""} />
      </Campo>
      <div className="sm:col-span-2">
        <Campo rotulo="Endereço">
          <input className="campo" name="endereco" defaultValue={valor.endereco ?? ""} />
        </Campo>
      </div>
      <div className="sm:col-span-2">
        <Campo rotulo="Observações">
          <textarea className="campo" name="observacoes" rows={3} defaultValue={valor.observacoes ?? ""} />
        </Campo>
      </div>
    </div>
  );
}
