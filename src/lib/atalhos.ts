/** Atalhos do app: as ações rápidas do botão "+" e do Painel, e as áreas do Painel. */
export type Atalho = { href: string; rotulo: string; icone: string };

export function acoesRapidas(t: (s: string) => string): Atalho[] {
  return [
    { href: "/lancar/despesa", rotulo: t("Lançar despesa"), icone: "🧾" },
    { href: "/lancar/recebimento", rotulo: t("Receber pagamento"), icone: "💵" },
    { href: "/visitas/nova", rotulo: t("Agendar visita"), icone: "📅" },
    { href: "/orcamentos/novo", rotulo: t("Novo orçamento"), icone: "📝" },
    { href: "/obras/nova", rotulo: t("Nova obra"), icone: "🏗️" },
    { href: "/registros#lancar", rotulo: t("Lançar ponto"), icone: "⏱️" },
  ];
}

export function areas(t: (s: string) => string): Atalho[] {
  return [
    { href: "/obras", rotulo: t("Obras"), icone: "🏗️" },
    { href: "/visitas", rotulo: t("Visitas"), icone: "📅" },
    { href: "/orcamentos", rotulo: t("Orçamentos"), icone: "📝" },
    { href: "/clientes", rotulo: t("Clientes"), icone: "👥" },
    { href: "/fornecedores", rotulo: t("Fornecedores"), icone: "🏪" },
    { href: "/subcontratados", rotulo: t("Subcontratados"), icone: "🔧" },
    { href: "/funcionarios", rotulo: t("Equipe"), icone: "👷" },
    { href: "/registros", rotulo: t("Horas"), icone: "⏱️" },
    { href: "/precos", rotulo: t("Preços"), icone: "💲" },
    { href: "/empresa", rotulo: t("Empresa"), icone: "🏢" },
    { href: "/ponto", rotulo: t("Meu ponto"), icone: "📍" },
  ];
}
