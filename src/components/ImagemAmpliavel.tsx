"use client";

import { useState } from "react";
import { useT } from "@/i18n/cliente";

/**
 * Miniatura que abre em tela cheia ao tocar. Na tela cheia, tocar na imagem alterna entre caber na tela e
 * ampliada (2,5x, arrastando para ler os detalhes); o gesto de pinça do celular também funciona.
 */
export function ImagemAmpliavel({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const t = useT();
  const [aberta, setAberta] = useState(false);
  const [zoom, setZoom] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setAberta(true)} className="block" aria-label={t("Ampliar imagem")}>
        <img src={src} alt={alt} className={className} />
      </button>
      {aberta && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/95" role="dialog" aria-modal="true">
          <div className="flex items-center justify-between gap-2 p-3 text-sm text-white">
            <span>{zoom ? t("Toque na imagem para reduzir") : t("Toque na imagem para ampliar")}</span>
            <button type="button" onClick={() => { setAberta(false); setZoom(false); }} className="rounded-lg bg-white/15 px-3 py-1.5 font-semibold">
              {t("Fechar")} ✕
            </button>
          </div>
          <div className="flex-1 overflow-auto" style={{ touchAction: "pan-x pan-y pinch-zoom" }}>
            <img
              src={src}
              alt={alt}
              onClick={() => setZoom(!zoom)}
              className={zoom ? "max-w-none" : "mx-auto max-h-full max-w-full object-contain"}
              style={zoom ? { width: "250%" } : undefined}
            />
          </div>
        </div>
      )}
    </>
  );
}
