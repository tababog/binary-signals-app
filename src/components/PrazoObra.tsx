"use client";

import { useState } from "react";
import { useT } from "@/i18n/cliente";
import { Campo } from "./ui";

/** Dias de segunda a sexta entre as duas datas ("aaaa-mm-dd"), contando as duas. */
export function diasUteisEntre(inicio: string, fim: string) {
  const a = new Date(`${inicio}T12:00:00Z`);
  const b = new Date(`${fim}T12:00:00Z`);
  if (isNaN(a.getTime()) || isNaN(b.getTime()) || b < a) return null;
  let dias = 0;
  for (const d = new Date(a); d <= b; d.setUTCDate(d.getUTCDate() + 1)) {
    const semana = d.getUTCDay();
    if (semana !== 0 && semana !== 6) dias++;
  }
  return dias;
}

/**
 * Início, previsão de entrega e dias de trabalho previstos. Com as duas datas preenchidas, os dias
 * são calculados sozinhos (segunda a sexta, como no rateio dos custos fixos); dá para corrigir à mão.
 */
export function PrazoObra({ inicio, previsao, dias }: { inicio: string; previsao: string; dias: number }) {
  const t = useT();
  const [datas, setDatas] = useState({ inicio, previsao });
  const [valor, setValor] = useState(String(dias));
  // Só recalcula enquanto o número não foi digitado à mão
  const [manual, setManual] = useState(dias > 0 && diasUteisEntre(inicio, previsao) !== dias);

  function mudarData(campo: "inicio" | "previsao", v: string) {
    const novas = { ...datas, [campo]: v };
    setDatas(novas);
    const calculado = diasUteisEntre(novas.inicio, novas.previsao);
    if (!manual && calculado !== null) setValor(String(calculado));
  }

  const calculado = diasUteisEntre(datas.inicio, datas.previsao);
  return (
    <>
      <Campo rotulo={t("Início")}>
        <input className="campo" name="dataInicio" type="date" value={datas.inicio} onChange={(e) => mudarData("inicio", e.target.value)} />
      </Campo>
      <Campo rotulo={t("Previsão de entrega")}>
        <input className="campo" name="dataPrevista" type="date" value={datas.previsao} onChange={(e) => mudarData("previsao", e.target.value)} />
      </Campo>
      <div>
        <Campo rotulo={t("Dias de trabalho previstos (para orçar os custos fixos)")}>
          <input
            className="campo"
            name="diasPrevistos"
            type="number"
            min={0}
            max={1000}
            value={valor}
            onChange={(e) => {
              setValor(e.target.value);
              setManual(true);
            }}
          />
        </Campo>
        {calculado !== null && (
          <p className="mt-1 text-xs text-stone-500">
            {t("{n} dias úteis (seg. a sex.) entre as datas.", { n: calculado })}{" "}
            {Number(valor) !== calculado && (
              <button
                type="button"
                className="link"
                onClick={() => {
                  setValor(String(calculado));
                  setManual(false);
                }}
              >
                {t("Usar")}
              </button>
            )}
          </p>
        )}
      </div>
    </>
  );
}
