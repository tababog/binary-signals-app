"use client";

import { useState } from "react";

/**
 * "ver original" de um texto traduzido. Só com <span> e <button> (não <details>), porque o texto aparece dentro de
 * parágrafos e células, onde um <details> é HTML inválido e quebra a hidratação da página.
 */
export function VerOriginal({ texto, rotulo }: { texto: string; rotulo: string }) {
  const [aberto, setAberto] = useState(false);
  return (
    <span className="text-xs text-stone-500">
      <button type="button" onClick={() => setAberto((a) => !a)} aria-expanded={aberto} className="cursor-pointer select-none underline-offset-2 hover:underline">
        {rotulo}
      </button>
      {aberto && <span className="block whitespace-pre-line">{texto}</span>}
    </span>
  );
}
