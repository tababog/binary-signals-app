"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { marcarFollowUpEnviado } from "@/app/(app)/visitas/actions";

type Idioma = "en" | "pt" | "es";
// Só a bandeira na tela; o nome do idioma fica para leitores de tela
const IDIOMAS: { id: Idioma; bandeira: string; nome: string }[] = [
  { id: "en", bandeira: "🇺🇸", nome: "English" },
  { id: "pt", bandeira: "🇧🇷", nome: "Português" },
  { id: "es", bandeira: "🇪🇸", nome: "Español" },
];

/**
 * Mensagem pronta para o cliente, editável, com botões que abrem o WhatsApp, o SMS ou o e-mail do próprio celular.
 * Ao tocar em um canal, o follow-up é marcado como enviado.
 */
export function EnviarFollowUp({
  followUpId,
  mensagens,
  assuntos,
  telefone,
  email,
}: {
  followUpId: string;
  mensagens: Record<Idioma, string>;
  assuntos: Record<Idioma, string>;
  telefone: string;
  email: string | null;
}) {
  const [idioma, setIdioma] = useState<Idioma>("en");
  const [texto, setTexto] = useState(mensagens.en);
  const [, iniciar] = useTransition();
  const router = useRouter();

  function trocarIdioma(i: Idioma) {
    setIdioma(i);
    setTexto(mensagens[i]);
  }

  function registrar(canal: "WHATSAPP" | "SMS" | "EMAIL") {
    iniciar(async () => {
      await marcarFollowUpEnviado(followUpId, canal);
      router.refresh();
    });
  }

  const corpo = encodeURIComponent(texto);
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {IDIOMAS.map((i) => (
          <button
            key={i.id}
            type="button"
            onClick={() => trocarIdioma(i.id)}
            aria-label={i.nome}
            title={i.nome}
            aria-pressed={idioma === i.id}
            className={`rounded-full px-3 py-1 text-xl ${idioma === i.id ? "bg-stone-800 ring-2 ring-stone-800" : "bg-stone-100"}`}
          >
            {i.bandeira}
          </button>
        ))}
      </div>
      <textarea className="campo text-sm" rows={5} value={texto} onChange={(e) => setTexto(e.target.value)} aria-label="Mensagem" />
      <div className="flex flex-wrap gap-2">
        {telefone && (
          <>
            <a href={`https://wa.me/${telefone}?text=${corpo}`} target="_blank" rel="noreferrer" onClick={() => registrar("WHATSAPP")} className="botao bg-emerald-600 hover:bg-emerald-700">
              WhatsApp
            </a>
            {/* "?&body=" funciona tanto no iPhone quanto no Android */}
            <a href={`sms:+${telefone}?&body=${corpo}`} onClick={() => registrar("SMS")} className="botao-secundario">
              SMS
            </a>
          </>
        )}
        {email && (
          <a href={`mailto:${email}?subject=${encodeURIComponent(assuntos[idioma])}&body=${corpo}`} onClick={() => registrar("EMAIL")} className="botao-secundario">
            E-mail
          </a>
        )}
        {!telefone && !email && <p className="text-sm text-amber-800">Cadastre o telefone ou o e-mail do cliente para enviar.</p>}
      </div>
    </div>
  );
}
