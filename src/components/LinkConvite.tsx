"use client";

import { useState } from "react";

/** Mostra o link de convite com botões para copiar e enviar pelo WhatsApp. */
export function LinkConvite({ link, nome, telefone, admin }: { link: string; nome: string; telefone: string | null; admin?: boolean }) {
  const [copiado, setCopiado] = useState(false);
  const app = admin ? "app de gestão da Tababog (acesso de administrador)" : "app de ponto da Tababog";
  const mensagem = `Olá, ${nome.split(" ")[0]}! Este é o seu acesso ao ${app}. Abra o link, crie a sua senha e depois adicione o app à tela inicial do celular: ${link}`;
  const numero = (telefone ?? "").replace(/\D/g, "");
  // Números de 10 dígitos são dos EUA: o WhatsApp precisa do código do país (1)
  const destino = numero.length === 10 ? `1${numero}` : numero;
  const whatsapp = `https://wa.me/${destino}?text=${encodeURIComponent(mensagem)}`;

  async function copiar() {
    try {
      await navigator.clipboard.writeText(link);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      window.prompt("Copie o link:", link);
    }
  }

  return (
    <div className="space-y-2">
      <input className="campo text-xs" readOnly value={link} onFocus={(e) => e.target.select()} aria-label="Link de convite" />
      <div className="flex flex-wrap gap-2">
        <a href={whatsapp} target="_blank" rel="noreferrer" className="botao bg-emerald-600 hover:bg-emerald-700">
          Enviar pelo WhatsApp
        </a>
        <button type="button" onClick={copiar} className="botao-secundario">
          {copiado ? "Copiado!" : "Copiar link"}
        </button>
      </div>
    </div>
  );
}
