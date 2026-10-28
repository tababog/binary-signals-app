"use client";

import { useState } from "react";
import { useT } from "@/i18n/cliente";
import type { Idioma } from "@/i18n/idiomas";

function mensagemConvite(idioma: Idioma, nome: string, admin: boolean, link: string) {
  if (idioma === "en") {
    const app = admin ? "Tababog management app (administrator access)" : "Tababog time clock app";
    return `Hi ${nome}! This is your access to the ${app}. Open the link, create your password and then add the app to your phone's home screen: ${link}`;
  }
  if (idioma === "es") {
    const app = admin ? "app de gestión de Tababog (acceso de administrador)" : "app de registro de horas de Tababog";
    return `¡Hola ${nome}! Este es tu acceso a la ${app}. Abre el enlace, crea tu contraseña y luego agrega la app a la pantalla de inicio del celular: ${link}`;
  }
  const app = admin ? "app de gestão da Tababog (acesso de administrador)" : "app de ponto da Tababog";
  return `Olá, ${nome}! Este é o seu acesso ao ${app}. Abra o link, crie a sua senha e depois adicione o app à tela inicial do celular: ${link}`;
}

/** Mostra o link de convite com botões para copiar e enviar pelo WhatsApp. */
export function LinkConvite({
  link,
  nome,
  telefone,
  admin,
  idioma = "pt",
}: {
  link: string;
  nome: string;
  telefone: string | null;
  admin?: boolean;
  idioma?: Idioma;
}) {
  const [copiado, setCopiado] = useState(false);
  const t = useT();
  // A mensagem vai no idioma de quem recebe (o escolhido no cadastro), não no de quem envia
  const mensagem = mensagemConvite(idioma, nome.split(" ")[0], !!admin, link);
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
      window.prompt(t("Copie o link:"), link);
    }
  }

  return (
    <div className="space-y-2">
      <input className="campo text-xs" readOnly value={link} onFocus={(e) => e.target.select()} aria-label={t("Link de convite")} />
      <div className="flex flex-wrap gap-2">
        <a href={whatsapp} target="_blank" rel="noreferrer" className="botao bg-emerald-600 hover:bg-emerald-700">
          {t("Enviar pelo WhatsApp")}
        </a>
        <button type="button" onClick={copiar} className="botao-secundario">
          {copiado ? t("Copiado!") : t("Copiar link")}
        </button>
      </div>
    </div>
  );
}
