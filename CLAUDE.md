# Tababog Obras — regras do projeto

App de gestão da **Tababog Construction LLC**, empresa de construção/reforma em **Bridgeport, Connecticut (EUA)**.
Perfil da empresa, serviços e regras de CT: `docs/empresa.md`.
Sócios e administradores: **Alessandro** e **Emanuel**. Funcionários usam o app só para o ponto.
Conversa com o usuário em português; telas internas em português.

## Regras de negócio (valem para todo o código e toda análise)

1. **Moeda: dólar (USD).** Todos os valores, preços de referência e orçamentos em USD.
   Valores guardados em centavos (`Int`), formatados com `dinheiro()` em `src/lib/format.ts`.
2. **Meta de lucro: preço de venda = no mínimo 2x o custo.** Sempre buscar o dobro do que foi investido.
   Custo = material + delivery/frete + mão de obra (equipe própria e terceiros) + instalação + serviços/subempreiteiros
   + equipamentos/aluguel + licenças (permits)/inspeções + descarte/caçamba + outros.
   Categorias definidas em `CATEGORIAS_DESPESA` (`src/lib/constantes.ts`); nenhum custo pode ficar de fora do preço.
   Toda tela, relatório ou orçamento deve mostrar o multiplicador (preço ÷ custo) e alertar quando ficar abaixo de 2x.
3. **Todo orçamento tem duas opções** para o cliente (por exemplo, Essencial e Premium), cada uma com itens,
   materiais, mão de obra, custo, preço e multiplicador.
4. **Banco de preços histórico.** Cada trabalho concluído (e cada trabalho antigo que o Alessandro informar) vira
   referência: tipo de serviço, cidade/região, quantidades (sq ft, unidades, ft lineares), custo de material,
   horas, preço cobrado e lucro real. Ao precificar, usar primeiro esse histórico, depois o mercado.
5. **Preço de mercado** vem de fontes de referência dos EUA: cost guides do Thumbtack, Angi/HomeAdvisor,
   HomeGuide, Homewyse e preços de material de Home Depot/Lowe's, sempre para a cidade/CEP da obra
   (padrão: região de Bridgeport / Fairfield County, CT).
   Sempre citar as fontes e a data da consulta.
6. **Ponto com GPS.** Toda entrada e saída grava a localização. Sem GPS o ponto é bloqueado (o administrador pode
   lançar manualmente). A tela do funcionário mostra só um aviso curto de que a localização é registrada;
   mapas, distâncias e alertas aparecem só para administradores. Não remover esse aviso: alguns estados dos EUA
   exigem notificação de monitoramento eletrônico.
7. **Fluxo de caixa é por obra** (conta do cliente), separado do caixa geral da empresa.

## Como trabalhar neste projeto

- O projeto é grande: cada módulo do roteiro abaixo é feito em um prompt/sessão separado.
- Antes de enviar: `npx tsc --noEmit`, `npm run build` e um teste real no navegador (Playwright) do fluxo alterado.
- Stack: Next.js 14 (App Router, Server Actions), TypeScript, Prisma, Tailwind. Permissões: `exigirAdmin()` /
  `exigirUsuario()` em `src/lib/auth.ts` em toda página e ação do servidor.

## Roteiro

- [x] 1. Base: obras, clientes, fornecedores, funcionários, orçamento x realizado, caixa por obra, recibos com foto, ponto.
- [x] 2. USD e ponto com GPS (raio da obra, alertas de ponto fora da obra).
- [ ] 3. Hospedagem gratuita para teste: Postgres e fotos em nuvem (o disco de servidores gratuitos é apagado).
- [ ] 4. Visita técnica / levantamento: fotos, medidas e anotações no cliente antes de virar obra.
- [ ] 5. Banco de preços histórico (regra 4) + cadastro de trabalhos antigos.
- [ ] 6. Skill de precificação: materiais, mão de obra, custo, preço de mercado e duas opções (regras 2, 3 e 5).
- [ ] 7. Portfólio da empresa: quem somos, Alessandro e Emanuel, anos de mercado, fotos de trabalhos por categoria
       (cabinets, drywall, etc.).
- [ ] 8. Proposta para o cliente: apresentação profissional (portfólio da categoria + escopo item a item +
       duas opções + valores) com aceite e assinatura do contrato online.
- [ ] 9. Relatório final da obra: lucro ou prejuízo, multiplicador atingido x meta 2x, onde o custo estourou.
- [ ] 10. Diagnóstico de lucro da empresa: custos fixos (seguro, veículo, ferramentas, contador...) rateados nas obras.
