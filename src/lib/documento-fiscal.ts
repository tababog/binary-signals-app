/**
 * Documento fiscal americano de subcontratados e helpers (para o W-9 e o 1099):
 * EIN de empresa (12-3456789) ou ITIN/SSN de pessoa física (123-45-6789; o ITIN sempre começa com 9).
 */
export const TIPOS_DOCUMENTO = {
  EIN: "EIN (empresa / pessoa jurídica)",
  ITIN: "ITIN (pessoa física)",
  SSN: "SSN (pessoa física)",
} as const;

export type TipoDocumento = keyof typeof TIPOS_DOCUMENTO;

/** Valida e formata. Devolve o texto formatado ou a mensagem de erro (em português, a tela traduz). */
export function lerDocumentoFiscal(tipo: string, valor: string): { tipo: TipoDocumento; documento: string } | { erro: string } | null {
  const digitos = valor.replace(/\D/g, "");
  if (!digitos) return null;
  if (!(tipo in TIPOS_DOCUMENTO)) return { erro: "Escolha se o documento é EIN, ITIN ou SSN." };
  if (digitos.length !== 9) return { erro: "O EIN, ITIN ou SSN tem 9 dígitos." };
  if (tipo === "ITIN" && !digitos.startsWith("9")) return { erro: "O ITIN sempre começa com 9. Confira se não é um SSN." };
  const documento = tipo === "EIN" ? `${digitos.slice(0, 2)}-${digitos.slice(2)}` : `${digitos.slice(0, 3)}-${digitos.slice(3, 5)}-${digitos.slice(5)}`;
  return { tipo: tipo as TipoDocumento, documento };
}

/** Só os 4 últimos dígitos, para listas: "EIN ••-•••6789". */
export function documentoMascarado(tipo: string | null, documento: string | null) {
  if (!documento) return null;
  return `${tipo ?? ""} •••${documento.replace(/\D/g, "").slice(-4)}`.trim();
}

/**
 * Lê tipoDocumento/documento do formulário. `obrigatorio`: subcontratado e helper precisam do documento.
 * Devolve os campos para gravar ou a mensagem de erro.
 */
export function documentoDoFormulario(form: FormData, obrigatorio: boolean): { tipoDocumento: string | null; documento: string | null } | { erro: string } {
  const lido = lerDocumentoFiscal(String(form.get("tipoDocumento") ?? ""), String(form.get("documento") ?? ""));
  if (!lido) return obrigatorio ? { erro: "Informe o EIN (empresa) ou o ITIN/SSN (pessoa física)." } : { tipoDocumento: null, documento: null };
  if ("erro" in lido) return lido;
  return { tipoDocumento: lido.tipo, documento: lido.documento };
}
