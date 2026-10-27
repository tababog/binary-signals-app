# Tababog Obras

App para gestão das obras da construtora: clientes, fornecedores, funcionários, orçamento,
fluxo de caixa por obra (com foto dos recibos) e ponto eletrônico da equipe.

Funciona no navegador do computador e do celular (pode ser "instalado" na tela inicial do celular).

## O que o app faz

**Administradores (acesso total — você e o Emanuel)**
- **Painel**: todas as obras em aberto, quanto já foi recebido, custo, saldo e quem está trabalhando agora.
- **Obras**: cada obra tem cliente, valor do contrato, datas, andamento (%) e quatro abas:
  - *Resumo* — contrato, recebido, a receber, custo até agora, saldo em caixa da obra, lucro previsto e lucro real.
  - *Fluxo de caixa* — entradas (pagamentos do cliente) e saídas (despesas) **só desta obra**, com link para a foto do recibo.
  - *Orçamento* — itens previstos por categoria (material, delivery, mão de obra, instalação, serviços, equipamentos,
    licenças/permits, descarte/caçamba, outros) e o
    comparativo **orçado x realizado**, mostrando se o orçamento foi bem feito.
  - *Equipe e horas* — horas e custo de cada funcionário nesta obra.
- **Lançar despesa**: tira a foto do recibo/nota pelo celular, informa valor, fornecedor e categoria, e o gasto
  entra direto no caixa da obra.
- **Pagamento do cliente**: registra o valor recebido, que entra no caixa da obra.
- **Clientes** e **Fornecedores**: cadastro completo; o fornecedor mostra o total já comprado dele.
- **Funcionários**: cria o login (e-mail + senha) de cada funcionário, define o valor da hora e o tipo de acesso.
  Para tirar o acesso de quem saiu da empresa, basta desmarcar "Acesso ativo".
- **Horas**: todos os registros de ponto, com filtros, custo do período, correção de horários e lançamento
  manual para quem esqueceu de bater o ponto. Cada entrada e saída mostra **"✓ Na obra"** ou **"⚠ Fora"** com a
  distância até a obra e o link para o mapa. O Painel lista os pontos fora da obra dos últimos 7 dias.
  Para isso, cadastre a localização da obra (botão "Usar minha localização atual" estando no local) e o raio aceito.

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
Saldo em caixa = pagamentos recebidos do cliente − custo da obra
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
| `NEXT_PUBLIC_MOEDA` | Moeda das telas (padrão `USD`). |
| `NEXT_PUBLIC_FUSO` | Fuso horário do ponto (`America/New_York`, `America/Chicago`, `America/Denver`, `America/Los_Angeles`). |
| `ADMIN1_*`, `ADMIN2_*` | Nome, e-mail e senha inicial dos dois administradores. |

> A câmera e a localização do celular só funcionam quando o app está em **HTTPS** (ou em `localhost`).
> A Vercel já entrega o app em HTTPS.

## Tecnologia

Next.js 14 (App Router, Server Actions) · TypeScript · Prisma · Postgres · Supabase Storage · Tailwind CSS · Vercel.
