"use client";

import { useState } from "react";
import { useT } from "@/i18n/cliente";

/**
 * Botões para mandar o link da proposta ao cliente pelo e-mail, WhatsApp ou SMS do celular, com a mensagem em inglês
 * (regra 9), e para copiar o link.
 */
export function EnviarProposta({ link, mensagem, telefone, email }: { link: string; mensagem: string; telefone: string | null; email: string | null }) {
  const t = useT();
  const [copiado, setCopiado] = useState(false);
  const numero = (telefone ?? "").replace(/\D/g, "");
  const internacional = numero.length === 10 ? `1${numero}` : numero;
  const corpo = encodeURIComponent(mensagem);
  const assunto = encodeURIComponent("Your proposal from Tababog Construction");

  async function copiar() {
    try {
      await navigator.clipboard.writeText(link);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      window.prompt(t("Copie o link:"), link);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input readOnly value={link} aria-label={t("Link da proposta")} className="campo min-w-0 flex-1 text-sm" onFocus={(e) => e.currentTarget.select()} />
        <button type="button" onClick={copiar} className="botao-secundario whitespace-nowrap">{copiado ? t("Copiado ✓") : t("Copiar")}</button>
      </div>
      <div className="flex flex-wrap gap-2">
        <a href={`mailto:${email ?? ""}?subject=${assunto}&body=${corpo}`} className="botao">{t("E-mail")}</a>
        {internacional && (
          <>
            <a href={`https://wa.me/${internacional}?text=${corpo}`} target="_blank" rel="noreferrer" className="botao bg-emerald-600 hover:bg-emerald-700">WhatsApp</a>
            <a href={`sms:+${internacional}?&body=${corpo}`} className="botao-secundario">SMS</a>
          </>
        )}
        <a href={link} target="_blank" rel="noreferrer" className="botao-secundario">{t("Ver como o cliente vê")}</a>
      </div>
      {!email && <p className="text-xs text-stone-500">{t("O cliente não tem e-mail cadastrado: o e-mail abre sem destinatário.")}</p>}
    </div>
  );
}
