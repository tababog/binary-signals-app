"use client";

import { useState } from "react";
import { PREFIXO_PERSONALIZADO, SUBSERVICOS, TIPOS_SERVICO } from "@/lib/constantes";
import { useT } from "@/i18n/cliente";
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
  const [tipo, setTipo] = useState(valor?.tipoServico ?? "");
  const [subs, setSubs] = useState<Set<string>>(new Set((valor?.subServicos ?? "").split(",").filter(Boolean)));

  function escolher(id: string) {
    setClienteId(id);
    // Sugere o endereço do cliente se o campo ainda estiver vazio
    const c = clientes.find((x) => x.id === id);
    if (c?.endereco && !endereco) setEndereco(c.endereco);
  }

  function escolherTipo(k: string) {
    if (k === tipo) return;
    setTipo(k);
    setSubs(new Set());
  }

  function marcar(codigo: string, filhos: string[] = []) {
    const novo = new Set(subs);
    if (novo.has(codigo)) {
      novo.delete(codigo);
      filhos.forEach((f) => novo.delete(f));
    } else novo.add(codigo);
    setSubs(novo);
  }

  const opcoes: [string, string][] = [
    ...Object.entries(TIPOS_SERVICO).filter(([k]) => k !== "OUTRO"),
    ...personalizados.map((nome): [string, string] => [`${PREFIXO_PERSONALIZADO}${nome}`, nome]),
    ["OUTRO", "Outros"],
  ];

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

      <fieldset className="sm:col-span-2">
        <legend className="rotulo">{t("Tipo de serviço")}</legend>
        <input type="hidden" name="tipoServico" value={tipo} />
        <div className="flex flex-wrap gap-2">
          {opcoes.map(([k, nome]) => (
            <button
              key={k}
              type="button"
              onClick={() => escolherTipo(k)}
              aria-pressed={tipo === k}
              className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${tipo === k ? "border-marca-600 bg-marca-600 text-white" : "border-stone-300 bg-white text-stone-700"}`}
            >
              {k.startsWith(PREFIXO_PERSONALIZADO) ? nome : t(nome)}
            </button>
          ))}
        </div>

        {SUBSERVICOS[tipo] && (
          <div className="mt-3 space-y-2 rounded-lg border border-stone-200 bg-stone-50 p-3">
            {SUBSERVICOS[tipo].map((s) => {
              const filhos = (s.subs ?? []).map((f) => `${s.k}.${f.k}`);
              return (
                <div key={s.k}>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="subServicos" value={s.k} checked={subs.has(s.k)} onChange={() => marcar(s.k, filhos)} className="h-5 w-5" />
                    <span>{t(s.nome)}</span>
                  </label>
                  {s.subs && subs.has(s.k) && (
                    <div className="ml-7 mt-2 flex flex-wrap gap-x-4 gap-y-2">
                      {s.subs.map((f) => (
                        <label key={f.k} className="flex items-center gap-2 text-sm">
                          <input type="checkbox" name="subServicos" value={`${s.k}.${f.k}`} checked={subs.has(`${s.k}.${f.k}`)} onChange={() => marcar(`${s.k}.${f.k}`)} className="h-5 w-5" />
                          {t(f.nome)}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {tipo === "OUTRO" && (
          <div className="mt-3">
            <Campo rotulo={t("Qual serviço? *")}>
              <input className="campo" name="servicoOutro" required placeholder={t("Ex.: Piso laminado")} />
            </Campo>
            <p className="mt-1 text-xs text-stone-500">{t("O serviço digitado aqui passa a aparecer na lista nas próximas visitas.")}</p>
          </div>
        )}
      </fieldset>

      <div className="sm:col-span-2">
        <Campo rotulo={t("O que o cliente quer")}>
          <textarea className="campo" name="descricao" rows={3} defaultValue={valor?.descricao ?? ""} placeholder={t("Ex.: deck de 12x16 nos fundos, com escada")} />
        </Campo>
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
