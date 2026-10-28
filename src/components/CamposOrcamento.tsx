"use client";

import { useState } from "react";
import { CONDADOS_CT, UNIDADES, UNIDADE_PADRAO } from "@/lib/constantes";
import { useT } from "@/i18n/cliente";
import { Campo } from "./ui";
import { CampoEndereco } from "./CampoEndereco";
import { ServicoPicker } from "./ServicoPicker";

type Cliente = { id: string; nome: string; endereco: string | null };
export type ValorOrcamento = {
  clienteId?: string;
  visitaId?: string | null;
  tipoServico?: string | null;
  subServicos?: string | null;
  descricao?: string | null;
  endereco?: string | null;
  cidade?: string | null;
  condado?: string | null;
  quantidade?: number;
  unidade?: string;
};

/** "12 Oak St, Fairfield, CT 06824" → "Fairfield" */
function cidadeDe(endereco: string) {
  const partes = endereco.split(",").map((p) => p.trim()).filter(Boolean);
  return partes.length >= 3 ? partes[partes.length - 2] : "";
}

/** Dados do trabalho a orçar: cliente, serviço, endereço/cidade/condado (o preço muda com a região) e tamanho. */
export function CamposOrcamento({
  clientes,
  personalizados,
  valor,
  comCliente = true,
}: {
  clientes: Cliente[];
  personalizados: string[];
  valor?: ValorOrcamento;
  comCliente?: boolean;
}) {
  const t = useT();
  const [clienteId, setClienteId] = useState(valor?.clienteId ?? (clientes.length ? "" : "NOVO"));
  const [endereco, setEndereco] = useState(valor?.endereco ?? clientes.find((c) => c.id === valor?.clienteId)?.endereco ?? "");
  const [cidade, setCidade] = useState(valor?.cidade ?? cidadeDe(endereco));
  const [unidade, setUnidade] = useState(valor?.unidade ?? "SQFT");

  function mudarEndereco(v: string) {
    setEndereco(v);
    const c = cidadeDe(v);
    if (c) setCidade(c);
  }
  function escolherCliente(id: string) {
    setClienteId(id);
    const e = clientes.find((c) => c.id === id)?.endereco;
    if (e && !endereco) mudarEndereco(e);
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {valor?.visitaId && <input type="hidden" name="visitaId" value={valor.visitaId} />}
      {comCliente && (
        <>
          <Campo rotulo={t("Cliente *")}>
            <select className="campo" name="clienteId" value={clienteId} onChange={(e) => escolherCliente(e.target.value)} required>
              <option value="" disabled>{t("Selecione...")}</option>
              <option value="NOVO">{t("+ Cliente novo")}</option>
              {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </Campo>
          {clienteId === "NOVO" ? (
            <>
              <Campo rotulo={t("Nome do cliente novo *")}>
                <input className="campo" name="clienteNome" required />
              </Campo>
              <Campo rotulo={t("Telefone do cliente")}>
                <input className="campo" name="clienteTelefone" type="tel" inputMode="tel" />
              </Campo>
            </>
          ) : (
            <div className="hidden sm:block" />
          )}
        </>
      )}

      <div className="sm:col-span-2">
        <ServicoPicker
          personalizados={personalizados}
          tipoInicial={valor?.tipoServico}
          subsIniciais={valor?.subServicos}
          aoEscolher={(k) => UNIDADE_PADRAO[k] && setUnidade(UNIDADE_PADRAO[k])}
        />
      </div>
      <div className="sm:col-span-2">
        <Campo rotulo={t("O que o cliente quer")}>
          <textarea className="campo" name="descricao" rows={3} defaultValue={valor?.descricao ?? ""} placeholder={t("Ex.: deck de 12x16 nos fundos, com escada")} />
        </Campo>
      </div>
      <div className="sm:col-span-2">
        <Campo rotulo={t("Endereço da obra")}>
          <CampoEndereco value={endereco} onChange={mudarEndereco} />
        </Campo>
      </div>
      <Campo rotulo={t("Cidade")}>
        <input className="campo" name="cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Fairfield" />
      </Campo>
      <Campo rotulo={t("Condado")}>
        <select className="campo" name="condado" defaultValue={valor?.condado ?? ""}>
          <option value="">—</option>
          {CONDADOS_CT.map((c) => <option key={c} value={c}>{c} County</option>)}
        </select>
      </Campo>
      <div className="grid grid-cols-[1fr_9rem] gap-2 sm:col-span-2">
        <Campo rotulo={t("Tamanho do trabalho")}>
          <input className="campo" name="quantidade" inputMode="decimal" defaultValue={valor?.quantidade ? String(valor.quantidade) : ""} placeholder="192" />
        </Campo>
        <Campo rotulo={t("Unidade")}>
          <select className="campo" name="unidade" value={unidade} onChange={(e) => setUnidade(e.target.value)}>
            {Object.entries(UNIDADES).map(([k, v]) => <option key={k} value={k}>{t(v)}</option>)}
          </select>
        </Campo>
      </div>
    </div>
  );
}
