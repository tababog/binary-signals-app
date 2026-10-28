# Tababog Obras — regras do projeto

App de gestão da **Tababog Construction LLC**, empresa de construção/reforma com sede em Bridgeport e atuação em
**todo o estado de Connecticut (EUA)**. Instagram: @tababog_construction.
Perfil da empresa, serviços e regras de CT: `docs/empresa.md`.
Sócios e administradores: **Alessandro** e **Emanuel**. Funcionários usam o app só para o ponto.
Conversa com o usuário em português; telas internas em português.

## Regras de negócio (valem para todo o código e toda análise)

1. **Moeda: dólar (USD).** Todos os valores, preços de referência e orçamentos em USD.
   Valores guardados em centavos (`Int`), formatados com `dinheiro()` em `src/lib/format.ts`.
2. **Meta de lucro: preço de venda = no mínimo 2x o custo.** Sempre buscar o dobro do que foi investido.
   Custo = material + delivery/frete + mão de obra (equipe própria e terceiros) + instalação + serviços/subempreiteiros
   + equipamentos/aluguel + licenças (permits)/inspeções + seguro da obra + descarte/caçamba + outros
   + a parte da obra nos custos fixos da empresa (rateio, etapa 10).
   Categorias definidas em `CATEGORIAS_DESPESA` (`src/lib/constantes.ts`); nenhum custo pode ficar de fora do preço.
   Toda tela, relatório ou orçamento deve mostrar o multiplicador (preço ÷ custo) e alertar quando ficar abaixo de 2x.
3. **Todo orçamento tem duas opções** para o cliente (por exemplo, Essencial e Premium), cada uma com itens,
   materiais, mão de obra, custo, preço e multiplicador.
4. **Banco de preços histórico.** Cada trabalho concluído (e cada trabalho antigo que o Alessandro informar) vira
   referência: tipo de serviço, cidade/região, quantidades (sq ft, unidades, ft lineares), custo de material,
   horas, preço cobrado e lucro real. Ao precificar, usar primeiro esse histórico, depois o mercado.
5. **Preço de mercado** vem de fontes de referência dos EUA: cost guides do Thumbtack, Angi/HomeAdvisor,
   HomeGuide, Homewyse e preços de material de Home Depot/Lowe's, sempre para a cidade/CEP da obra
   (atuação em todo Connecticut: usar a cidade/condado de cada obra, que muda bastante o preço entre
   Fairfield County e o resto do estado).
   Sempre citar as fontes e a data da consulta.
6. **Ponto com GPS.** Toda entrada e saída grava a localização. Sem GPS o ponto é bloqueado (o administrador pode
   lançar manualmente). A tela do funcionário mostra só um aviso curto de que a localização é registrada;
   mapas, distâncias e alertas aparecem só para administradores. Não remover esse aviso: alguns estados dos EUA
   exigem notificação de monitoramento eletrônico.
7. **Fluxo de caixa é por obra** (conta do cliente), separado do caixa geral da empresa.
8. **Idiomas.** O app tem português, inglês e espanhol; cada pessoa escolhe o seu. Textos escritos pelos usuários
   (descrições, observações, itens de orçamento) são traduzidos automaticamente para os outros dois idiomas, com
   tradução guardada para não repetir o custo, e opção de ver o original. Nomes e endereços não são traduzidos.
9. **Orçamento e proposta para o cliente saem sempre em inglês**, mesmo quando o Alessandro (português) ou o
   Emanuel (inglês) montam tudo na própria língua. Mensagens de follow-up abrem em inglês por padrão.
10. **Android e iPhone.** O app é web instalável na tela inicial (ícones PNG, tela cheia no iPhone); toda tela tem que
   funcionar bem no celular dos dois sistemas. A logo da Tababog (`public/logo.svg`, vetor) aparece no cabeçalho, no
   login e nos ícones (`icon-*.png`, `apple-touch-icon.png`, fundo azul `#1b3f7d`).

## Como trabalhar neste projeto

- O projeto é grande: cada módulo do roteiro abaixo é feito em um prompt/sessão separado.
- Antes de enviar: `npx tsc --noEmit`, `npm run i18n:verificar` (todo texto novo de tela em `t("...")` precisa estar em
  `src/i18n/en.ts` e `es.ts`), `npm run build` e um teste real no navegador (Playwright) do fluxo alterado.
- Stack: Next.js 14 (App Router, Server Actions), TypeScript, Prisma + Postgres (Supabase), fotos no Supabase Storage
  (`src/lib/uploads.ts`), Tailwind, hospedagem na Vercel. Permissões: `exigirAdmin()` /
  `exigirUsuario()` em `src/lib/auth.ts` em toda página e ação do servidor.

## Roteiro

- [x] 1. Base: obras, clientes, fornecedores, funcionários, orçamento x realizado, caixa por obra, recibos com foto, ponto.
- [x] 2. USD e ponto com GPS (raio da obra, alertas de ponto fora da obra).
- [x] 3. Hospedagem: no ar na Vercel (projeto `tababog-obras`, plano Hobby) com Supabase (`tababog-obras`,
       East US, bucket privado `comprovantes`, Data API desligada). Cada push na `main` publica sozinho.
- [~] 4. Visitas: agenda, lembrete na agenda do celular e follow-up semiautomático (WhatsApp/SMS/e-mail pelo celular,
       3/7/14 dias, resultado Fechou/Sem interesse), serviço + subserviços, "Outros" vira opção fixa
       (`ServicoPersonalizado`), fotos do trabalho (Supabase Storage). Falta: medidas do levantamento.
- [x] 5. Banco de preços histórico (regra 4) + cadastro de trabalhos antigos: página *Preços* (`/precos`), resumo por
       serviço + subserviço + unidade (`src/lib/precos.ts`) com preço/custo por unidade, faixa, multiplicador e preço
       mínimo para 2x, filtro Fairfield County x resto de CT; obra concluída vira referência com os números reais
       (`src/lib/referencia-obra.ts`). A etapa 6 deve consultar `resumirPorServico` antes do preço de mercado.
- [ ] 6. Skill de precificação: materiais, mão de obra, custo, preço de mercado e duas opções (regras 2, 3 e 5).
- [ ] 7. Portfólio da empresa: quem somos, Alessandro e Emanuel, anos de mercado, fotos de trabalhos por categoria
       (cabinets, drywall, etc.).
- [ ] 8. Proposta para o cliente (sempre em inglês, regra 9): apresentação profissional (portfólio da categoria +
       escopo item a item + duas opções + valores) enviada como **link** (WhatsApp/SMS/e-mail). Na página o cliente
       responde com botões: **aprovar a opção 1 ou 2** (nome, assinatura na tela, data e IP registrados), **recusar**
       ou **pedir para falar**. A resposta aparece no Painel e, se aprovada, marca a visita como "Fechou contrato"
       e encerra os follow-ups. Contrato seguindo o Home Improvement Act de CT (ver `docs/empresa.md`).
- [ ] 9. Relatório final da obra: lucro ou prejuízo, multiplicador atingido x meta 2x, onde o custo estourou.
- [x] 10. Custos fixos e diagnóstico (página *Empresa*): custos recorrentes + gastos avulsos, rateio por dia trabalhado
       (`src/lib/custos-fixos.ts`), custo fixo entra no custo de cada obra e no orçado (dias previstos × custo/dia),
       resultado do mês. A precificação (etapa 6) deve somar dias previstos × custo fixo por dia antes da meta 2x.
       Fluxo de caixa da empresa lido da planilha do Google Drive (`src/lib/planilha-fluxo.ts`, conta de serviço
       `GOOGLE_SERVICE_ACCOUNT_JSON`) e custos fixos pela média real da planilha.
- [x] 11. Idiomas (regra 8): telas em PT/EN/ES com seletor + tradução automática do conteúdo pela API da Anthropic
       (chave em `ANTHROPIC_API_KEY` na Vercel).
