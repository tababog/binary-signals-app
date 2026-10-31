"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { registrarEntrada, registrarSaida, trocarObra } from "@/app/(app)/ponto/actions";
import { useT } from "@/i18n/cliente";

type Local = { lat: number; lng: number; precisao: number };

// maximumAge 0: sempre uma leitura nova do GPS no momento do toque
function pegarLocal(): Promise<Local | null> {
  return new Promise((ok) => {
    if (!navigator.geolocation) return ok(null);
    navigator.geolocation.getCurrentPosition(
      (p) => ok({ lat: p.coords.latitude, lng: p.coords.longitude, precisao: p.coords.accuracy }),
      () => ok(null),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  });
}

export function BaterPonto({ obras, aberto }: { obras: { id: string; nome: string }[]; aberto: { obraId: string; obra: string; desde: string } | null }) {
  const [obraId, setObraId] = useState(obras[0]?.id ?? "");
  const outras = obras.filter((o) => o.id !== aberto?.obraId);
  const [escolhida, setNovaObraId] = useState(outras[0]?.id ?? "");
  // Depois de trocar, a obra escolhida vira a atual: volta para a primeira das outras
  const novaObraId = outras.some((o) => o.id === escolhida) ? escolhida : (outras[0]?.id ?? "");
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciar] = useTransition();
  const router = useRouter();
  const t = useT();

  function executar(fn: (local: Local | null) => Promise<{ erro?: string }>) {
    setErro(null);
    iniciar(async () => {
      const r = await fn(await pegarLocal());
      if (r.erro) setErro(r.erro);
      router.refresh();
    });
  }

  if (aberto) {
    return (
      <div className="space-y-3 text-center">
        <p className="text-sm text-stone-600">
          {t("Você está trabalhando em")} <b>{aberto.obra}</b> {t("desde")} <b>{aberto.desde}</b>
        </p>
        <button className="w-full rounded-2xl bg-red-600 py-6 text-2xl font-bold text-white hover:bg-red-700 disabled:opacity-50" disabled={pendente} onClick={() => executar(registrarSaida)}>
          {pendente ? t("Registrando...") : t("Registrar SAÍDA")}
        </button>
        {erro && <p className="text-sm text-red-700">{erro}</p>}
        {outras.length > 0 && (
          <details className="rounded-xl border border-stone-200 p-3 text-left">
            <summary className="cursor-pointer text-sm font-semibold text-marca-700">{t("Vai para outra obra agora? Trocar de obra")}</summary>
            <p className="mt-2 text-xs text-stone-500">{t("Fecha as horas desta obra agora e começa a contar na outra.")}</p>
            <select className="campo mt-2" value={novaObraId} onChange={(e) => setNovaObraId(e.target.value)} aria-label={t("Nova obra")}>
              {outras.map((o) => <option key={o.id} value={o.id}>{o.nome}</option>)}
            </select>
            <button
              className="botao mt-2 w-full disabled:opacity-50"
              disabled={pendente || !novaObraId}
              onClick={() => executar((local) => trocarObra(novaObraId, local))}
            >
              {pendente ? t("Registrando...") : t("Trocar de obra")}
            </button>
          </details>
        )}
      </div>
    );
  }

  if (obras.length === 0) return <p className="text-center text-sm text-stone-500">{t("Nenhuma obra ativa no momento. Fale com o administrador.")}</p>;

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="rotulo">{t("Em qual obra você está?")}</span>
        <select className="campo text-lg" value={obraId} onChange={(e) => setObraId(e.target.value)}>
          {obras.map((o) => <option key={o.id} value={o.id}>{o.nome}</option>)}
        </select>
      </label>
      <button
        className="w-full rounded-2xl bg-emerald-600 py-6 text-2xl font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
        disabled={pendente || !obraId}
        onClick={() => executar((local) => registrarEntrada(obraId, local))}
      >
        {pendente ? t("Registrando...") : t("Registrar ENTRADA")}
      </button>
      {erro && <p className="text-sm text-red-700">{erro}</p>}
      <p className="text-center text-xs text-stone-500">{t("Sua localização é registrada ao marcar entrada e saída.")}</p>
    </div>
  );
}
