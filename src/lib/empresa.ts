/** Dados fixos da Tababog usados no contrato e na proposta para o cliente (sempre em inglês). */
export const EMPRESA = {
  nome: "TABABOG CONSTRUCTION, LLC",
  endereco: "129 Louisiana Ave., Bridgeport, CT 06610",
  telefone: "(475) 298-5931",
  // Registro de Home Improvement Contractor em CT (confirmar: o contrato antigo trazia HIC.0653606)
  hic: process.env.TABABOG_HIC || "HIC.0655127",
  responsavel: "Alessandro de Oliveira",
};
