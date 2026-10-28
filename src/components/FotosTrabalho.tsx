"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "@/i18n/cliente";
import { ImagemAmpliavel } from "./ImagemAmpliavel";

const LADO_MAXIMO = 1600;
// A Vercel aceita ~4,5 MB por envio; fotos reduzidas ficam com 200–500 KB cada
const LIMITE_TOTAL = 3.8 * 1024 * 1024;

async function comprimir(arquivo: File): Promise<File> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(arquivo.type)) return arquivo;
  try {
    const bitmap = await createImageBitmap(arquivo);
    const escala = Math.min(1, LADO_MAXIMO / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * escala);
    canvas.height = Math.round(bitmap.height * escala);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((ok) => canvas.toBlob(ok, "image/jpeg", 0.8));
    return blob ? new File([blob], arquivo.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" }) : arquivo;
  } catch {
    return arquivo;
  }
}

/** Várias fotos do trabalho (câmera ou galeria), reduzidas no celular antes do envio. */
export function FotosTrabalho({ name = "fotos" }: { name?: string }) {
  const t = useT();
  const campo = useRef<HTMLInputElement>(null);
  const [fotos, setFotos] = useState<{ arquivo: File; url: string }[]>([]);
  const [aviso, setAviso] = useState<string | null>(null);
  const [processando, setProcessando] = useState(false);

  // Quando o formulário é esvaziado (fotos já enviadas), some com as miniaturas
  useEffect(() => {
    const form = campo.current?.form;
    const limpar = () => {
      setFotos([]);
      setAviso(null);
    };
    form?.addEventListener("reset", limpar);
    return () => form?.removeEventListener("reset", limpar);
  }, []);

  function sincronizar(lista: { arquivo: File }[]) {
    const dt = new DataTransfer();
    lista.forEach((f) => dt.items.add(f.arquivo));
    if (campo.current) campo.current.files = dt.files;
  }

  async function adicionar(e: React.ChangeEvent<HTMLInputElement>) {
    const escolhidas = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!escolhidas.length) return;
    setProcessando(true);
    const novas = await Promise.all(escolhidas.map(comprimir));
    let lista = [...fotos];
    let total = lista.reduce((s, f) => s + f.arquivo.size, 0);
    let recusadas = 0;
    for (const arquivo of novas) {
      if (total + arquivo.size > LIMITE_TOTAL) {
        recusadas++;
        continue;
      }
      total += arquivo.size;
      lista = [...lista, { arquivo, url: URL.createObjectURL(arquivo) }];
    }
    setFotos(lista);
    sincronizar(lista);
    setAviso(recusadas ? t("{n} foto(s) não couberam neste envio. Salve e adicione as outras depois, na página da visita.", { n: recusadas }) : null);
    setProcessando(false);
  }

  function remover(i: number) {
    const lista = fotos.filter((_, j) => j !== i);
    setFotos(lista);
    sincronizar(lista);
  }

  return (
    <div>
      <input ref={campo} type="file" name={name} multiple className="hidden" />
      <div className="flex flex-wrap gap-2">
        <label className="botao cursor-pointer">
          {t("📷 Tirar foto")}
          <input type="file" accept="image/*" capture="environment" className="hidden" onChange={adicionar} />
        </label>
        <label className="botao-secundario cursor-pointer">
          {t("Escolher fotos")}
          <input type="file" accept="image/*" multiple className="hidden" onChange={adicionar} />
        </label>
      </div>
      {processando && <p className="mt-2 text-sm text-stone-500">{t("Preparando imagem...")}</p>}
      {aviso && <p className="mt-2 text-sm text-amber-800">{aviso}</p>}
      {fotos.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {fotos.map((f, i) => (
            <div key={f.url} className="relative">
              <ImagemAmpliavel src={f.url} alt="" className="aspect-square w-full rounded-lg object-cover" />
              <button type="button" onClick={() => remover(i)} aria-label={t("Remover")} className="absolute right-1 top-1 rounded-full bg-white/90 px-2 text-sm text-red-700 shadow">
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
