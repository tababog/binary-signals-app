import { db } from "./db";
import { PREFIXO_PERSONALIZADO, SUBSERVICOS, TIPOS_SERVICO, type ServicoMarcado } from "./constantes";

/**
 * Serviços marcados no formulário (ServicoPicker): `tiposServico` (vários, na ordem em que foram marcados),
 * `sub:<tipo>` com os subserviços de cada um e `servicoOutro` com o nome do serviço novo em "Outros"
 * (vira opção fixa). O primeiro vai em tipoServico/subServicos; os outros em outrosServicos (JSON).
 */
export async function lerServicosDoFormulario(form: FormData): Promise<{ erro: string } | { tipoServico: string | null; subServicos: string | null; outrosServicos: string | null }> {
  const marcados: ServicoMarcado[] = [];
  for (const bruto of form.getAll("tiposServico").map(String)) {
    let tipo = bruto;
    const subs = form.getAll(`sub:${bruto}`).map(String);
    if (tipo === "OUTRO") {
      const nome = String(form.get("servicoOutro") ?? "").trim().slice(0, 60);
      if (!nome) return { erro: 'Escreva qual é o serviço em "Outros".' };
      await db.servicoPersonalizado.upsert({ where: { nome }, update: {}, create: { nome } });
      tipo = `${PREFIXO_PERSONALIZADO}${nome}`;
    } else if (!(tipo in TIPOS_SERVICO) && !tipo.startsWith(PREFIXO_PERSONALIZADO)) continue;
    if (marcados.some((m) => m.tipo === tipo)) continue;
    const validos = new Set((SUBSERVICOS[tipo] ?? []).flatMap((s) => [s.k, ...(s.subs ?? []).map((f) => `${s.k}.${f.k}`)]));
    marcados.push({ tipo, subServicos: subs.filter((c) => validos.has(c)).join(",") || null });
  }
  const [principal, ...outros] = marcados;
  return {
    tipoServico: principal?.tipo ?? null,
    subServicos: principal?.subServicos ?? null,
    outrosServicos: outros.length ? JSON.stringify(outros) : null,
  };
}
