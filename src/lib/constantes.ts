export const CATEGORIAS_DESPESA = {
  MATERIAL: "Material",
  ENTREGA: "Delivery / frete",
  MAO_DE_OBRA: "Mão de obra",
  INSTALACAO: "Instalação",
  SERVICO: "Serviços / subempreiteiros",
  EQUIPAMENTO: "Equipamentos / aluguel",
  LICENCA: "Licenças (permits) / inspeções",
  SEGURO: "Seguro específico da obra",
  DESCARTE: "Descarte / caçamba (dumpster)",
  OUTROS: "Outros",
} as const;

export const CATEGORIAS_ORCAMENTO = CATEGORIAS_DESPESA;

export const STATUS_OBRA = {
  PLANEJADA: "Planejada",
  EM_ANDAMENTO: "Em andamento",
  PAUSADA: "Pausada",
  CONCLUIDA: "Concluída",
} as const;

export const FORMAS_PAGAMENTO = ["Pix", "Dinheiro", "Cartão de crédito", "Cartão de débito", "Boleto", "Transferência", "Cheque"];

export function nomeCategoria(c: string) {
  if (c === "PAGAMENTO_CLIENTE") return "Pagamento do cliente";
  if (c === "CUSTO_FIXO") return "Custos fixos da empresa (rateio)";
  return (CATEGORIAS_DESPESA as Record<string, string>)[c] ?? c;
}

export function nomeStatus(s: string) {
  return (STATUS_OBRA as Record<string, string>)[s] ?? s;
}

export const TIPOS_SERVICO = {
  DECK: "Deck",
  GABINETE: "Gabinetes customizados",
  DRYWALL: "Drywall",
  PINTURA: "Pintura",
  ISOLAMENTO: "Isolamento acústico (insulation)",
  CARPINTARIA: "Carpintaria de acabamento (finish)",
  OUTRO: "Outros",
} as const;

/** Serviços que saíram da lista, mantidos só para mostrar registros antigos. */
const TIPOS_ANTIGOS: Record<string, string> = {
  IMPERMEABILIZACAO: "Impermeabilização",
  PAPEL_PAREDE: "Papel de parede",
};

type Sub = { k: string; nome: string; subs?: Sub[] };

/** Subserviços que aparecem ao escolher o serviço na visita. */
export const SUBSERVICOS: Record<string, Sub[]> = {
  DECK: [
    { k: "NOVO", nome: "Novo" },
    { k: "REPARO", nome: "Reparação" },
    { k: "PISO", nome: "Trocar somente o piso" },
    { k: "RENOVACAO", nome: "Renovação total" },
  ],
  DRYWALL: [
    { k: "PATCH", nome: "Patch" },
    { k: "HANGING", nome: "Hanging" },
    { k: "TAPING", nome: "Taping" },
  ],
  PINTURA: [
    {
      k: "INTERNA",
      nome: "Interna",
      subs: [
        { k: "PAREDES", nome: "Paredes" },
        { k: "TETO", nome: "Teto" },
        { k: "TRIMS", nome: "Trims" },
        { k: "BASEBOARD", nome: "Baseboard" },
        { k: "PORTAS", nome: "Portas" },
      ],
    },
    { k: "EXTERNA", nome: "Externa" },
  ],
  CARPINTARIA: [
    { k: "PORTAS", nome: "Instalação de portas" },
    { k: "TRIMS", nome: "Instalação de trims" },
    { k: "BASEBOARD", nome: "Baseboard" },
  ],
};

/** Prefixo dos serviços criados em "Outros" (o nome vem depois dele). */
export const PREFIXO_PERSONALIZADO = "P:";

/**
 * Descreve os subserviços escolhidos, ex.: "Interna: Paredes, Teto · Externa".
 * `t` traduz cada nome; os códigos vêm de SUBSERVICOS.
 */
export function descreverSubservicos(tipo: string | null, subServicos: string | null, t: (s: string) => string = (s) => s) {
  if (!tipo || !subServicos) return "";
  const marcados = new Set(subServicos.split(",").filter(Boolean));
  return (SUBSERVICOS[tipo] ?? [])
    .filter((s) => marcados.has(s.k))
    .map((s) => {
      const filhos = (s.subs ?? []).filter((f) => marcados.has(`${s.k}.${f.k}`)).map((f) => t(f.nome));
      return filhos.length ? `${t(s.nome)}: ${filhos.join(", ")}` : t(s.nome);
    })
    .join(" · ");
}

export const UNIDADES = {
  SQFT: "sq ft",
  LF: "ft linear",
  UN: "unidade",
  SERVICO: "serviço completo",
} as const;

/** Unidade mais comum de cada serviço, sugerida no cadastro. */
export const UNIDADE_PADRAO: Record<string, keyof typeof UNIDADES> = {
  DECK: "SQFT",
  GABINETE: "LF",
  DRYWALL: "SQFT",
  PINTURA: "SQFT",
  ISOLAMENTO: "SQFT",
  CARPINTARIA: "LF",
  OUTRO: "SERVICO",
};

export const CONDADOS_CT = ["Fairfield", "New Haven", "Hartford", "Litchfield", "Middlesex", "New London", "Tolland", "Windham"];

export function nomeTipoServico(t: string) {
  if (t.startsWith(PREFIXO_PERSONALIZADO)) return t.slice(PREFIXO_PERSONALIZADO.length);
  return (TIPOS_SERVICO as Record<string, string>)[t] ?? TIPOS_ANTIGOS[t] ?? t;
}

export function nomeUnidade(u: string) {
  return (UNIDADES as Record<string, string>)[u] ?? u;
}

export const STATUS_VISITA = {
  AGENDADA: "Agendada",
  REALIZADA: "Realizada",
  CANCELADA: "Cancelada",
} as const;
