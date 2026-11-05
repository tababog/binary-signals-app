"use client";

import { useState } from "react";
import { PREFIXO_PERSONALIZADO, SUBSERVICOS, TIPOS_SERVICO, lerOutrosServicos } from "@/lib/constantes";
import { useT } from "@/i18n/cliente";
import { Campo } from "./ui";

/**
 * Tipos de serviço em botões (pode marcar vários, ex.: deck + pintura), os subserviços de cada um em caixas de marcar
 * e "Outros" com texto livre (vira opção fixa ao salvar). O primeiro marcado é o serviço principal.
 * Campos enviados: tiposServico (vários, na ordem), sub:<tipo> (vários) e servicoOutro — lidos por lerServicosDoFormulario.
 */
export function ServicoPicker({
  personalizados,
  tipoInicial,
  subsIniciais,
  outrosIniciais,
  aoEscolher,
  obrigatorio = false,
}: {
  personalizados: string[];
  tipoInicial?: string | null;
  subsIniciais?: string | null;
  outrosIniciais?: string | null;
  /** Chamado com o serviço principal (o primeiro marcado) quando ele muda. */
  aoEscolher?: (tipo: string) => void;
  obrigatorio?: boolean;
}) {
  const t = useT();
  const iniciais = [...(tipoInicial ? [{ tipo: tipoInicial, subServicos: subsIniciais ?? null }] : []), ...lerOutrosServicos(outrosIniciais)];
  const [tipos, setTipos] = useState<string[]>(iniciais.map((s) => s.tipo));
  const [subs, setSubs] = useState<Record<string, Set<string>>>(() =>
    Object.fromEntries(iniciais.map((s) => [s.tipo, new Set((s.subServicos ?? "").split(",").filter(Boolean))])),
  );

  function alternarTipo(k: string) {
    const novos = tipos.includes(k) ? tipos.filter((x) => x !== k) : [...tipos, k];
    setTipos(novos);
    if (novos[0] && novos[0] !== tipos[0]) aoEscolher?.(novos[0]);
  }
  function marcar(tipo: string, codigo: string, filhos: string[] = []) {
    const novo = new Set(subs[tipo] ?? []);
    if (novo.has(codigo)) {
      novo.delete(codigo);
      filhos.forEach((f) => novo.delete(f));
    } else novo.add(codigo);
    setSubs({ ...subs, [tipo]: novo });
  }

  const opcoes: [string, string][] = [
    ...Object.entries(TIPOS_SERVICO).filter(([k]) => k !== "OUTRO"),
    ...personalizados.map((nome): [string, string] => [`${PREFIXO_PERSONALIZADO}${nome}`, nome]),
    ["OUTRO", "Outros"],
  ];
  const nome = (k: string) => {
    const o = opcoes.find(([x]) => x === k);
    return o ? (k.startsWith(PREFIXO_PERSONALIZADO) ? o[1] : t(o[1])) : k;
  };

  return (
    <fieldset>
      <legend className="rotulo">
        {obrigatorio ? t("Tipo de serviço *") : t("Tipo de serviço")} <span className="font-normal text-stone-500">{t("(pode marcar vários)")}</span>
      </legend>
      {tipos.map((k) => <input key={k} type="hidden" name="tiposServico" value={k} />)}
      {/* Com "obrigatório", o navegador avisa se nenhum serviço foi marcado */}
      {obrigatorio && tipos.length === 0 && <input className="sr-only" tabIndex={-1} aria-hidden="true" required value="" onChange={() => {}} />}
      <div className="flex flex-wrap gap-2">
        {opcoes.map(([k, rotulo]) => {
          const ativo = tipos.includes(k);
          return (
            <button
              key={k}
              type="button"
              onClick={() => alternarTipo(k)}
              aria-pressed={ativo}
              className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${ativo ? "border-marca-600 bg-marca-600 text-white" : "border-stone-300 bg-white text-stone-700"}`}
            >
              {ativo && "✓ "}
              {k.startsWith(PREFIXO_PERSONALIZADO) ? rotulo : t(rotulo)}
            </button>
          );
        })}
      </div>
      {tipos.map((tipo) =>
        SUBSERVICOS[tipo] ? (
          <div key={tipo} className="mt-3 space-y-2 rounded-lg border border-stone-200 bg-stone-50 p-3">
            {tipos.length > 1 && <div className="text-sm font-semibold">{nome(tipo)}</div>}
            {SUBSERVICOS[tipo].map((s) => {
              const filhos = (s.subs ?? []).map((f) => `${s.k}.${f.k}`);
              const marcados = subs[tipo] ?? new Set<string>();
              return (
                <div key={s.k}>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name={`sub:${tipo}`} value={s.k} checked={marcados.has(s.k)} onChange={() => marcar(tipo, s.k, filhos)} className="h-5 w-5" />
                    {t(s.nome)}
                  </label>
                  {s.subs && marcados.has(s.k) && (
                    <div className="ml-7 mt-2 flex flex-wrap gap-x-4 gap-y-2">
                      {s.subs.map((f) => (
                        <label key={f.k} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            name={`sub:${tipo}`}
                            value={`${s.k}.${f.k}`}
                            checked={marcados.has(`${s.k}.${f.k}`)}
                            onChange={() => marcar(tipo, `${s.k}.${f.k}`)}
                            className="h-5 w-5"
                          />
                          {t(f.nome)}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : null,
      )}
      {tipos.includes("OUTRO") && (
        <div className="mt-3">
          <Campo rotulo={t("Qual serviço? *")}>
            <input className="campo" name="servicoOutro" required placeholder={t("Ex.: Piso laminado")} />
          </Campo>
          <p className="mt-1 text-xs text-stone-500">{t("O serviço digitado aqui passa a aparecer na lista nas próximas visitas.")}</p>
        </div>
      )}
    </fieldset>
  );
}
