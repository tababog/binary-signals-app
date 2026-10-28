"use client";

import { useRef, useState } from "react";
import { useT } from "@/i18n/cliente";
import { Campo } from "./ui";
import { CampoEndereco } from "./CampoEndereco";

type Cliente = { id: string; nome: string; endereco: string | null };

/**
 * Cliente da obra + endereço. Ao escolher o cliente, o endereço dele vem para o campo
 * (se o campo estiver vazio ou ainda com o endereço que veio do cliente anterior).
 */
export function ClienteEndereco({ clientes, clienteId, endereco }: { clientes: Cliente[]; clienteId: string; endereco: string | null }) {
  const t = useT();
  const enderecoDe = (id: string) => clientes.find((c) => c.id === id)?.endereco ?? "";
  const [cliente, setCliente] = useState(clienteId);
  const [texto, setTexto] = useState(endereco ?? enderecoDe(clienteId));
  const automatico = useRef(endereco ? "" : enderecoDe(clienteId));

  function escolher(id: string) {
    setCliente(id);
    if (!texto.trim() || texto === automatico.current) {
      automatico.current = enderecoDe(id);
      setTexto(automatico.current);
    }
  }

  return (
    <>
      <Campo rotulo={t("Cliente *")}>
        <select className="campo" name="clienteId" value={cliente} onChange={(e) => escolher(e.target.value)} required>
          <option value="" disabled>{t("Selecione...")}</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
      </Campo>
      <div className="sm:col-span-2">
        <Campo rotulo={t("Endereço da obra")}>
          <CampoEndereco value={texto} onChange={setTexto} />
        </Campo>
      </div>
    </>
  );
}
