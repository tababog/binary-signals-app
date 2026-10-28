"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "@/i18n/cliente";

type Sugestao = { rotulo: string };

const SIGLAS: Record<string, string> = {
  Connecticut: "CT",
  "New York": "NY",
  Massachusetts: "MA",
  "Rhode Island": "RI",
  "New Jersey": "NJ",
};

// Região da Tababog (Connecticut e divisas), para as sugestões virem primeiro de perto
const CENTRO = { lat: 41.6, lon: -72.7 };

type Propriedades = {
  housenumber?: string;
  street?: string;
  name?: string;
  city?: string;
  town?: string;
  village?: string;
  state?: string;
  postcode?: string;
  countrycode?: string;
};

function formatar(p: Propriedades) {
  const rua = p.street ? [p.housenumber, p.street].filter(Boolean).join(" ") : p.name;
  const cidade = p.city ?? p.town ?? p.village;
  const estado = p.state ? SIGLAS[p.state] ?? p.state : undefined;
  return [rua, cidade, [estado, p.postcode].filter(Boolean).join(" ")].filter(Boolean).join(", ");
}

/**
 * Campo de endereço que sugere endereços reais enquanto a pessoa digita (Photon / OpenStreetMap, gratuito).
 * O valor continua editável: a sugestão só preenche o campo.
 */
export function CampoEndereco({
  name = "endereco",
  defaultValue,
  value,
  onChange,
  placeholder,
}: {
  name?: string;
  defaultValue?: string | null;
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
}) {
  const t = useT();
  const [interno, setInterno] = useState(defaultValue ?? "");
  const texto = value ?? interno;
  const [sugestoes, setSugestoes] = useState<Sugestao[]>([]);
  const [aberto, setAberto] = useState(false);
  const digitou = useRef(false);

  function mudar(v: string) {
    digitou.current = true;
    if (value === undefined) setInterno(v);
    onChange?.(v);
  }

  useEffect(() => {
    if (!digitou.current || texto.trim().length < 4) {
      setSugestoes([]);
      return;
    }
    const controle = new AbortController();
    const espera = setTimeout(async () => {
      try {
        const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(texto)}&limit=6&lang=en&lat=${CENTRO.lat}&lon=${CENTRO.lon}`;
        const r = await fetch(url, { signal: controle.signal });
        const dados: { features?: { properties: Propriedades }[] } = await r.json();
        const lista = (dados.features ?? [])
          .filter((f) => f.properties.countrycode === "US")
          .map((f) => ({ rotulo: formatar(f.properties) }))
          .filter((s, i, todos) => s.rotulo && todos.findIndex((o) => o.rotulo === s.rotulo) === i);
        setSugestoes(lista);
        setAberto(lista.length > 0);
      } catch {
        // Sem internet ou serviço fora do ar: o campo continua funcionando como texto comum
      }
    }, 350);
    return () => {
      clearTimeout(espera);
      controle.abort();
    };
  }, [texto]);

  return (
    <div className="relative">
      <input
        className="campo"
        name={name}
        value={texto}
        onChange={(e) => mudar(e.target.value)}
        onFocus={() => setAberto(sugestoes.length > 0)}
        onBlur={() => setTimeout(() => setAberto(false), 150)}
        placeholder={placeholder ?? t("Comece a digitar o endereço")}
        autoComplete="off"
        role="combobox"
        aria-expanded={aberto}
        aria-autocomplete="list"
      />
      {aberto && (
        <ul role="listbox" className="absolute left-0 right-0 top-full z-20 mt-1 max-h-64 overflow-auto rounded-lg border border-stone-200 bg-white shadow-lg">
          {sugestoes.map((s) => (
            <li key={s.rotulo} role="option" aria-selected={false}>
              <button
                type="button"
                className="block w-full px-3 py-2 text-left text-sm hover:bg-marca-50"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  if (value === undefined) setInterno(s.rotulo);
                  onChange?.(s.rotulo);
                  digitou.current = false;
                  setAberto(false);
                }}
              >
                📍 {s.rotulo}
              </button>
            </li>
          ))}
          <li className="px-3 py-1 text-right text-[10px] text-stone-400">© OpenStreetMap</li>
        </ul>
      )}
    </div>
  );
}
