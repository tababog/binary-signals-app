"use client";

import { useState } from "react";
import { useT } from "@/i18n/cliente";
import { LerPrintCliente } from "./LerPrintCliente";
import { ServicoPicker } from "./ServicoPicker";
import { Campo } from "./ui";
import { CampoEndereco } from "./CampoEndereco";
import { FotosTrabalho } from "./FotosTrabalho";

type Cliente = { id: string; nome: string; endereco: string | null };
type Visita = {
  clienteId: string;
  dataHora: string;
  endereco: string | null;
  tipoServico: string | null;
  subServicos: string | null;
  outrosServicos?: string | null;
  descricao: string | null;
  responsavelId?: string | null;
};
type Pessoa = { id: string; nome: string };

export function CamposVisita({
  clientes,
  personalizados,
  valor,
  clienteInicial,
  comFotos = true,
  responsaveis = [],
  responsavelPadrao,
}: {
  clientes: Cliente[];
  /** Serviços criados antes em "Outros": aparecem como opção junto com os fixos. */
  personalizados: string[];
  valor?: Visita;
  clienteInicial?: string;
  /** Na página da visita as fotos têm um quadro próprio. */
  comFotos?: boolean;
  /** Administradores que podem fazer a visita (Alessandro e Emmanuel). */
  responsaveis?: Pessoa[];
  responsavelPadrao?: string;
}) {
  const t = useT();
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
      <Campo rotulo={t("Cliente *")}>
        <select className="campo" name="clienteId" value={clienteId} onChange={(e) => escolher(e.target.value)} required>
          <option value="" disabled>{t("Selecione...")}</option>
          <option value="NOVO">{t("+ Cliente novo")}</option>
          {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
      </Campo>
      <Campo rotulo={t("Data e hora *")}>
        <input className="campo" name="dataHora" type="datetime-local" defaultValue={valor?.dataHora} required />
      </Campo>
      {responsaveis.length > 0 && (
        <Campo rotulo={t("Quem vai fazer a visita *")}>
          <select className="campo" name="responsavelId" defaultValue={valor?.responsavelId ?? responsavelPadrao ?? ""} required>
            <option value="" disabled>{t("Selecione...")}</option>
            {responsaveis.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
        </Campo>
      )}
      {clienteId === "NOVO" && (
        <>
          <Campo rotulo={t("Nome do cliente novo *")}>
            <input className="campo" name="clienteNome" required />
          </Campo>
          <Campo rotulo={t("Telefone do cliente")}>
            <input className="campo" name="clienteTelefone" type="tel" inputMode="tel" />
          </Campo>
        </>
      )}
      <div className="sm:col-span-2">
        <Campo rotulo={t("Endereço da visita")}>
          <CampoEndereco value={endereco} onChange={setEndereco} />
        </Campo>
      </div>

      <div className="sm:col-span-2">
        <ServicoPicker personalizados={personalizados} tipoInicial={valor?.tipoServico} subsIniciais={valor?.subServicos} outrosIniciais={valor?.outrosServicos} />
      </div>

      <div className="sm:col-span-2">
        <Campo rotulo={t("O que o cliente quer")}>
          <textarea className="campo" name="descricao" rows={3} defaultValue={valor?.descricao ?? ""} placeholder={t("Ex.: deck de 12x16 nos fundos, com escada")} />
        </Campo>
        <LerPrintCliente />
      </div>

      {comFotos && (
        <div className="sm:col-span-2">
          <span className="rotulo">{t("Fotos do trabalho")}</span>
          <FotosTrabalho />
        </div>
      )}
    </div>
  );
}
