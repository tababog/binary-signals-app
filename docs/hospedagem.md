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
   - **Create**.
4. **Endereços do banco:** clique no botão **Connect** (no topo da página do projeto) → aba **Connection String**.
   Copie dois endereços para um bloco de notas, trocando `[YOUR-PASSWORD]` pela senha do passo 2:
   - **Transaction pooler** (termina em `:6543/postgres`): acrescente `?pgbouncer=true` no final.
     Este será o `DATABASE_URL`.
   - **Session pooler** (termina em `:5432/postgres`). Este será o `DIRECT_URL`.
5. **Chaves:** menu **Project Settings** (engrenagem) → **API Keys** → aba **Legacy API Keys**:
   - Copie o **Project URL** (algo como `https://abcd1234.supabase.co`, aparece em *Project Settings → Data API*).
     Este será o `SUPABASE_URL`.
   - Clique em **Reveal** na chave **service_role** e copie. Este será o `SUPABASE_SERVICE_ROLE_KEY`.
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
   | `ADMIN2_NOME` | `Emanuel Lopez` |
   | `ADMIN2_EMAIL` | e-mail do Emanuel |
   | `ADMIN2_SENHA` | uma senha inicial para ele |

4. Clique em **Deploy**. A primeira publicação cria as tabelas e os dois administradores (3 a 5 minutos).
5. Quando aparecer **Congratulations**, clique no endereço (algo como `https://binary-signals-app.vercel.app`).
6. Entre com o seu e-mail e senha, vá em **Minha conta** e troque a senha. Peça ao Emanuel o mesmo.

### Depois de publicado

- **Celular:** abra o endereço no Safari/Chrome → *Compartilhar → Adicionar à Tela de Início*. Fica como um app.
- **Funcionários:** em **Funcionários → Novo**, cadastre Bruno e Emerson com valor da hora `25.00`
  (diária de $200 ÷ 8 h). Passe para cada um o endereço, o e-mail e a senha.
- **Obras:** em cada obra, estando no local, use **Editar → Usar minha localização atual** para o GPS do ponto.
- **Atualizações:** cada mudança enviada para a branch principal é publicada sozinha pela Vercel.

### Se algo der errado

- **Erro no deploy citando `DATABASE_URL`/`P1001`:** confira a senha dentro dos dois endereços e o
  `?pgbouncer=true` no `DATABASE_URL`.
- **Foto do recibo não salva:** confira `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` e se o bucket se chama
  `comprovantes`.
- **Não consigo entrar:** os administradores são criados com os e-mails das variáveis `ADMIN1_EMAIL`/`ADMIN2_EMAIL`.
- Mande o print do erro para o Claude.
