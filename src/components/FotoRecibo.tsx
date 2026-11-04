"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "@/i18n/cliente";
import { lerComprovante, lerReciboSalvo } from "@/app/(app)/obras/leitura";
import type { LeituraComprovante } from "@/lib/leitura-comprovante";
import { ImagemAmpliavel } from "./ImagemAmpliavel";

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

/**
 * Foto ou arquivo do comprovante. Com `ler`, a IA lê o documento e preenche no formulário o valor, a data, a forma
 * de pagamento e (se estiver vazia) a descrição; o que não encontrar fica em branco.
 */
export function FotoRecibo({
  rotulo,
  ler,
  salvo,
}: {
  rotulo?: string;
  ler?: "RECEBIMENTO" | "DESPESA";
  /** Recibo que um funcionário já mandou: aparece aqui, é lido pela IA ao abrir e vai junto com a despesa. */
  salvo?: { id: string; arquivo: string };
}) {
  const t = useT();
  const [leitura, setLeitura] = useState<{ lendo: boolean; aviso: string | null }>({ lendo: false, aviso: null });
  const campoReal = useRef<HTMLInputElement>(null);
  const [previa, setPrevia] = useState<string | null>(null);
  const [nome, setNome] = useState<string | null>(null);
  const [processando, setProcessando] = useState(false);
  const [usarSalvo, setUsarSalvo] = useState(Boolean(salvo));

  useEffect(() => {
    const form = campoReal.current?.form;
    // Formulário esvaziado depois de salvar: a prévia também some
    const aoLimpar = () => {
      setPrevia(null);
      setNome(null);
      setLeitura({ lendo: false, aviso: null });
    };
    form?.addEventListener("reset", aoLimpar);
    if (salvo && ler) lerDocumento(() => lerReciboSalvo(salvo.id));
    return () => form?.removeEventListener("reset", aoLimpar);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function escolher(e: React.ChangeEvent<HTMLInputElement>) {
    const original = e.target.files?.[0];
    e.target.value = "";
    if (!original || !campoReal.current) return;
    setProcessando(true);
    const arquivo = await comprimir(original);
    if (arquivo.size > 4 * 1024 * 1024) {
      setProcessando(false);
      alert(t("Arquivo maior que 4 MB. Use o botão Tirar foto ou envie um arquivo menor."));
      return;
    }
    const dt = new DataTransfer();
    dt.items.add(arquivo);
    campoReal.current.files = dt.files;
    setNome(arquivo.name);
    setPrevia(arquivo.type.startsWith("image/") && arquivo.type !== "image/heic" ? URL.createObjectURL(arquivo) : null);
    setProcessando(false);
    setUsarSalvo(false);
    if (ler) {
      const dados = new FormData();
      dados.set("arquivo", arquivo);
      dados.set("tipo", ler);
      await lerDocumento(() => lerComprovante(dados));
    }
  }

  async function lerDocumento(pedir: () => Promise<{ dados: LeituraComprovante } | { erro: string }>) {
    const form = campoReal.current?.form;
    if (!form) return;
    setLeitura({ lendo: true, aviso: null });
    const resposta = await pedir().catch((e: Error) => ({ erro: e.message || t("sem resposta do servidor") }));
    if ("erro" in resposta) {
      setLeitura({ lendo: false, aviso: t("Não consegui ler o comprovante ({motivo}). Preencha os campos à mão.", { motivo: resposta.erro }) });
      return;
    }
    const r = resposta.dados;
    const campo = (nome: string) => form.elements.namedItem(nome) as HTMLInputElement | HTMLSelectElement | null;
    const preencher = (nome: string, valor: string | null) => {
      const el = campo(nome);
      if (el) el.value = valor ?? "";
    };
    preencher("valor", r.valorCent !== null ? (r.valorCent / 100).toFixed(2) : null);
    preencher("data", r.data);
    preencher("formaPagamento", r.formaPagamento);
    const descricao = campo("descricao");
    if (descricao && !descricao.value.trim() && r.descricao) descricao.value = r.descricao;
    // O campo de fornecedor (CampoFornecedor) escuta este aviso e escolhe o fornecedor lido
    if (r.fornecedor) form.dispatchEvent(new CustomEvent("fornecedor-lido", { detail: { id: r.fornecedorId ?? null, nome: r.fornecedor } }));
    const achou = [r.valorCent !== null && t("valor"), r.data && t("data"), r.formaPagamento && t("forma de pagamento"), r.fornecedor && t("fornecedor")].filter(Boolean);
    setLeitura({
      lendo: false,
      aviso: achou.length
        ? t("Li o comprovante e preenchi: {campos}. Confira antes de salvar.", { campos: achou.join(", ") })
        : t("Não encontrei valor, data nem forma de pagamento no comprovante. Preencha à mão."),
    });
  }

  function limpar() {
    if (campoReal.current) campoReal.current.value = "";
    setPrevia(null);
    setNome(null);
  }

  return (
    <div>
      <span className="rotulo">{rotulo ?? t("Foto do recibo / nota fiscal")}</span>
      <input ref={campoReal} type="file" name="comprovante" className="hidden" />
      {salvo && <input type="hidden" name="reciboId" value={salvo.id} />}
      {salvo && usarSalvo && (
        <div className="mb-3 rounded-lg border border-stone-200 p-2">
          {salvo.arquivo.endsWith(".pdf") ? (
            <a href={`/api/comprovantes/${salvo.arquivo}`} target="_blank" rel="noreferrer" className="link text-sm">{t("Abrir o recibo (PDF)")}</a>
          ) : (
            <ImagemAmpliavel src={`/api/comprovantes/${salvo.arquivo}`} alt={t("Recibo enviado pelo funcionário")} className="max-h-72 rounded" />
          )}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <label className="botao cursor-pointer">
          {t("📷 Tirar foto")}
          <input type="file" accept="image/*" capture="environment" className="hidden" onChange={escolher} />
        </label>
        <label className="botao-secundario cursor-pointer">
          {t("Escolher arquivo")}
          <input type="file" accept="image/*,application/pdf" className="hidden" onChange={escolher} />
        </label>
      </div>
      {processando && <p className="mt-2 text-sm text-stone-500">{t("Preparando imagem...")}</p>}
      {leitura.lendo && <p className="mt-2 text-sm text-stone-500">{t("Lendo o comprovante...")}</p>}
      {leitura.aviso && <p className="mt-2 rounded-lg bg-sky-50 p-2 text-sm text-sky-900">{leitura.aviso}</p>}
      {nome && (
        <div className="mt-3 rounded-lg border border-stone-200 p-2">
          {previa ? <ImagemAmpliavel src={previa} alt={t("Prévia do recibo")} className="max-h-72 rounded" /> : <p className="text-sm">{nome}</p>}
          <button type="button" onClick={limpar} className="mt-2 text-sm text-red-700 hover:underline">{t("Remover")}</button>
        </div>
      )}
    </div>
  );
}
