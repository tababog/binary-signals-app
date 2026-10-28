"use client";

import { useState } from "react";
import { TIPOS_SERVICO } from "@/lib/constantes";
import { Campo } from "./ui";

type Cliente = { id: string; nome: string; endereco: string | null };
type Visita = { clienteId: string; dataHora: string; endereco: string | null; tipoServico: string | null; descricao: string | null };

export function CamposVisita({ clientes, valor, clienteInicial }: { clientes: Cliente[]; valor?: Visita; clienteInicial?: string }) {
  const [clienteId, setClienteId] = useState(valor?.clienteId ?? clienteInicial ?? (clientes.length ? "" : "NOVO"));
  const [endereco, setEndereco] = useState(valor?.endereco ?? clientes.find((c) => c.id === clienteInicial)?.endereco ?? "");

  function escolher(id: string) {
    setClienteId(id);
    // Sugere o endereço do cliente se o campo ainda estiver vazio
    const c = clientes.find((x) => x.id === id);
    if (c?.endereco && !endereco) setEndereco(c.endereco);
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Campo rotulo="Cliente *">
        <select className="campo" name="clienteId" value={clienteId} onChange={(e) => escolher(e.target.value)} required>
          <option value="" disabled>Selecione...</option>
          <option value="NOVO">+ Cliente novo</option>
          {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
      </Campo>
      <Campo rotulo="Data e hora *">
        <input className="campo" name="dataHora" type="datetime-local" defaultValue={valor?.dataHora} required />
      </Campo>
      {clienteId === "NOVO" && (
        <>
          <Campo rotulo="Nome do cliente novo *">
            <input className="campo" name="clienteNome" required />
          </Campo>
          <Campo rotulo="Telefone do cliente">
            <input className="campo" name="clienteTelefone" type="tel" />
          </Campo>
        </>
      )}
      <div className="sm:col-span-2">
        <Campo rotulo="Endereço da visita">
          <input className="campo" name="endereco" value={endereco} onChange={(e) => setEndereco(e.target.value)} placeholder="Rua, número, cidade" />
        </Campo>
      </div>
      <Campo rotulo="Tipo de serviço">
        <select className="campo" name="tipoServico" defaultValue={valor?.tipoServico ?? ""}>
          <option value="">—</option>
          {Object.entries(TIPOS_SERVICO).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </Campo>
      <div className="sm:col-span-2">
        <Campo rotulo="O que o cliente quer">
          <textarea className="campo" name="descricao" rows={3} defaultValue={valor?.descricao ?? ""} placeholder="Ex.: deck de 12x16 nos fundos, com escada" />
        </Campo>
      </div>
    </div>
  );
}
