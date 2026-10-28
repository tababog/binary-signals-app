"use client";

import { useState, useTransition } from "react";
import { traduzirParaCliente } from "@/app/(app)/visitas/mensagem";
import { useT } from "@/i18n/cliente";

/**
 * Mensagem para o cliente: escreve em qualquer idioma, o app traduz para inglês (o cliente sempre recebe em inglês)
 * e abre o WhatsApp, o SMS ou o e-mail do celular com o texto já em inglês.
 */
export function MensagemCliente({ nome, telefone, email }: { nome: string; telefone: string | null; email: string | null }) {
  const t = useT();
  const [aberto, setAberto] = useState(false);
  const [original, setOriginal] = useState("");
  const [ingles, setIngles] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [traduzindo, iniciar] = useTransition();

  const numero = (telefone ?? "").replace(/\D/g, "");
  const internacional = numero.length === 10 ? `1${numero}` : numero;

  function traduzir() {
    setErro(null);
    iniciar(async () => {
      const r = await traduzirParaCliente(original).catch(() => ({ erro: t("sem resposta do servidor") }));
      if ("erro" in r) setErro(r.erro);
      else setIngles(r.texto);
    });
  }

  const corpo = encodeURIComponent(ingles ?? "");
  return (
    <>
      <button type="button" onClick={() => setAberto(true)} className="botao-secundario px-2 py-1">
        {t("Mensagem")}
      </button>
      {aberto && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center" role="dialog" aria-modal="true">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-4 shadow-xl sm:rounded-2xl">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-base font-semibold">{t("Mensagem para {nome}", { nome })}</h2>
              <button type="button" onClick={() => setAberto(false)} className="text-sm text-stone-500">{t("Fechar")} ✕</button>
            </div>
            <label className="rotulo" htmlFor="msg-original">{t("Escreva em português, inglês ou espanhol")}</label>
            <textarea
              id="msg-original"
              className="campo"
              rows={4}
              value={original}
              onChange={(e) => {
                setOriginal(e.target.value);
                setIngles(null);
              }}
              placeholder={t("Ex.: Olá, amanhã chegamos às 9h para medir o deck.")}
            />
            <button type="button" onClick={traduzir} disabled={traduzindo || !original.trim()} className="botao mt-2 w-full">
              {traduzindo ? t("Traduzindo...") : t("Traduzir para inglês")}
            </button>
            {erro && <p className="mt-2 rounded-lg bg-red-50 p-2 text-sm text-red-700">{erro}</p>}

            {ingles !== null && (
              <div className="mt-4">
                <label className="rotulo" htmlFor="msg-ingles">{t("Mensagem em inglês (o cliente recebe esta)")}</label>
                <textarea id="msg-ingles" className="campo" rows={5} value={ingles} onChange={(e) => setIngles(e.target.value)} />
                <div className="mt-2 flex flex-wrap gap-2">
                  {internacional && (
                    <>
                      <a href={`https://wa.me/${internacional}?text=${corpo}`} target="_blank" rel="noreferrer" className="botao bg-emerald-600 hover:bg-emerald-700">WhatsApp</a>
                      <a href={`sms:+${internacional}?&body=${corpo}`} className="botao-secundario">SMS</a>
                    </>
                  )}
                  {email && <a href={`mailto:${email}?subject=${encodeURIComponent("Tababog Construction")}&body=${corpo}`} className="botao-secundario">{t("E-mail")}</a>}
                </div>
                {!internacional && !email && <p className="mt-2 text-sm text-stone-500">{t("O cliente não tem telefone nem e-mail cadastrado.")}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
