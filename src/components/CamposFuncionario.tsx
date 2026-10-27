import { centavosParaCampo } from "@/lib/format";
import { Campo } from "./ui";

type Funcionario = {
  nome: string;
  email: string;
  telefone: string | null;
  funcao: string | null;
  valorHoraCent: number;
  papel: string;
};

export function CamposFuncionario({ valor, novo }: { valor?: Funcionario; novo?: boolean }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Campo rotulo="Nome *">
        <input className="campo" name="nome" defaultValue={valor?.nome} required />
      </Campo>
      <Campo rotulo="E-mail (usado para entrar) *">
        <input className="campo" name="email" type="email" defaultValue={valor?.email} required />
      </Campo>
      <Campo rotulo="Telefone / WhatsApp">
        <input className="campo" name="telefone" type="tel" defaultValue={valor?.telefone ?? ""} />
      </Campo>
      <Campo rotulo="Função (ex.: pedreiro, eletricista)">
        <input className="campo" name="funcao" defaultValue={valor?.funcao ?? ""} />
      </Campo>
      <Campo rotulo="Valor da hora">
        <input className="campo" name="valorHora" inputMode="decimal" placeholder="0,00" defaultValue={valor ? centavosParaCampo(valor.valorHoraCent) : ""} />
      </Campo>
      <Campo rotulo="Tipo de acesso">
        <select className="campo" name="papel" defaultValue={valor?.papel ?? "FUNCIONARIO"}>
          <option value="FUNCIONARIO">Funcionário (só registra ponto)</option>
          <option value="ADMIN">Administrador (acesso total)</option>
        </select>
      </Campo>
      <Campo rotulo={novo ? "Senha inicial *" : "Nova senha (deixe em branco para manter)"}>
        <input className="campo" name="senha" type="text" autoComplete="new-password" required={novo} minLength={6} />
      </Campo>
    </div>
  );
}
