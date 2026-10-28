"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useT } from "@/i18n/cliente";

type Item = { href: string; rotulo: string };

function ativo(caminho: string, href: string) {
  return href === "/" ? caminho === "/" : caminho.startsWith(href);
}

export function Menu({ itens }: { itens: Item[] }) {
  const caminho = usePathname();
  const [aberto, setAberto] = useState(false);
  const t = useT();

  return (
    <>
      <nav className="hidden gap-1 lg:flex">
        {itens.map((i) => (
          <Link
            key={i.href}
            href={i.href}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              ativo(caminho, i.href) ? "bg-marca-50 text-marca-700" : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            {i.rotulo}
          </Link>
        ))}
      </nav>
      {itens.length > 1 && (
        <div className="lg:hidden">
          <button className="botao-secundario px-3 py-1.5 text-sm" onClick={() => setAberto(!aberto)} aria-expanded={aberto}>
            {t("Menu")}
          </button>
          {aberto && (
            <nav className="absolute left-0 right-0 top-full border-b border-stone-200 bg-white p-2 shadow">
              {itens.map((i) => (
                <Link
                  key={i.href}
                  href={i.href}
                  onClick={() => setAberto(false)}
                  className={`block rounded-lg px-3 py-2 font-medium ${
                    ativo(caminho, i.href) ? "bg-marca-50 text-marca-700" : "text-stone-700"
                  }`}
                >
                  {i.rotulo}
                </Link>
              ))}
              <Link href="/conta" onClick={() => setAberto(false)} className="block rounded-lg px-3 py-2 font-medium text-stone-700">
                {t("Minha conta")}
              </Link>
            </nav>
          )}
        </div>
      )}
    </>
  );
}
