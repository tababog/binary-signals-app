// Formato de dinheiro sem dependências do servidor: pode ser usado nos componentes do celular.
const MOEDA = process.env.NEXT_PUBLIC_MOEDA || "USD";

const fmtMoeda = new Intl.NumberFormat("en-US", { style: "currency", currency: MOEDA });

export function dinheiro(centavos: number) {
  return fmtMoeda.format(centavos / 100);
}
