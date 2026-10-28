# Tababog Obras

App para gestão das obras da construtora: clientes, fornecedores, funcionários, orçamento,
fluxo de caixa por obra (com foto dos recibos) e ponto eletrônico da equipe.

Funciona no navegador do computador e do celular, Android e iPhone (pode ser "instalado" na tela inicial e abre em
tela cheia, como um app).

## O que o app faz

**Administradores (acesso total — você e o Emmanuel)**
- **Painel**: obras em aberto, equipe trabalhando agora, visitas agendadas (com selos Hoje/Amanhã) e últimos lançamentos.
- **Visitas**: agenda de visitas aos clientes (cliente novo ou já cadastrado), com serviço e subserviços (ex.: Pintura →
  Interna → Teto, Trims), serviços novos criados em "Outros" que passam a aparecer na lista, o que o cliente quer,
  fotos do trabalho e endereço com sugestões enquanto digita; atalhos para o mapa e para ligar;
  **⏰ Lembrete** que coloca a visita na agenda do celular (Google Agenda ou arquivo de calendário com alarmes 1 dia e
  1 hora antes); marcar como realizada/cancelada e transformar em obra quando o cliente fecha.
  **Follow-up**: ao marcar a visita como realizada, o app agenda contatos em 3, 7 e 14 dias. No dia, o Painel mostra
  "Follow-ups de hoje"; a mensagem vem pronta (inglês, português ou espanhol, editável) e abre no WhatsApp, SMS ou
  e-mail do celular. Marcar "Fechou contrato" ou "Sem interesse" encerra os follow-ups.
- **Obras**: cada obra tem cliente (o endereço do cliente vem sozinho), valor do contrato, início e previsão de entrega (os dias de trabalho previstos são calculados de segunda a sexta) e quatro abas:
  - *Resumo* — contrato, recebido, a receber, custo até agora, saldo em caixa da obra, lucro previsto e lucro real.
  - *Fluxo de caixa* — entradas (pagamentos do cliente) e saídas (despesas) **só desta obra**, com link para a foto do recibo.
  - *Orçamento* — itens previstos por categoria (material, delivery, mão de obra, instalação, serviços, equipamentos,
    licenças/permits, descarte/caçamba, outros) e o
    comparativo **orçado x realizado**, mostrando se o orçamento foi bem feito.
  - *Equipe e horas* — horas e custo de cada funcionário nesta obra.
- **Lançar despesa**: tira a foto do recibo/nota pelo celular, informa valor, fornecedor e categoria, e o gasto
  entra direto no caixa da obra.
- **Pagamento do cliente**: registra o valor recebido, que entra no caixa da obra.
- **Clientes**, **Fornecedores** e **Subcontratados**: cadastro completo com total comprado/pago. Subcontratados têm
  especialidade, licença e validade do seguro (COI), com aviso quando vence em 30 dias ou já venceu.
- **Equipe**: funcionários fixos e **helpers** (temporários), pagos **por hora ou por diária**; o login é por e-mail
  ou telefone. Sem senha, o app gera um **link de convite** (botão "Enviar pelo WhatsApp"): a pessoa abre, cria a
  própria senha e já entra. O mesmo link serve para quem esqueceu a senha (vale 7 dias, uma vez só).
  Diaristas custam a diária inteira por dia trabalhado, dividida entre as obras do dia pelas horas de cada uma.
  Para tirar o acesso de quem saiu da empresa, basta desmarcar "Acesso ativo".
- **Horas**: todos os registros de ponto, com filtros, custo do período, correção de horários e lançamento
  manual para quem esqueceu de bater o ponto. Cada entrada e saída mostra **"✓ Na obra"** ou **"⚠ Fora"** com a
  distância até a obra e o link para o mapa. O Painel lista os pontos fora da obra dos últimos 7 dias.
  Para isso, cadastre a localização da obra (botão "Usar minha localização atual" estando no local) e o raio aceito.

- **Orçamentos**: cada orçamento (a partir da visita ou novo) tem **duas opções** (Essential e Premium) com itens
  de custo (material, mão de obra, delivery, permit, caçamba...), dias de trabalho × custo fixo por dia, preço sugerido
  de 2x o custo, preço final e multiplicador (alerta abaixo de 2x). Mostra o histórico do banco de preços e o mercado.
  Com a IA (chave `ANTHROPIC_API_KEY`): perguntas sobre o trabalho, pesquisa de mercado (Thumbtack, Angi/HomeAdvisor,
  HomeGuide, Homewyse, Home Depot/Lowe's) com fontes e data e sugestão das duas opções; e preço da lista de material
  na Home Depot e na Lowe's (digita o material e a quantidade; usa a loja mais barata).
- **Preços (banco de preços)**: trabalhos já feitos (antigos, cadastrados à mão, e obras concluídas, com os números
  reais do app) com serviço, cidade/condado, quantidade, material, mão de obra, dias, horas e preço cobrado. Mostra por
  serviço o preço e o custo por sq ft/ft linear, o multiplicador e o **preço mínimo para a meta 2x**, separando
  Fairfield County do resto de Connecticut. Obras concluídas que ainda não viraram referência aparecem como pendentes.
- **Empresa - Fluxo de caixa**: o fluxo de caixa da empresa lido da planilha do Google Drive, em cartões para o
  celular (mês a mês ou acumulado): entradas, custos das obras, custos fixos, retiradas dos sócios, resultado, saldo
  conferido com o extrato do banco e o multiplicador comparado com a meta 2x. Os **custos fixos** são a média mensal
  real da planilha: despesas fixas (galpão, gasolina, refeição, seguro, carro...) + retiradas dos sócios (pró-labore).
  Gastos avulsos (ferramentas) ficam como registro do recibo.
  Mostra o custo fixo por dia útil, **quanto custa um dia de obra**, o resultado de cada mês e quanto do custo fixo
  ficou sem obra para cobrir.

**Funcionários (acesso de usuário)**
- Só veem a tela **Meu ponto**: escolhem a obra e tocam em *Registrar ENTRADA* / *Registrar SAÍDA*.
  O horário é o do servidor (não dá para alterar) e o GPS do celular é lido a cada toque, na entrada e na saída.
  Sem localização o ponto não é registrado.
- Veem as próprias horas do dia e do mês e podem trocar a própria senha.

### Como o custo da obra é calculado

```
Custo da obra  = despesas lançadas (material, delivery, mão de obra terceirizada, instalação, serviços,
                 equipamentos, licenças/permits, descarte/caçamba, outros)
               + horas da equipe registradas no ponto × valor da hora de cada funcionário
               + custos fixos da empresa: em cada dia com ponto, o custo fixo do dia é dividido entre as obras
                 trabalhadas naquele dia (custo fixo do dia = custos fixos do mês ÷ dias úteis do mês)
Saldo em caixa = pagamentos recebidos do cliente − gastos lançados e horas da equipe (sem os custos fixos)
Lucro final    = valor do contrato − custo da obra
```

O valor da hora é gravado em cada registro de ponto, então um aumento de salário não muda o custo de obras antigas.

## Como rodar

Requer Node.js 20 ou superior.

```bash
npm install
cp .env.example .env      # banco Postgres, AUTH_SECRET, e-mails e senhas dos dois administradores
npm run setup             # cria as tabelas e os dois administradores
npm run dev               # abre em http://localhost:3000
```

Para colocar na internet (Vercel + Supabase, plano grátis), siga o passo a passo em
[`docs/hospedagem.md`](docs/hospedagem.md).

Depois de entrar pela primeira vez, cada administrador deve trocar a senha em **Minha conta**.

### Configurações (`.env`)

| Variável | Para quê |
| --- | --- |
| `DATABASE_URL`, `DIRECT_URL` | Banco Postgres (Supabase ou local). |
| `AUTH_SECRET` | Segredo das sessões de login. Use um valor longo e aleatório. |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Guardam as fotos dos recibos no Supabase Storage. Sem elas, as fotos ficam na pasta `UPLOAD_DIR`. |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Conta de serviço do Google para ler o fluxo de caixa no Drive (docs/hospedagem.md, Parte 4). |
| `ANTHROPIC_API_KEY` | Tradução automática dos textos escritos pelos usuários (português, inglês e espanhol). |
| `NEXT_PUBLIC_MOEDA` | Moeda das telas (padrão `USD`). |
| `NEXT_PUBLIC_FUSO` | Fuso horário do ponto (`America/New_York`, `America/Chicago`, `America/Denver`, `America/Los_Angeles`). |
| `ADMIN1_*`, `ADMIN2_*` | Nome, e-mail e senha inicial dos dois administradores. |

> A câmera e a localização do celular só funcionam quando o app está em **HTTPS** (ou em `localhost`).
> A Vercel já entrega o app em HTTPS.

## Tecnologia

Next.js 14 (App Router, Server Actions) · TypeScript · Prisma · Postgres · Supabase Storage · Tailwind CSS · Vercel.
