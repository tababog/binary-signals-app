import { centavosParaCampo } from "@/lib/format";
import { Campo } from "./ui";
import { BANDEIRAS, IDIOMAS } from "@/i18n/idiomas";
import { getT } from "@/i18n/servidor";

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
  idioma: string;
};

export function CamposFuncionario({ valor, novo, vinculoInicial }: { valor?: Funcionario; novo?: boolean; vinculoInicial?: string }) {
  const diaria = valor?.tipoPagamento === "DIARIA";
  const t = getT();
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Campo rotulo={t("Nome *")}>
        <input className="campo" name="nome" defaultValue={valor?.nome} required />
      </Campo>
      <Campo rotulo={t("Tipo")}>
        <select className="campo" name="vinculo" defaultValue={valor?.vinculo ?? vinculoInicial ?? "FIXO"}>
          <option value="FIXO">{t("Funcionário")}</option>
          <option value="HELPER">{t("Helper (temporário)")}</option>
        </select>
      </Campo>
      <Campo rotulo={t("Telefone / WhatsApp")}>
        <input className="campo" name="telefone" type="tel" defaultValue={valor?.telefone ?? ""} />
      </Campo>
      <Campo rotulo={t("E-mail (opcional)")}>
        <input className="campo" name="email" type="email" defaultValue={valor?.email ?? ""} />
        <span className="mt-1 block text-xs text-stone-500">{t("Sem e-mail, a pessoa entra no app pelo telefone.")}</span>
      </Campo>
      <Campo rotulo={t("Função (ex.: carpinteiro, pintor)")}>
        <input className="campo" name="funcao" defaultValue={valor?.funcao ?? ""} />
      </Campo>
      <div className="grid grid-cols-2 gap-2">
        <Campo rotulo={t("Pagamento")}>
          <select className="campo" name="tipoPagamento" defaultValue={valor?.tipoPagamento ?? "DIARIA"}>
            <option value="DIARIA">{t("Por diária")}</option>
            <option value="HORA">{t("Por hora")}</option>
          </select>
        </Campo>
        <Campo rotulo={t("Valor")}>
          <input
            className="campo"
            name="valor"
            inputMode="decimal"
            placeholder="0.00"
            defaultValue={valor ? centavosParaCampo(diaria ? valor.valorDiariaCent : valor.valorHoraCent) : ""}
          />
        </Campo>
      </div>
      <Campo rotulo={t("Idioma do app")}>
        <select className="campo text-lg" name="idioma" defaultValue={valor?.idioma ?? "pt"}>
          {IDIOMAS.map((i) => (
            <option key={i} value={i}>{BANDEIRAS[i].bandeira} {BANDEIRAS[i].nome}</option>
          ))}
        </select>
      </Campo>
      <Campo rotulo={t("Acesso ao app")}>
        <select className="campo" name="papel" defaultValue={valor?.papel ?? "FUNCIONARIO"}>
          <option value="FUNCIONARIO">{t("Funcionário (só registra ponto)")}</option>
          <option value="ADMIN">{t("Administrador (acesso total)")}</option>
        </select>
      </Campo>
      <Campo rotulo={novo ? t("Senha inicial (opcional)") : t("Nova senha (deixe em branco para manter)")}>
        <input className="campo" name="senha" type="text" autoComplete="new-password" minLength={6} />
        {novo && (
          <span className="mt-1 block text-xs text-stone-500">
            {t("Deixe em branco para gerar um link de convite: a pessoa cria a própria senha.")}
          </span>
        )}
      </Campo>
    </div>
  );
}
