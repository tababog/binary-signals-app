"use client";

import { useState } from "react";
import { TIPOS_DOCUMENTO } from "@/lib/documento-fiscal";
import { useT } from "@/i18n/cliente";
import { Campo } from "./ui";

/** Tipo (EIN / ITIN / SSN) e número do documento fiscal, com a máscara certa para cada tipo. */
export function CampoDocumentoFiscal({ tipo, documento, obrigatorio }: { tipo?: string | null; documento?: string | null; obrigatorio?: boolean }) {
  const t = useT();
  const [tp, setTp] = useState(tipo ?? "");
  return (
    <div className="grid grid-cols-[minmax(0,11rem)_1fr] gap-2 sm:col-span-2">
      <Campo rotulo={obrigatorio ? t("Documento fiscal *") : t("Documento fiscal")}>
        <select className="campo" name="tipoDocumento" value={tp} onChange={(e) => setTp(e.target.value)} required={obrigatorio}>
          <option value="">—</option>
          {Object.entries(TIPOS_DOCUMENTO).map(([k, v]) => <option key={k} value={k}>{t(v)}</option>)}
        </select>
      </Campo>
      <Campo rotulo={tp === "EIN" ? t("Número do EIN") : tp ? t("Número do {tipo}", { tipo: tp }) : t("Número")}>
        <input
          className="campo"
          name="documento"
          inputMode="numeric"
          autoComplete="off"
          defaultValue={documento ?? ""}
          placeholder={tp === "EIN" ? "12-3456789" : tp === "ITIN" ? "9XX-XX-XXXX" : "123-45-6789"}
          required={obrigatorio}
        />
      </Campo>
    </div>
  );
}
