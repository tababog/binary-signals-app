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
  ISOLAMENTO: "Isolamento (acústico / sótão)",
  IMPERMEABILIZACAO: "Impermeabilização",
  PAPEL_PAREDE: "Papel de parede",
  CARPINTARIA: "Carpintaria / acabamento",
  OUTRO: "Outro",
} as const;

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
  IMPERMEABILIZACAO: "SQFT",
  PAPEL_PAREDE: "SQFT",
  CARPINTARIA: "LF",
  OUTRO: "SERVICO",
};

export const CONDADOS_CT = ["Fairfield", "New Haven", "Hartford", "Litchfield", "Middlesex", "New London", "Tolland", "Windham"];

export function nomeTipoServico(t: string) {
  return (TIPOS_SERVICO as Record<string, string>)[t] ?? t;
}

export function nomeUnidade(u: string) {
  return (UNIDADES as Record<string, string>)[u] ?? u;
}
