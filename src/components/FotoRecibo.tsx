"use client";

import { useRef, useState } from "react";

const LADO_MAXIMO = 1600;

/** Reduz fotos grandes do celular para enviar mais rápido (mantém PDFs e HEIC como estão). */
async function comprimir(arquivo: File): Promise<File> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(arquivo.type)) return arquivo;
  try {
    const bitmap = await createImageBitmap(arquivo);
    const escala = Math.min(1, LADO_MAXIMO / Math.max(bitmap.width, bitmap.height));
    if (escala === 1 && arquivo.size < 1_500_000) return arquivo;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * escala);
    canvas.height = Math.round(bitmap.height * escala);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((ok) => canvas.toBlob(ok, "image/jpeg", 0.82));
    if (!blob) return arquivo;
    return new File([blob], arquivo.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return arquivo;
  }
}

export function FotoRecibo({ rotulo = "Foto do recibo / nota fiscal" }: { rotulo?: string }) {
  const campoReal = useRef<HTMLInputElement>(null);
  const [previa, setPrevia] = useState<string | null>(null);
  const [nome, setNome] = useState<string | null>(null);
  const [processando, setProcessando] = useState(false);

  async function escolher(e: React.ChangeEvent<HTMLInputElement>) {
    const original = e.target.files?.[0];
    e.target.value = "";
    if (!original || !campoReal.current) return;
    setProcessando(true);
    const arquivo = await comprimir(original);
    const dt = new DataTransfer();
    dt.items.add(arquivo);
    campoReal.current.files = dt.files;
    setNome(arquivo.name);
    setPrevia(arquivo.type.startsWith("image/") && arquivo.type !== "image/heic" ? URL.createObjectURL(arquivo) : null);
    setProcessando(false);
  }

  function limpar() {
    if (campoReal.current) campoReal.current.value = "";
    setPrevia(null);
    setNome(null);
  }

  return (
    <div>
      <span className="rotulo">{rotulo}</span>
      <input ref={campoReal} type="file" name="comprovante" className="hidden" />
      <div className="flex flex-wrap gap-2">
        <label className="botao cursor-pointer">
          📷 Tirar foto
          <input type="file" accept="image/*" capture="environment" className="hidden" onChange={escolher} />
        </label>
        <label className="botao-secundario cursor-pointer">
          Escolher arquivo
          <input type="file" accept="image/*,application/pdf" className="hidden" onChange={escolher} />
        </label>
      </div>
      {processando && <p className="mt-2 text-sm text-stone-500">Preparando imagem...</p>}
      {nome && (
        <div className="mt-3 rounded-lg border border-stone-200 p-2">
          {previa ? <img src={previa} alt="Prévia do recibo" className="max-h-72 rounded" /> : <p className="text-sm">{nome}</p>}
          <button type="button" onClick={limpar} className="mt-2 text-sm text-red-700 hover:underline">Remover</button>
        </div>
      )}
    </div>
  );
}
