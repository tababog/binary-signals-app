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
  return (CATEGORIAS_DESPESA as Record<string, string>)[c] ?? (c === "PAGAMENTO_CLIENTE" ? "Pagamento do cliente" : c);
}

export function nomeStatus(s: string) {
  return (STATUS_OBRA as Record<string, string>)[s] ?? s;
}
