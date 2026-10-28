import { centavosParaCampo } from "@/lib/format";
import { Campo } from "./ui";

type Funcionario = {
  nome: string;
  email: string | null;
  telefone: string | null;
  funcao: string | null;
  valorHoraCent: number;
  valorDiariaCent: number;
  tipoPagamento: string;
  vinculo: string;
  papel: string;
};

export function CamposFuncionario({ valor, novo, vinculoInicial }: { valor?: Funcionario; novo?: boolean; vinculoInicial?: string }) {
  const diaria = valor?.tipoPagamento === "DIARIA";
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Campo rotulo="Nome *">
        <input className="campo" name="nome" defaultValue={valor?.nome} required />
      </Campo>
      <Campo rotulo="Tipo">
        <select className="campo" name="vinculo" defaultValue={valor?.vinculo ?? vinculoInicial ?? "FIXO"}>
          <option value="FIXO">Funcionário</option>
          <option value="HELPER">Helper (temporário)</option>
        </select>
      </Campo>
      <Campo rotulo="Telefone / WhatsApp">
        <input className="campo" name="telefone" type="tel" defaultValue={valor?.telefone ?? ""} />
      </Campo>
      <Campo rotulo="E-mail (opcional)">
        <input className="campo" name="email" type="email" defaultValue={valor?.email ?? ""} />
        <span className="mt-1 block text-xs text-stone-500">Sem e-mail, a pessoa entra no app pelo telefone.</span>
      </Campo>
      <Campo rotulo="Função (ex.: carpinteiro, pintor)">
        <input className="campo" name="funcao" defaultValue={valor?.funcao ?? ""} />
      </Campo>
      <div className="grid grid-cols-2 gap-2">
        <Campo rotulo="Pagamento">
          <select className="campo" name="tipoPagamento" defaultValue={valor?.tipoPagamento ?? "DIARIA"}>
            <option value="DIARIA">Por diária</option>
            <option value="HORA">Por hora</option>
          </select>
        </Campo>
        <Campo rotulo="Valor">
          <input
            className="campo"
            name="valor"
            inputMode="decimal"
            placeholder="0.00"
            defaultValue={valor ? centavosParaCampo(diaria ? valor.valorDiariaCent : valor.valorHoraCent) : ""}
          />
        </Campo>
      </div>
      <Campo rotulo="Acesso ao app">
        <select className="campo" name="papel" defaultValue={valor?.papel ?? "FUNCIONARIO"}>
          <option value="FUNCIONARIO">Funcionário (só registra ponto)</option>
          <option value="ADMIN">Administrador (acesso total)</option>
        </select>
      </Campo>
      <Campo rotulo={novo ? "Senha inicial (opcional)" : "Nova senha (deixe em branco para manter)"}>
        <input className="campo" name="senha" type="text" autoComplete="new-password" minLength={6} />
        {novo && (
          <span className="mt-1 block text-xs text-stone-500">
            Deixe em branco para gerar um link de convite: a pessoa cria a própria senha.
          </span>
        )}
      </Campo>
    </div>
  );
}
