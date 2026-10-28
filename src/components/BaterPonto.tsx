"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { registrarEntrada, registrarSaida } from "@/app/(app)/ponto/actions";

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

export function BaterPonto({ obras, aberto }: { obras: { id: string; nome: string }[]; aberto: { obra: string; desde: string } | null }) {
  const [obraId, setObraId] = useState(obras[0]?.id ?? "");
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciar] = useTransition();
  const router = useRouter();

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
          Você está trabalhando em <b>{aberto.obra}</b> desde <b>{aberto.desde}</b>
        </p>
        <button className="w-full rounded-2xl bg-red-600 py-6 text-2xl font-bold text-white hover:bg-red-700 disabled:opacity-50" disabled={pendente} onClick={() => executar(registrarSaida)}>
          {pendente ? "Registrando..." : "Registrar SAÍDA"}
        </button>
        {erro && <p className="text-sm text-red-700">{erro}</p>}
      </div>
    );
  }

  if (obras.length === 0) return <p className="text-center text-sm text-stone-500">Nenhuma obra ativa no momento. Fale com o administrador.</p>;

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="rotulo">Em qual obra você está?</span>
        <select className="campo text-lg" value={obraId} onChange={(e) => setObraId(e.target.value)}>
          {obras.map((o) => <option key={o.id} value={o.id}>{o.nome}</option>)}
        </select>
      </label>
      <button
        className="w-full rounded-2xl bg-emerald-600 py-6 text-2xl font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
        disabled={pendente || !obraId}
        onClick={() => executar((local) => registrarEntrada(obraId, local))}
      >
        {pendente ? "Registrando..." : "Registrar ENTRADA"}
      </button>
      {erro && <p className="text-sm text-red-700">{erro}</p>}
      <p className="text-center text-xs text-stone-500">Sua localização é registrada ao marcar entrada e saída.</p>
    </div>
  );
}
