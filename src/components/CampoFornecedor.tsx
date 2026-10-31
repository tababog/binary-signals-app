"use client";

import { useEffect, useRef, useState } from "react";
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
  const [nomeNovo, setNomeNovo] = useState("");
  const select = useRef<HTMLSelectElement>(null);

  // Foto do comprovante lida pela IA (FotoRecibo): escolhe o fornecedor cadastrado com o nome lido,
  // ou abre "Fornecedor novo" já com o nome. Não mexe se a pessoa já escolheu.
  useEffect(() => {
    const form = select.current?.form;
    if (!form) return;
    const lido = (e: Event) => {
      const { id, nome } = (e as CustomEvent<{ id: string | null; nome: string }>).detail;
      if (select.current?.value) return;
      if (id && fornecedores.some((f) => f.id === id)) return setValor(id);
      setNomeNovo(nome);
      setValor("NOVO_FORNECEDOR");
    };
    form.addEventListener("fornecedor-lido", lido);
    return () => form.removeEventListener("fornecedor-lido", lido);
  }, [fornecedores]);
  const forn = fornecedores.filter((f) => f.tipo !== "SUBCONTRATADO");
  const subs = fornecedores.filter((f) => f.tipo === "SUBCONTRATADO");
  const novo = valor === "NOVO_FORNECEDOR" || valor === "NOVO_SUBCONTRATADO";

  return (
    <>
      <Campo rotulo={t("Fornecedor ou subcontratado")}>
        <select ref={select} className="campo" name="fornecedorId" value={valor} onChange={(e) => setValor(e.target.value)}>
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
          <input
            className="campo"
            name="fornecedorNome"
            required
            value={nomeNovo}
            onChange={(e) => setNomeNovo(e.target.value)}
            placeholder={valor === "NOVO_FORNECEDOR" ? "The Home Depot" : "John Smith Electric"}
          />
        </Campo>
      )}
    </>
  );
}
