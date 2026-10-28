"use client";

import { useState } from "react";
import { CONDADOS_CT, PREFIXO_PERSONALIZADO, SUBSERVICOS, TIPOS_SERVICO, UNIDADES, UNIDADE_PADRAO } from "@/lib/constantes";
import { dinheiro } from "@/lib/moeda";
import { useT } from "@/i18n/cliente";
import { Campo } from "./ui";

export type ValorTrabalho = {
  tipoServico: string;
  subServicos: string | null;
  descricao: string;
  cidade: string | null;
  condado: string | null;
  quantidade: number;
  unidade: string;
  data: string;
  custoMaterialCent: number;
  custoMaoObraCent: number;
  custoOutrosCent: number;
  dias: number;
  horas: number;
  precoCobradoCent: number;
  observacoes: string | null;
};

const paraCampo = (c: number) => (c ? (c / 100).toFixed(2) : "");
const centavos = (s: string) => {
  const n = Number(s.replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
};

/**
 * Campos de um trabalho do banco de preços (antigo ou obra concluída), com o cálculo na hora:
 * custo total (material + mão de obra + outros + dias × custo fixo por dia), lucro e multiplicador x meta 2x.
 */
export function CamposTrabalho({ valor, personalizados, custoFixoPorDia }: { valor?: Partial<ValorTrabalho>; personalizados: string[]; custoFixoPorDia: number }) {
  const t = useT();
  const [tipo, setTipo] = useState(valor?.tipoServico ?? "");
  const [subs, setSubs] = useState<Set<string>>(new Set((valor?.subServicos ?? "").split(",").filter(Boolean)));
  const [unidade, setUnidade] = useState(valor?.unidade ?? "SQFT");
  const [n, setN] = useState({
    quantidade: valor?.quantidade ? String(valor.quantidade) : "",
    material: paraCampo(valor?.custoMaterialCent ?? 0),
    maoObra: paraCampo(valor?.custoMaoObraCent ?? 0),
    outros: paraCampo(valor?.custoOutrosCent ?? 0),
    dias: valor?.dias ? String(valor.dias) : "",
    preco: paraCampo(valor?.precoCobradoCent ?? 0),
  });
  const mudar = (k: keyof typeof n) => (e: React.ChangeEvent<HTMLInputElement>) => setN({ ...n, [k]: e.target.value });

  function escolherTipo(k: string) {
    setTipo(k);
    setSubs(new Set());
    const padrao = UNIDADE_PADRAO[k];
    if (padrao) setUnidade(padrao);
  }
  function marcar(codigo: string, filhos: string[] = []) {
    const novo = new Set(subs);
    if (novo.has(codigo)) {
      novo.delete(codigo);
      filhos.forEach((f) => novo.delete(f));
    } else novo.add(codigo);
    setSubs(novo);
  }

  const custoFixo = (Number(n.dias) || 0) * custoFixoPorDia;
  const custo = centavos(n.material) + centavos(n.maoObra) + centavos(n.outros) + custoFixo;
  const preco = centavos(n.preco);
  const mult = custo > 0 ? preco / custo : null;
  const qtd = Number(n.quantidade) || 0;
  const porUnidade = unidade !== "SERVICO" && qtd > 0;
  const nomeUnidade = t((UNIDADES as Record<string, string>)[unidade] ?? unidade);

  const opcoes: [string, string][] = [
    ...Object.entries(TIPOS_SERVICO).filter(([k]) => k !== "OUTRO"),
    ...personalizados.map((nome): [string, string] => [`${PREFIXO_PERSONALIZADO}${nome}`, nome]),
    ["OUTRO", "Outros"],
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <fieldset className="sm:col-span-2">
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
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 rounded-lg border border-stone-200 bg-stone-50 p-3">
            {SUBSERVICOS[tipo].map((s) => (
              <div key={s.k}>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="subServicos" value={s.k} checked={subs.has(s.k)} onChange={() => marcar(s.k, (s.subs ?? []).map((f) => `${s.k}.${f.k}`))} className="h-5 w-5" />
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
            ))}
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

      <div className="sm:col-span-2">
        <Campo rotulo={t("Descrição do trabalho *")}>
          <input className="campo" name="descricao" defaultValue={valor?.descricao ?? ""} required placeholder={t("Ex.: Deck de composite 12x16 com escada")} />
        </Campo>
      </div>
      <Campo rotulo={t("Cidade")}>
        <input className="campo" name="cidade" defaultValue={valor?.cidade ?? ""} placeholder="Fairfield" />
      </Campo>
      <Campo rotulo={t("Condado")}>
        <select className="campo" name="condado" defaultValue={valor?.condado ?? ""}>
          <option value="">—</option>
          {CONDADOS_CT.map((c) => <option key={c} value={c}>{c} County</option>)}
        </select>
      </Campo>
      <div className="grid grid-cols-[1fr_9rem] gap-2">
        <Campo rotulo={t("Quantidade *")}>
          <input className="campo" name="quantidade" inputMode="decimal" value={n.quantidade} onChange={mudar("quantidade")} required placeholder="192" />
        </Campo>
        <Campo rotulo={t("Unidade")}>
          <select className="campo" name="unidade" value={unidade} onChange={(e) => setUnidade(e.target.value)}>
            {Object.entries(UNIDADES).map(([k, v]) => <option key={k} value={k}>{t(v)}</option>)}
          </select>
        </Campo>
      </div>
      <Campo rotulo={t("Quando foi feito")}>
        <input className="campo" name="data" type="date" defaultValue={valor?.data ?? ""} />
      </Campo>

      <Campo rotulo={t("Custo de material (com delivery)")}>
        <input className="campo" name="material" inputMode="decimal" value={n.material} onChange={mudar("material")} placeholder="0.00" />
      </Campo>
      <Campo rotulo={t("Mão de obra (equipe, helpers e subcontratados)")}>
        <input className="campo" name="maoObra" inputMode="decimal" value={n.maoObra} onChange={mudar("maoObra")} placeholder="0.00" />
      </Campo>
      <Campo rotulo={t("Outros custos (permit, caçamba, aluguel de equipamento...)")}>
        <input className="campo" name="outros" inputMode="decimal" value={n.outros} onChange={mudar("outros")} placeholder="0.00" />
      </Campo>
      <div className="grid grid-cols-2 gap-2">
        <Campo rotulo={t("Dias de trabalho")}>
          <input className="campo" name="dias" inputMode="numeric" value={n.dias} onChange={mudar("dias")} placeholder="0" />
        </Campo>
        <Campo rotulo={t("Horas da equipe")}>
          <input className="campo" name="horas" inputMode="decimal" defaultValue={valor?.horas ? String(valor.horas) : ""} placeholder="0" />
        </Campo>
      </div>
      <Campo rotulo={t("Preço cobrado do cliente *")}>
        <input className="campo" name="preco" inputMode="decimal" value={n.preco} onChange={mudar("preco")} required placeholder="0.00" />
      </Campo>
      <div className="sm:col-span-2">
        <Campo rotulo={t("Observações")}>
          <textarea className="campo" name="observacoes" rows={2} defaultValue={valor?.observacoes ?? ""} placeholder={t("Ex.: madeira tratada, cliente pediu escada extra")} />
        </Campo>
      </div>

      <div className={`rounded-lg p-3 text-sm sm:col-span-2 ${mult === null ? "bg-stone-100" : mult >= 2 ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-900"}`}>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-4">
          <span>{t("Custo fixo ({dias} dias)", { dias: Number(n.dias) || 0 })}<b className="block tabular-nums">{dinheiro(custoFixo)}</b></span>
          <span>{t("Custo total")}<b className="block tabular-nums">{dinheiro(custo)}</b></span>
          <span>{t("Lucro")}<b className="block tabular-nums">{dinheiro(preco - custo)}</b></span>
          <span>{t("Multiplicador")}<b className="block tabular-nums">{mult === null ? "—" : `${mult.toFixed(2)}x`}</b></span>
        </div>
        {porUnidade && preco > 0 && (
          <p className="mt-2">
            {t("{preco} por {unidade} (custo {custo} por {unidade})", { preco: dinheiro(Math.round(preco / qtd)), custo: dinheiro(Math.round(custo / qtd)), unidade: nomeUnidade })}
          </p>
        )}
        {mult !== null && mult < 2 && (
          <p className="mt-2 font-semibold">
            {t("⚠ Abaixo da meta 2x. Para chegar ao dobro, o preço seria {valor}.", { valor: dinheiro(custo * 2) })}
          </p>
        )}
      </div>
    </div>
  );
}
