"use client";

import { useState } from "react";
import { useT } from "@/i18n/cliente";

/**
 * Mensagem pronta para o cliente (em inglês): dá para ajustar o texto e mandar pelo WhatsApp, SMS ou e-mail do
 * celular, ou copiar.
 */
export function EnviarMensagem({ mensagem, telefone, email, assunto }: { mensagem: string; telefone: string | null; email: string | null; assunto: string }) {
  const t = useT();
  const [texto, setTexto] = useState(mensagem);
  const [copiado, setCopiado] = useState(false);
  const numero = (telefone ?? "").replace(/\D/g, "");
  const internacional = numero.length === 10 ? `1${numero}` : numero;
  const corpo = encodeURIComponent(texto);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      window.prompt(t("Copie a mensagem:"), texto);
    }
  }

  return (
    <div className="space-y-2">
      <label className="rotulo" htmlFor="msg-extras">{t("Mensagem em inglês (o cliente recebe esta)")}</label>
      <textarea id="msg-extras" className="campo text-sm" rows={9} value={texto} onChange={(e) => setTexto(e.target.value)} />
      <div className="flex flex-wrap gap-2">
        {internacional && (
          <>
            <a href={`https://wa.me/${internacional}?text=${corpo}`} target="_blank" rel="noreferrer" className="botao bg-emerald-600 hover:bg-emerald-700">WhatsApp</a>
            <a href={`sms:+${internacional}?&body=${corpo}`} className="botao-secundario">SMS</a>
          </>
        )}
        <a href={`mailto:${email ?? ""}?subject=${encodeURIComponent(assunto)}&body=${corpo}`} className="botao-secundario">{t("E-mail")}</a>
        <button type="button" onClick={copiar} className="botao-secundario">{copiado ? t("Copiado ✓") : t("Copiar")}</button>
      </div>
    </div>
  );
}
