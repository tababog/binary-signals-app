"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { BANDEIRAS, IDIOMAS } from "@/i18n/idiomas";
import { useIdioma } from "@/i18n/cliente";
import { definirIdioma } from "@/i18n/acoes";

/** Só as bandeiras; o nome do idioma fica para leitores de tela. */
export function SeletorIdioma() {
  const atual = useIdioma();
  const [pendente, iniciar] = useTransition();
  const router = useRouter();
  return (
    <div className="flex gap-0.5" role="group" aria-label="Idioma / Language / Idioma">
      {IDIOMAS.map((i) => (
        <button
          key={i}
          type="button"
          disabled={pendente}
          aria-label={BANDEIRAS[i].nome}
          title={BANDEIRAS[i].nome}
          aria-pressed={atual === i}
          onClick={() =>
            iniciar(async () => {
              await definirIdioma(i);
              router.refresh();
            })
          }
          className={`rounded-md px-1 text-lg leading-none ${atual === i ? "bg-stone-200" : "opacity-60 hover:opacity-100"}`}
        >
          {BANDEIRAS[i].bandeira}
        </button>
      ))}
    </div>
  );
}
