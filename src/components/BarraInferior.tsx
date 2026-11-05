"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useT } from "@/i18n/cliente";
import { acoesRapidas, type Atalho } from "@/lib/atalhos";
import { Icone } from "./Icone";

function ativo(caminho: string, href: string) {
  return href === "/" ? caminho === "/" : caminho.startsWith(href);
}

/**
 * Barra fixa embaixo da tela no celular: Início sempre a um toque, as áreas mais usadas e o "+" com as ações rápidas.
 * No computador o menu de cima já mostra tudo, então a barra some.
 */
export function BarraInferior({ admin, podeEnviarRecibos }: { admin: boolean; podeEnviarRecibos: boolean }) {
  const caminho = usePathname();
  const t = useT();
  const [aberto, setAberto] = useState(false);

  // Fecha o "+" ao trocar de tela
  useEffect(() => setAberto(false), [caminho]);

  const itens: Atalho[] = admin
    ? [
        { href: "/", rotulo: t("Início"), icone: "inicio" },
        { href: "/obras", rotulo: t("Obras"), icone: "obra" },
        { href: "+", rotulo: t("Lançar"), icone: "inicio" },
        { href: "/visitas", rotulo: t("Visitas"), icone: "calendario" },
        { href: "/orcamentos", rotulo: t("Orçamentos"), icone: "lista" },
      ]
    : [{ href: "/ponto", rotulo: t("Meu ponto"), icone: "ponto" }, ...(podeEnviarRecibos ? [{ href: "/recibos", rotulo: t("Enviar recibo"), icone: "despesa" as const }] : [])];

  if (itens.length < 2) return null;

  return (
    <>
      {aberto && (
        <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setAberto(false)}>
          <div
            className="absolute inset-x-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] mx-auto max-w-md rounded-t-2xl bg-white p-3 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-3 gap-2">
              {acoesRapidas(t).map((a) => (
                <Link key={a.href} href={a.href} onClick={() => setAberto(false)} className="flex flex-col items-center gap-1.5 rounded-xl border-2 border-marca-600 bg-marca-100 p-3 text-center text-sm font-bold leading-tight text-logo active:bg-marca-50">
                  <Icone nome={a.icone} tamanho={28} />
                  {a.rotulo}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
      <nav aria-label={t("Navegação principal")} className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden">
        <ul className={`mx-auto grid max-w-md ${itens.length === 5 ? "grid-cols-5" : "grid-cols-2"}`}>
          {itens.map((i) =>
            i.href === "+" ? (
              <li key="+" className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setAberto((a) => !a)}
                  aria-expanded={aberto}
                  aria-label={t("Lançar")}
                  className="-mt-5 flex h-14 w-14 items-center justify-center rounded-full bg-logo text-3xl font-light text-white shadow-lg"
                >
                  {aberto ? "×" : "+"}
                </button>
              </li>
            ) : (
              <li key={i.href}>
                <Link
                  href={i.href}
                  className={`flex flex-col items-center gap-0.5 py-2 text-[11px] ${ativo(caminho, i.href) ? "font-bold text-logo" : "font-medium text-stone-500"}`}
                >
                  <Icone nome={i.icone} />
                  {i.rotulo}
                </Link>
              </li>
            ),
          )}
        </ul>
      </nav>
    </>
  );
}
