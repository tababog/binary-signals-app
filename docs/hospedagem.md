# Colocar o Tababog Obras na internet (grátis)

Serviços usados:
- **Supabase**: guarda o banco de dados e as fotos dos recibos.
- **Vercel**: roda o app e entrega o endereço `https://...` (com HTTPS, necessário para a câmera e o GPS).

Tempo estimado: 30 minutos. Use o computador, não o celular.

> **Planos grátis.** O Supabase grátis pausa o projeto depois de cerca de 1 semana sem uso (é só entrar no
> painel e clicar em *Restore*). O plano grátis da Vercel (*Hobby*) é para uso pessoal/não comercial: serve para o
> período de teste; para usar no dia a dia da empresa, passe para o plano *Pro* (cerca de $20/mês).

---

## Parte 1 — Supabase (banco de dados e fotos)

1. Acesse **https://supabase.com** → **Start your project** → **Continue with GitHub**.
2. Clique em **New project**:
   - **Name:** `tababog-obras`
   - **Database Password:** crie uma senha **só com letras e números** (sem símbolos) e **guarde-a**.
   - **Region:** `East US (North Virginia)` (a mais perto de Connecticut).
   - Plano **Free** → **Create new project**. Aguarde uns 2 minutos.
3. **Bucket para as fotos:** menu lateral **Storage** → **New bucket**
   - **Name:** `comprovantes`
   - **Public bucket:** deixe **desligado** (os recibos são privados).
   - Ao criar o projeto, deixe **Enable Data API** desmarcado: o app não usa essa API e assim as tabelas não ficam
     expostas. Se o painel sugerir "Enable Data API", ignore.
   - **Create**.
4. **Endereços do banco:** clique no botão **Connect** (no topo da página do projeto) → quadro **ORM** → **Prisma**.
   Aparecem as linhas `DATABASE_URL` e `DIRECT_URL` prontas; copie as duas trocando `[YOUR-PASSWORD]` pela senha do
   passo 2. Se não houver a opção Prisma, use o quadro **Direct** e copie:
   - **Transaction pooler** (termina em `:6543/postgres`): acrescente `?pgbouncer=true` no final.
     Este será o `DATABASE_URL`.
   - **Session pooler** (termina em `:5432/postgres`). Este será o `DIRECT_URL`.
5. **Chaves:**
   - O **Project URL** aparece na página inicial do projeto (algo como `https://abcd1234.supabase.co`).
     Este será o `SUPABASE_URL`.
   - Menu **Project Settings** (engrenagem) → **API Keys**. Na aba **Legacy API Keys**, clique em **Reveal** na chave
     **service_role** (começa com `eyJ`); se essa aba não existir, copie a **Secret key** (começa com `sb_secret_`).
     Este será o `SUPABASE_SERVICE_ROLE_KEY`.
     **Essa chave dá acesso total ao banco: não mande para ninguém e não publique.**

---

## Parte 2 — Deixar o código na branch principal

A Vercel publica a branch principal do GitHub (`main`). O app está hoje na branch `ccr-15f09b39-gtigo7`.
Peça ao Claude para abrir o *pull request* e faça o *merge* no GitHub, **ou** na Vercel, depois da Parte 3,
mude em **Settings → Git → Production Branch** para `ccr-15f09b39-gtigo7`.

---

## Parte 3 — Vercel (o app no ar)

1. Acesse **https://vercel.com/signup** → plano **Hobby** → **Continue with GitHub**.
2. **Add New… → Project** → em *Import Git Repository*, escolha **`binary-signals-app`**.
   Se ele não aparecer, clique em **Adjust GitHub App Permissions** e libere o repositório.
3. Antes de clicar em *Deploy*, abra **Environment Variables** e cadastre (nome → valor):

   | Nome | Valor |
   | --- | --- |
   | `DATABASE_URL` | Transaction pooler + `?pgbouncer=true` (Parte 1, passo 4) |
   | `DIRECT_URL` | Session pooler (Parte 1, passo 4) |
   | `SUPABASE_URL` | Project URL (Parte 1, passo 5) |
   | `SUPABASE_SERVICE_ROLE_KEY` | chave service_role (Parte 1, passo 5) |
   | `SUPABASE_BUCKET` | `comprovantes` |
   | `AUTH_SECRET` | um texto aleatório longo — gere em https://generate-secret.vercel.app/32 |
   | `ADMIN1_NOME` | `Alessandro de Oliveira` |
   | `ADMIN1_EMAIL` | seu e-mail |
   | `ADMIN1_SENHA` | uma senha inicial (troque depois no app) |
   | `ADMIN2_NOME` | `Emmanuel Lopez` |
   | `ADMIN2_EMAIL` | e-mail do Emmanuel |
   | `ADMIN2_SENHA` | uma senha inicial para ele |

4. Clique em **Deploy**. A primeira publicação cria as tabelas e os dois administradores (3 a 5 minutos).
5. Quando aparecer **Congratulations**, clique no endereço (algo como `https://binary-signals-app.vercel.app`).
6. Entre com o seu e-mail e senha, vá em **Minha conta** e troque a senha. Peça ao Emmanuel o mesmo.

### Depois de publicado

- **Celular:** abra o endereço no Safari/Chrome → *Compartilhar → Adicionar à Tela de Início*. Fica como um app.
- **Funcionários:** em **Funcionários → Novo**, cadastre Bruno e Emerson com valor da hora `25.00`
  (diária de $200 ÷ 8 h). Passe para cada um o endereço, o e-mail e a senha.
- **Obras:** em cada obra, estando no local, use **Editar → Usar minha localização atual** para o GPS do ponto.
- **Atualizações:** cada mudança enviada para a branch principal é publicada sozinha pela Vercel.
  Os *previews* dos pull requests usam as mesmas variáveis, mas **não alteram o banco**: só a publicação
  oficial (branch principal) atualiza as tabelas e cria os administradores.

### Se algo der errado

- **Erro no deploy citando `DATABASE_URL`/`P1001`:** confira a senha dentro dos dois endereços e o
  `?pgbouncer=true` no `DATABASE_URL`.
- **Foto do recibo não salva:** confira `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` e se o bucket se chama
  `comprovantes`. Erro "Invalid Compact JWS" ou "400" ao guardar: troque `SUPABASE_SERVICE_ROLE_KEY` pela chave
  **service_role** da aba **Legacy API Keys** (começa com `eyJ`) e faça o Redeploy.
- **Não consigo entrar:** os administradores são criados com os e-mails das variáveis `ADMIN1_EMAIL`/`ADMIN2_EMAIL`.
- Mande o print do erro para o Claude.

---

## Parte 4 — Ligar o fluxo de caixa ao Google Drive

A página **Empresa** mostra o fluxo de caixa lido da planilha *"... Fluxo de Caixa ... - resumo"* que fica na pasta
**Tababog Construction** do Drive. O app lê sempre a planilha de fluxo de caixa mais recente dessa pasta (a de
lançamentos não é usada). Para isso o app precisa de uma "conta de serviço" do Google, que só tem permissão de
**leitura** na pasta. Grátis; não precisa de cartão.

1. Acesse **https://console.cloud.google.com** com a conta Google dona da pasta (a que tem as planilhas).
2. No topo, **Select a project → New project** → nome `tababog-obras` → **Create**. Deixe o projeto selecionado.
3. Menu ☰ → **APIs & Services → Library** → procure **Google Drive API** → **Enable**.
4. Menu ☰ → **IAM & Admin → Service Accounts → Create service account**
   - **Name:** `tababog-app` → **Create and continue** → pule os passos opcionais → **Done**.
5. Clique na conta criada → aba **Keys → Add key → Create new key → JSON → Create**. Um arquivo `.json` é baixado.
   **Esse arquivo é uma senha: não mande para ninguém.**
6. Copie o e-mail da conta de serviço (algo como `tababog-app@tababog-obras.iam.gserviceaccount.com`).
7. No Google Drive, clique com o botão direito na pasta **Tababog Construction → Compartilhar** → cole esse e-mail →
   permissão **Leitor** → desmarque "Notificar" → **Compartilhar**.
8. Na Vercel: projeto **tababog-obras → Settings → Environment Variables → Add**
   - **Key:** `GOOGLE_SERVICE_ACCOUNT_JSON`
   - **Value:** abra o arquivo `.json` no Bloco de Notas, copie **todo** o conteúdo e cole.
   - **Save** e depois **Deployments → ⋯ → Redeploy**.
9. Abra **Empresa** no app: o fluxo de caixa aparece. Os números são relidos do Drive a cada 5 minutos.

Para atualizar o fluxo de caixa, basta atualizar a planilha no Drive (ou colocar a planilha nova na mesma pasta,
com "Fluxo de Caixa" no nome). A planilha precisa manter o formato: coluna **Item**, uma coluna por mês e uma de
total; blocos **ENTRADAS** e **SAÍDAS**; linhas **TOTAL DE ENTRADAS**, **TOTAL DE SAÍDAS**, **Resultado do mês**,
**Saldo final do caixa** e, se quiser a conferência, **Saldo no extrato**.

### Custos fixos vêm da planilha

Com a planilha ligada, os **custos fixos da empresa são a média mensal real da planilha**: todas as despesas fixas
(galpão, gasolina, refeição, seguro, carro, banco, contador...) **mais as retiradas dos sócios** (Retirada Alessandro,
Retirada Emmanuel), que são o pró-labore. Não há mais cadastro manual de custos fixos: para mudar um valor, atualize a
planilha. O app guarda uma cópia da última média, usada se o Drive estiver fora do ar.
O app separa as saídas da planilha assim:
- **Custos diretos das obras:** Supplier/Fornecedor, Sub Contractors, Helpers, Dumpster/Lixo (já entram em cada obra).
- **Pró-labore:** linhas com "Retirada" ou "Pró-labore".
- **Despesas fixas:** todo o resto.

Os gastos avulsos lançados no app (ferramentas etc.) ficam só como registro do recibo: o valor já está na planilha.

## Parte 5 — Lembretes das visitas na Google Agenda dos sócios

Cada visita agendada vira um evento na Google Agenda do Alessandro e do Emmanuel, com aviso **1 dia antes** e
**2 horas antes**, dizendo quem vai fazer a visita. Usa a mesma conta de serviço da Parte 4.

1. Ligue a Google Calendar API no projeto `tababog-obras`:
   https://console.cloud.google.com/apis/library/calendar-json.googleapis.com?project=tababog-obras → **Ativar**.
2. Cada sócio, no computador, abre https://calendar.google.com → ⚙️ **Configurações** → na esquerda, a agenda com o
   próprio nome → **Compartilhar com pessoas específicas** → **Adicionar pessoas** →
   `tababog-app@tababog-obras.iam.gserviceaccount.com` com a permissão **Fazer alterações nos eventos** → Enviar.
3. O e-mail de login de cada sócio no app tem que ser o e-mail dessa Google Agenda (Funcionários → editar).
4. Abra uma visita e toque em **Salvar alterações**: no quadro "Lembrete no celular" aparece
   "Alessandro: lembretes criados ✓ · Emmanuel: lembretes criados ✓". Se aparecer "agenda não compartilhada",
   falta o passo 2 (ou o passo 3) daquela pessoa.

Visita cancelada, realizada ou excluída sai da agenda sozinha.
