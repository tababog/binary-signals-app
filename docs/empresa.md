# Perfil da Tababog Construction LLC

Base para o portfólio (etapa 7), as propostas (etapa 8) e a precificação (etapa 6).
Levantado em 27/10/2026 a partir de perfis públicos. Itens marcados **[confirmar]** precisam da validação do Alessandro.

## Dados da empresa

| Item | Informação | Fonte |
| --- | --- | --- |
| Razão social | Tababog Construction LLC | Thumbtack, Angi, HomeAdvisor, Porch, BuildZoom |
| Sede | Bridgeport, Connecticut (CT) — fuso America/New_York | Thumbtack, Angi |
| Área de atuação | Todo o estado de Connecticut | Alessandro |
| Sócios | Alessandro de Oliveira e Emanuel Lopez | Alessandro |
| Fundação | 2017 | Alessandro |
| Telefone | (475) 298-5931 | Alessandro |
| Licença | Connecticut Home Improvement Contractor **HIC.0655127** **[confirmar validade]** | Alessandro / BuildZoom |
| Avaliação | 4.7 estrelas, cerca de 60 avaliações (Thumbtack 62, Porch 58) | Thumbtack, Porch |
| Orçamento | Gratuito | Angi |
| Site | tababog.com — **domínio não está no ar** em 27/10/2026 **[confirmar]** | — |
| Instagram | [@tababog_construction](https://www.instagram.com/tababog_construction/) | Alessandro |
| Fotos | Cerca de 104 fotos de projetos no Thumbtack | Thumbtack |

## Sócios (textos para o portfólio e as propostas)

Rascunho para o Alessandro revisar. As propostas para clientes saem em inglês.

**Alessandro de Oliveira — Co-Founder & Project Manager**
- EN: Alessandro co-founded Tababog Construction in 2017 and personally oversees every project, from the first
  site visit and estimate to the final walkthrough, making sure each job is delivered on time, on budget and
  exactly as promised.
- PT: Cofundador da Tababog em 2017, acompanha cada projeto da primeira visita e do orçamento até a entrega final,
  garantindo prazo, orçamento e qualidade.

**Emanuel Lopez — Co-Founder & Lead Craftsman**
- EN: Emanuel co-founded Tababog Construction in 2017 and leads the crew in the field. His attention to detail is
  behind the custom cabinets and decks our clients are proudest of.
- PT: Cofundador da Tababog em 2017, lidera a equipe em campo; o cuidado com os detalhes dele está nos gabinetes
  customizados e decks que os clientes mais elogiam.

**[confirmar]** os cargos acima (quem faz orçamento/atendimento e quem lidera a obra).

## Serviços principais (mais feitos e mais lucrativos)

1. **Decks** (construção e reforma)
2. **Gabinetes customizados** (custom cabinets)

Prioridade para o portfólio (etapa 7), a precificação (etapa 6) e o banco de preços (etapa 5): começar por estes dois.

## Outros serviços citados nos perfis

- Drywall: instalação (residencial e comercial), reparo, acabamento e textura
- Pintura
- Isolamento acústico (soundproofing) e isolamento de sótão (attic insulation)
- Impermeabilização (waterproofing)
- Papel de parede
- Gabinetes (cabinet design / custom cabinets)
- Decks
- **[confirmar]** lista completa e quais serviços dão mais lucro

## O que os clientes elogiam (para usar nas propostas)

- Qualidade do trabalho ("very talented")
- Pontualidade ("comes in time")
- Profissionalismo e resposta rápida

## Custos fixos da empresa (overhead) — base da etapa 10

Custos que existem com ou sem obra. Não entram no caixa de uma obra específica: são somados por mês e
**divididos entre as obras** (rateio), para que o preço de venda cubra também esses gastos.

| Custo fixo | Valor | Situação |
| --- | --- | --- |
| Pró-labore Alessandro | $1,000/semana | Informado |
| Pró-labore Emanuel | $1,000/semana | Informado |
| Aluguel do galpão | $1,100/mês | Informado |
| Água | — | Não tem |
| Energia elétrica | $120/mês (média) | Informado |
| Seguro dos carros | — | Pago no pessoal |
| General liability | $250/mês | Informado |
| Combustível | $300/semana | Informado |
| Ferramentas (compra e reposição) | Esporádico | Lançar em *Empresa → Gastos avulsos* |
| Telefone, internet e contador | — | Pago no pessoal |
| Manutenção e parcelas dos carros | — | Não tem |
| Taxa de leads (Thumbtack/Angi) | — | Não tem |
| Workers' compensation | — | **Não tem — ver alerta abaixo** |

**Total: cerca de $11,437 por mês, ou $528 por dia útil** (pró-labore $8,667 + combustível $1,300 + galpão $1,100 +
liability $250 + energia $120). Com as diárias do Bruno e do Emerson ($400), **um dia de obra custa cerca de $928
antes do material**; pela meta 2x, cada dia de obra precisa faturar cerca de $1,856 + 2x o material.
Esses valores estão cadastrados no app (página *Empresa*) e são criados pelo `prisma/seed.ts` no primeiro deploy.

> **Alerta — workers' compensation:** em Connecticut o seguro é obrigatório para quem tem 1 ou mais funcionários,
> inclusive meio período ou por diária. Sem ele, a empresa paga sozinha qualquer acidente de trabalho e fica sujeita a
> multa e ordem de parada da obra. Conversar com o corretor de seguros e o contador; quando contratar, entra como
> custo fixo (ou por obra, se o corretor calcular sobre a folha).

## Equipe

| Nome | Função | Pagamento | Valor/hora no app |
| --- | --- | --- | --- |
| Bruno | Funcionário | $200 por diária | $25/h (diária de 8 h) **[confirmar horas da diária]** |
| Emerson | Funcionário | $200 por diária | $25/h (diária de 8 h) **[confirmar horas da diária]** |

**Gasto de obra x custo fixo:** combustível e ferramentas são custo fixo por padrão. Quando forem comprados só para
uma obra (ex.: uma ferramenta específica, aluguel de equipamento), lançar como despesa daquela obra
(categoria *Equipamentos / aluguel*). Seguro feito só para uma obra vai em *Seguro específico da obra*.

## Regras de Connecticut que afetam o app

- **Contrato de home improvement:** a lei de CT (Home Improvement Act) exige contrato escrito e assinado pelas duas
  partes, com número de registro HIC, datas de início e término, e aviso do direito de cancelamento em 3 dias úteis.
  A proposta/contrato da etapa 8 precisa seguir isso. **Revisar o modelo com um advogado de CT.**
- **Monitoramento eletrônico:** CT exige aviso prévio por escrito aos funcionários sobre monitoramento eletrônico
  (inclui GPS). Confirma a regra 6 do `CLAUDE.md`: manter o aviso na tela e ter um termo assinado por cada funcionário.

## Fontes

- Thumbtack: https://www.thumbtack.com/ct/bridgeport/drywall-repair/tababog-construction-llc/service/301699708865478909
- Angi: https://www.angi.com/companylist/us/ct/bridgeport/tababog-construction-llc-reviews-1.htm
- HomeAdvisor: https://www.homeadvisor.com/rated.TababogConstructionLLC.61448582.html
- Porch: https://pro.porch.com/bridgeport-ct/drywall-contractors/tababog-construction-llc/pp
- BuildZoom: https://www.buildzoom.com/contractor/tababog-construction-llc
- Instagram: https://www.instagram.com/tababog_construction/
