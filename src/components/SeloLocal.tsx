import { linkMapa, situacaoLocal, textoDistancia } from "@/lib/geo";

type Obra = { latitude: number | null; longitude: number | null; raioMetros: number };

/** Selo para o administrador: a marcação foi feita na obra ou fora dela? */
export function SeloLocal({ lat, lng, precisao, obra }: { lat: number | null; lng: number | null; precisao: number | null; obra: Obra }) {
  const s = situacaoLocal(lat, lng, precisao, obra);
  const mapa = lat != null && lng != null ? linkMapa(lat, lng) : null;
  const conteudo =
    s.tipo === "NA_OBRA" ? (
      <span className="selo bg-emerald-100 text-emerald-800">✓ Na obra · {textoDistancia(s.distancia)}</span>
    ) : s.tipo === "FORA" ? (
      <span className="selo bg-red-100 text-red-800">⚠ Fora · {textoDistancia(s.distancia)}</span>
    ) : s.tipo === "SEM_GPS" ? (
      <span className="selo bg-amber-100 text-amber-800">⚠ Sem GPS</span>
    ) : (
      <span className="selo bg-stone-100 text-stone-600">📍 Ver no mapa</span>
    );
  return mapa ? (
    <a href={mapa} target="_blank" rel="noreferrer" title={precisao ? `Precisão do GPS: ±${Math.round(precisao)} m` : undefined}>
      {conteudo}
    </a>
  ) : (
    conteudo
  );
}
