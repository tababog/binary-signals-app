"use client";

import { useState } from "react";

/** Localização da obra: o administrador pode usar o GPS do celular estando no local, ou colar as coordenadas do Google Maps. */
export function CamposLocalObra({ latitude, longitude, raioMetros }: { latitude: number | null; longitude: number | null; raioMetros: number }) {
  const [lat, setLat] = useState(latitude?.toString() ?? "");
  const [lng, setLng] = useState(longitude?.toString() ?? "");
  const [msg, setMsg] = useState<string | null>(null);

  function usarAtual() {
    if (!navigator.geolocation) return setMsg("Este aparelho não tem GPS disponível.");
    setMsg("Buscando localização...");
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setLat(p.coords.latitude.toFixed(6));
        setLng(p.coords.longitude.toFixed(6));
        setMsg(`Localização capturada (precisão ±${Math.round(p.coords.accuracy)} m).`);
      },
      () => setMsg("Não foi possível pegar a localização. Verifique a permissão do navegador."),
      { enableHighAccuracy: true, timeout: 15000 },
    );
  }

  // Aceita colar "40.7128, -74.0060" (como o Google Maps copia) no campo de latitude
  function colar(valor: string) {
    const m = valor.match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);
    if (m) {
      setLat(m[1]);
      setLng(m[2]);
    } else setLat(valor);
  }

  return (
    <fieldset className="rounded-lg border border-stone-200 p-3 sm:col-span-2">
      <legend className="px-1 text-sm font-semibold">Localização da obra (para conferir o ponto da equipe)</legend>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block">
          <span className="rotulo">Latitude</span>
          <input className="campo" name="latitude" value={lat} onChange={(e) => colar(e.target.value)} placeholder="40.712800" inputMode="decimal" />
        </label>
        <label className="block">
          <span className="rotulo">Longitude</span>
          <input className="campo" name="longitude" value={lng} onChange={(e) => setLng(e.target.value)} placeholder="-74.006000" inputMode="decimal" />
        </label>
        <label className="block">
          <span className="rotulo">Raio aceito (metros)</span>
          <input className="campo" name="raioMetros" type="number" min={20} max={5000} defaultValue={raioMetros} />
        </label>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button type="button" className="botao-secundario text-sm" onClick={usarAtual}>📍 Usar minha localização atual</button>
        {lat && lng && (
          <a className="link text-sm" target="_blank" rel="noreferrer" href={`https://www.google.com/maps?q=${lat},${lng}`}>Conferir no mapa</a>
        )}
      </div>
      <p className="mt-2 text-xs text-stone-500">
        {msg ?? "Dica: no Google Maps, toque e segure no local da obra e copie as coordenadas; cole no campo Latitude."}
      </p>
    </fieldset>
  );
}
