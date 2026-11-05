import type { NomeIcone } from "@/components/Icone";

/** Atalhos do app: as ações rápidas do botão "+" e do Painel, e as áreas do Painel. */
export type Atalho = { href: string; rotulo: string; icone: NomeIcone };

export function acoesRapidas(t: (s: string) => string): Atalho[] {
  return [
    { href: "/lancar/despesa", rotulo: t("Lançar despesa"), icone: "despesa" },
    { href: "/lancar/recebimento", rotulo: t("Receber pagamento"), icone: "recebimento" },
    { href: "/visitas/nova", rotulo: t("Agendar visita"), icone: "visita" },
    { href: "/orcamentos/novo", rotulo: t("Novo orçamento"), icone: "orcamento" },
    { href: "/obras/nova", rotulo: t("Nova obra"), icone: "obra" },
    { href: "/registros#lancar", rotulo: t("Lançar ponto"), icone: "ponto" },
  ];
}

export function areas(t: (s: string) => string): Atalho[] {
  return [
    { href: "/obras", rotulo: t("Obras"), icone: "obra" },
    { href: "/visitas", rotulo: t("Visitas"), icone: "calendario" },
    { href: "/orcamentos", rotulo: t("Orçamentos"), icone: "lista" },
    { href: "/clientes", rotulo: t("Clientes"), icone: "clientes" },
    { href: "/fornecedores", rotulo: t("Fornecedores"), icone: "fornecedores" },
    { href: "/subcontratados", rotulo: t("Subcontratados"), icone: "sub" },
    { href: "/funcionarios", rotulo: t("Equipe"), icone: "equipe" },
    { href: "/registros", rotulo: t("Horas"), icone: "horas" },
    { href: "/precos", rotulo: t("Preços"), icone: "precos" },
    { href: "/empresa", rotulo: t("Empresa"), icone: "empresa" },
    { href: "/ponto", rotulo: t("Meu ponto"), icone: "meuponto" },
  ];
}
