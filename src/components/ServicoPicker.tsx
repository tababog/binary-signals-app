"use client";

import { useState } from "react";
import { PREFIXO_PERSONALIZADO, SUBSERVICOS, TIPOS_SERVICO } from "@/lib/constantes";
import { useT } from "@/i18n/cliente";
import { Campo } from "./ui";

/**
 * Tipo de serviço em botões, subserviços em caixas de marcar e "Outros" com texto livre (vira opção fixa ao salvar).
 * Campos enviados: tipoServico, subServicos (vários) e servicoOutro.
 */
export function ServicoPicker({
  personalizados,
  tipoInicial,
  subsIniciais,
  aoEscolher,
}: {
  personalizados: string[];
  tipoInicial?: string | null;
  subsIniciais?: string | null;
  aoEscolher?: (tipo: string) => void;
}) {
  const t = useT();
  const [tipo, setTipo] = useState(tipoInicial ?? "");
  const [subs, setSubs] = useState<Set<string>>(new Set((subsIniciais ?? "").split(",").filter(Boolean)));

  function escolherTipo(k: string) {
    if (k === tipo) return;
    setTipo(k);
    setSubs(new Set());
    aoEscolher?.(k);
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
    <fieldset>
      <legend className="rotulo">{t("Tipo de serviço *")}</legend>
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
                  {t(s.nome)}
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
        </div>
      )}
    </fieldset>
  );
}
