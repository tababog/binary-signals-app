"use client";

import { useState } from "react";
import { useT } from "@/i18n/cliente";
import { Campo } from "./ui";

type Fornecedor = { id: string; nome: string; tipo: string };

/**
 * Fornecedor ou subcontratado da despesa. Dá para cadastrar um novo ali mesmo
 * ("+ Fornecedor novo" / "+ Subcontratado novo"), sem sair do lançamento.
 */
export function CampoFornecedor({ fornecedores }: { fornecedores: Fornecedor[] }) {
  const t = useT();
  const [valor, setValor] = useState("");
  const forn = fornecedores.filter((f) => f.tipo !== "SUBCONTRATADO");
  const subs = fornecedores.filter((f) => f.tipo === "SUBCONTRATADO");
  const novo = valor === "NOVO_FORNECEDOR" || valor === "NOVO_SUBCONTRATADO";

  return (
    <>
      <Campo rotulo={t("Fornecedor ou subcontratado")}>
        <select className="campo" name="fornecedorId" value={valor} onChange={(e) => setValor(e.target.value)}>
          <option value="">{t("— Nenhum —")}</option>
          <option value="NOVO_FORNECEDOR">{t("+ Fornecedor novo")}</option>
          <option value="NOVO_SUBCONTRATADO">{t("+ Subcontratado novo")}</option>
          {forn.length > 0 && (
            <optgroup label={t("Fornecedores")}>
              {forn.map((f) => <option key={f.id} value={f.id}>{f.nome}</option>)}
            </optgroup>
          )}
          {subs.length > 0 && (
            <optgroup label={t("Subcontratados")}>
              {subs.map((f) => <option key={f.id} value={f.id}>{f.nome}</option>)}
            </optgroup>
          )}
        </select>
      </Campo>
      {novo && (
        <Campo rotulo={valor === "NOVO_FORNECEDOR" ? t("Nome do fornecedor novo *") : t("Nome do subcontratado novo *")}>
          <input className="campo" name="fornecedorNome" required placeholder={valor === "NOVO_FORNECEDOR" ? "The Home Depot" : "John Smith Electric"} />
        </Campo>
      )}
    </>
  );
}
