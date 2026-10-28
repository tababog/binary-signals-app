import { db } from "./db";
import { campoData, lerDataHora } from "./format";
import { PREFIXO_PERSONALIZADO, nomeTipoServico } from "./constantes";

/** Dias depois da visita realizada em que o app sugere falar com o cliente. */
export const PRAZOS_FOLLOWUP = [3, 7, 14];

export const CANAIS = { WHATSAPP: "WhatsApp", SMS: "SMS", EMAIL: "E-mail" } as const;

export const TELEFONE_EMPRESA = "(475) 298-5931";

/** Cria os follow-ups padrão a partir do dia da visita (às 10h, no fuso da empresa), se ainda não existirem. */
export async function agendarFollowUps(visitaId: string, base: Date) {
  if ((await db.followUp.count({ where: { visitaId } })) > 0) return;
  const dia = lerDataHora(`${campoData(base)}T10:00`)!;
  await db.followUp.createMany({
    data: PRAZOS_FOLLOWUP.map((dias, i) => ({
      visitaId,
      ordem: i + 1,
      dataPrevista: new Date(dia.getTime() + dias * 24 * 3600 * 1000),
    })),
  });
}

export type Idioma = "en" | "pt" | "es";

type Dados = { cliente: string; servico: string | null; remetente: string; ordem: number };

/** Mensagem sugerida para cada follow-up (1º agradece, 2º lembra da agenda, 3º encerra com educação). */
export function mensagemFollowUp(idioma: Idioma, d: Dados) {
  const nome = d.cliente.split(" ")[0];
  const quem = d.remetente.split(" ")[0];
  const n = Math.min(d.ordem, 3);
  const servico = d.servico ? nomeServico(idioma, d.servico) : null;

  if (idioma === "en") {
    const projeto = servico ? `your ${servico} project` : "your project";
    return [
      `Hi ${nome}, this is ${quem} from Tababog Construction. Thank you for having us over to look at ${projeto}. Do you have any questions about the estimate? We'd love to get started for you.`,
      `Hi ${nome}, just following up on ${projeto}. Our schedule for the next few weeks is filling up — let us know if you'd like to move forward and we'll save a spot for you.`,
      `Hi ${nome}, checking in one last time about ${projeto}. If now isn't the right time, no problem at all — just let us know either way. Thank you! ${quem}, Tababog Construction ${TELEFONE_EMPRESA}`,
    ][n - 1];
  }
  if (idioma === "es") {
    const projeto = servico ? `su proyecto de ${servico}` : "su proyecto";
    return [
      `Hola ${nome}, soy ${quem} de Tababog Construction. Gracias por recibirnos para ver ${projeto}. ¿Tiene alguna pregunta sobre el presupuesto? Nos encantaría empezar.`,
      `Hola ${nome}, le escribo para dar seguimiento a ${projeto}. Nuestra agenda de las próximas semanas se está llenando; avísenos si desea seguir adelante y le reservamos un lugar.`,
      `Hola ${nome}, le escribo una última vez sobre ${projeto}. Si ahora no es el momento, no hay problema; solo avísenos. ¡Gracias! ${quem}, Tababog Construction ${TELEFONE_EMPRESA}`,
    ][n - 1];
  }
  const projeto = servico ? `o seu projeto de ${servico}` : "o seu projeto";
  return [
    `Olá ${nome}, aqui é o ${quem} da Tababog Construction. Obrigado por nos receber para ver ${projeto}. Ficou alguma dúvida sobre o orçamento? Teremos prazer em começar.`,
    `Olá ${nome}, passando para saber sobre ${projeto}. Nossa agenda das próximas semanas está enchendo; se quiser seguir, reservamos uma data para você.`,
    `Olá ${nome}, um último contato sobre ${projeto}. Se agora não for o momento, sem problema; só nos avise. Obrigado! ${quem}, Tababog Construction ${TELEFONE_EMPRESA}`,
  ][n - 1];
}

export function assuntoFollowUp(idioma: Idioma) {
  return { en: "Your project with Tababog Construction", es: "Su proyecto con Tababog Construction", pt: "Seu projeto com a Tababog Construction" }[idioma];
}

const SERVICOS: Record<string, { en: string; es: string }> = {
  DECK: { en: "deck", es: "deck" },
  GABINETE: { en: "custom cabinets", es: "gabinetes a medida" },
  DRYWALL: { en: "drywall", es: "drywall" },
  PINTURA: { en: "painting", es: "pintura" },
  ISOLAMENTO: { en: "insulation", es: "aislamiento" },
  CARPINTARIA: { en: "finish carpentry", es: "carpintería de acabado" },
};

function nomeServico(idioma: Idioma, tipo: string): string | null {
  if (tipo === "OUTRO") return null;
  // Serviço digitado em "Outros": usa o nome como foi escrito
  if (tipo.startsWith(PREFIXO_PERSONALIZADO)) return nomeTipoServico(tipo);
  if (tipo === "ISOLAMENTO" && idioma === "pt") return "isolamento acústico";
  if (tipo === "CARPINTARIA" && idioma === "pt") return "carpintaria de acabamento";
  if (idioma === "pt") return nomeTipoServico(tipo).toLowerCase();
  return SERVICOS[tipo]?.[idioma] ?? tipo.toLowerCase();
}

/** Telefone no formato internacional dos EUA (+1) para links de WhatsApp e SMS. */
export function telefoneInternacional(telefone: string | null) {
  const d = (telefone ?? "").replace(/\D/g, "");
  if (d.length === 10) return `1${d}`;
  return d;
}
