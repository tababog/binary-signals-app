"use client";

import { useRef, useState } from "react";
import { useT } from "@/i18n/cliente";
import { lerPedidoCliente } from "@/app/(app)/orcamentos/leitura-pedido";
import { comprimir } from "./FotoRecibo";

/**
 * Embaixo de "O que o cliente quer": prints da conversa com o cliente viram o texto do pedido (a IA lê).
 * O texto vai para o campo "descricao" do mesmo formulário; se já tinha algo escrito, entra embaixo.
 */
export function LerPrintCliente() {
  const t = useT();
  const raiz = useRef<HTMLDivElement>(null);
  const [estado, setEstado] = useState<{ lendo: boolean; aviso: string | null; erro: boolean }>({ lendo: false, aviso: null, erro: false });

  async function escolher(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivos = Array.from(e.target.files ?? []).slice(0, 5);
    e.target.value = "";
    if (!arquivos.length) return;
    setEstado({ lendo: true, aviso: null, erro: false });
    const dados = new FormData();
    for (const a of arquivos) dados.append("print", await comprimir(a));
    const r = await lerPedidoCliente(dados).catch((err: Error) => ({ erro: err.message || t("sem resposta do servidor") }));
    if ("erro" in r) return setEstado({ lendo: false, aviso: t("Não consegui ler o print ({motivo}). Escreva à mão.", { motivo: r.erro }), erro: true });
    const campo = raiz.current?.closest("form")?.elements.namedItem("descricao") as HTMLTextAreaElement | null;
    if (campo) {
      campo.value = campo.value.trim() ? `${campo.value.trim()}\n${r.texto}` : r.texto;
      campo.rows = Math.min(12, Math.max(3, campo.value.split("\n").length + 1));
    }
    setEstado({ lendo: false, aviso: t("Li o print e escrevi o pedido do cliente. Confira e complete."), erro: false });
  }

  return (
    <div ref={raiz} className="mt-2">
      <label className={`botao-secundario cursor-pointer px-3 py-1.5 text-sm ${estado.lendo ? "pointer-events-none opacity-60" : ""}`}>
        {estado.lendo ? t("Lendo o print...") : t("📷 Ler print da conversa do cliente")}
        <input type="file" accept="image/*" multiple className="hidden" onChange={escolher} disabled={estado.lendo} />
      </label>
      {estado.aviso && <p className={`mt-2 rounded-lg p-2 text-sm ${estado.erro ? "bg-amber-50 text-amber-900" : "bg-sky-50 text-sky-900"}`}>{estado.aviso}</p>}
    </div>
  );
}
