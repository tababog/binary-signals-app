import { campoData } from "./format";
import { resumoObra } from "./financeiro";
import type { ValorTrabalho } from "@/components/CamposTrabalho";

const GRUPOS: Record<string, "material" | "maoObra" | "outros"> = {
  MATERIAL: "material",
  ENTREGA: "material",
  MAO_DE_OBRA: "maoObra",
  INSTALACAO: "maoObra",
  SERVICO: "maoObra",
};

/** "12 Oak St, Fairfield, CT 06824" → "Fairfield" */
export function cidadeDoEndereco(endereco: string | null) {
  const partes = (endereco ?? "").split(",").map((p) => p.trim()).filter(Boolean);
  return partes.length >= 3 ? partes[partes.length - 2] : null;
}

/**
 * Números reais de uma obra para pré-preencher o banco de preços: material (com delivery), mão de obra
 * (ponto da equipe, instalação e subcontratados), outros custos, dias com ponto, horas e valor do contrato.
 */
export async function referenciaDaObra(obraId: string): Promise<Partial<ValorTrabalho>> {
  const r = await resumoObra(obraId);
  const soma = { material: 0, maoObra: 0, outros: 0 };
  for (const c of r.porCategoria) {
    if (c.categoria === "CUSTO_FIXO") continue;
    soma[GRUPOS[c.categoria] ?? "outros"] += c.realizado;
  }
  return {
    descricao: r.obra.nome,
    cidade: cidadeDoEndereco(r.obra.endereco),
    quantidade: 0,
    data: campoData(new Date()),
    custoMaterialCent: soma.material,
    custoMaoObraCent: soma.maoObra,
    custoOutrosCent: soma.outros,
    dias: r.diasTrabalhados,
    horas: Math.round((r.horasEquipeMs / 3_600_000) * 10) / 10,
    precoCobradoCent: r.obra.valorContratoCent,
    observacoes: r.obra.descricao,
  };
}
