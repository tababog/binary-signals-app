export type Local = { lat: number; lng: number; precisao: number };

/** Distância em metros entre dois pontos (fórmula de haversine). */
export function distanciaMetros(lat1: number, lng1: number, lat2: number, lng2: number) {
  const rad = (g: number) => (g * Math.PI) / 180;
  const a =
    Math.sin(rad(lat2 - lat1) / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lng2 - lng1) / 2) ** 2;
  return 2 * 6_371_000 * Math.asin(Math.sqrt(a));
}

export type Situacao =
  | { tipo: "NA_OBRA" | "FORA"; distancia: number }
  | { tipo: "SEM_GPS" | "OBRA_SEM_LOCAL" };

type Obra = { latitude: number | null; longitude: number | null; raioMetros: number };

/** Diz se uma marcação de ponto foi feita dentro do raio da obra. A precisão do GPS conta a favor do funcionário. */
export function situacaoLocal(lat: number | null, lng: number | null, precisao: number | null, obra: Obra): Situacao {
  if (lat == null || lng == null) return { tipo: "SEM_GPS" };
  if (obra.latitude == null || obra.longitude == null) return { tipo: "OBRA_SEM_LOCAL" };
  const distancia = distanciaMetros(lat, lng, obra.latitude, obra.longitude);
  const folga = Math.min(precisao ?? 0, 100);
  return { tipo: distancia - folga <= obra.raioMetros ? "NA_OBRA" : "FORA", distancia };
}

export function textoDistancia(m: number) {
  return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`;
}

export function linkMapa(lat: number, lng: number) {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

export function localValido(l: unknown): l is Local {
  const v = l as Local;
  return (
    !!v &&
    Number.isFinite(v.lat) && Math.abs(v.lat) <= 90 &&
    Number.isFinite(v.lng) && Math.abs(v.lng) <= 180 &&
    Number.isFinite(v.precisao) && v.precisao >= 0
  );
}

type RegistroComObra = {
  manual: boolean;
  saida: Date | null;
  latEntrada: number | null; lngEntrada: number | null; precisaoEntrada: number | null;
  latSaida: number | null; lngSaida: number | null; precisaoSaida: number | null;
  obra: Obra;
};

/** Marcação feita fora do raio da obra ou sem GPS (lançamentos manuais do administrador não contam). */
export function temAlertaLocal(r: RegistroComObra) {
  if (r.manual) return false;
  const ruim = (s: Situacao) => s.tipo === "FORA" || s.tipo === "SEM_GPS";
  return (
    ruim(situacaoLocal(r.latEntrada, r.lngEntrada, r.precisaoEntrada, r.obra)) ||
    (!!r.saida && ruim(situacaoLocal(r.latSaida, r.lngSaida, r.precisaoSaida, r.obra)))
  );
}
