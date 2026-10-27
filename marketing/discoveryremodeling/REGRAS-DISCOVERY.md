# Regras da Discovery: o jeito de trabalhar do Alessandro

Atualize este arquivo sempre que uma regra nova for combinada.

## 1. Marca
- Nome da marca: **"Discovery"** (nunca "Discovery Investiment", "Investment" ou "Investimento"). Instagram: **@discoveryremodeling**.
- Cores: verde-escuro **#17361A** (principal), verde da logo #29721D, dourado **#F2C14E** (destaque), branco. Fonte: Inter (Black/Bold).
- Logos: `marca/logo-discovery-branca.png` e `marca/logo-discovery-colorida.png`. Animação: `marca/logo-reveal-discovery-original.mp4` (fundo branco, globo desenhado do zero), usada no final de todo Reel.
- Toda arte e todo vídeo levam a logo (branca no canto de cima à direita, nos vídeos).
- WhatsApp oficial: **+1 (475) 349-9986** (link `https://wa.me/14753499986`).
- Guia grátis (PDF público): https://drive.google.com/file/d/1ulALUwXcDuyvy-1aK0RQ5Rf8V-tRbsnd/view (primeiro link da bio).
- Perfil: nome "Alessandro | Leilão Casas EUA"; links da bio: Guia grátis, WhatsApp e site; destaques verdes, com "Assessoria" em primeiro e "Avaliação" para os depoimentos.

### Padrão visual (Designer, aprovado em 27/10)
- Fontes: **Alumni Sans Black** (títulos, caixa alta) + **Work Sans** (texto). Cores da marca + creme #F5F1E6.
- Fotos reais e **nítidas** (nada de foto desfocada no fundo). Fotos em `designer/fotos/`.
- 6 famílias de layout que se alternam (nunca a mesma duas vezes seguidas): capa (foto em cima + bloco verde), número gigante, foto cheia com degradê, fundo dourado, fundo verde só com texto e lista em cartões.
- **Stories são vídeos animados de 7 s** (palavras entrando uma a uma, foto com zoom lento, botão pulsando): `designer/anim.js` + `designer/gravar.js`, salvos em `semana-vendas/animados/`. Carrossel explicativo vira **Reel animado** (o Alessandro acha carrossel estático amador).
- Sempre **fotos de casas reais ao fundo**, variando entre as pastas do Drive (Elkland, 501 Elmira, Casa da Igreja, 953 Erie...). O Drive MCP baixa fotos até ~5 MB.
- Gerador: `designer/gerar-artes-v2.py` (HTML → JPG com `designer/render.js`). Também dá para mandar para o Adobe Express para editar.

## 2. O que nunca fazer
- Nunca prometer lucro ou retorno, nem usar "investimento seguro", "sem risco" ou a conta "valor de mercado menos lance = lucro".
- Quando aparecer valor ou resultado, colocar: "Valores estimados. Resultados passados não garantem resultados futuros. Todo investimento envolve risco."
- Nunca mostrar o endereço da casa (nem "953 Erie St"), o número da casa ou placas: usar só cidade e condado (ex.: "Elmira, NY").
- Imagem simulada ou "expectativa" sempre com "Projeto ilustrativo" ou "simulação de cor".
- Nunca inventar números, datas de leilão ou depoimentos. Datas de leilão só depois de conferir no site oficial.
- Desfocar rostos de terceiros, placas de carro e documentos.
- Família que aparece nos vídeos: Alessandro (Ale), Tiene, Bruno e Gabriella. Todos são adultos e autorizaram. Cortar falas que exponham a família de forma negativa (ex.: a Tiene chamando o Ale de "grosso").

## 3. Edição de vídeo (Reels e stories)
- A FALA MANDA NO CORTE: frases inteiras, com 0,3 s de folga antes e 0,5 s depois; corte só nas pausas entre frases; nunca cortar no meio da palavra.
- Nunca acelerar trecho com fala. Partes sem fala podem ser rápidas ou aceleradas.
- Corte J/L quando a imagem precisar trocar durante a fala.
- Legendas sincronizadas em português no terço de baixo; gancho em texto no terço de cima; nada nos 15% de baixo nem nos 10% de cima.
- Deixar claro o contexto: "ANTES DA LIMPEZA / DEPOIS DA LIMPEZA" (não confundir com reforma).
- Stories: série "DIÁRIO DA CASA DE LEILÃO · DIA X/7", com texto de contexto e chamada para o post do dia, texto animado e a logo.
- Quem edita é o **Claude do notebook**. Aqui eu analiso o vídeo (o Alessandro manda pela conversa) e escrevo o prompt de correção. As versões corrigidas são salvas com **"-v2"** em `G:\My Drive\Isaques - Discovery\Reels 953 Erie St` (pasta do Drive liberada como "qualquer pessoa com o link").

## 4. Rotina de publicação
- O Alessandro aprova a semana uma vez; depois eu publico tudo sozinho, sem pedir aprovação de novo.
- Horários (Brasília): story em vídeo às 8h, post do feed às 12h (sexta 19h, sábado 10h, domingo 19h), story de pergunta às 14h, checagem de comentários às 14h e 19h.
- Regra do v2: se existir o "-v2" no Drive na hora do post, publico o v2; se não, publico o original.
- A agenda fica em `agenda-semana-automatica.md`, a rotina "Semana automática Discovery" lê a versão mais nova, e o painel fica em https://claude.ai/artifact/J39wU8iVxtmEvYAZ1XBHhW (fixado na barra lateral).
- Pela conexão (Windsor) não dá para colocar música, figurinhas, link no story nem vídeo em carrossel, e também não dá para criar destaques. Essas coisas ficam com o Alessandro.
- Responder em público só comentários com GUIA (mandar para o link da bio) ou ASSESSORIA (te chamei no direct / WhatsApp). Listar perguntas e críticas para o Alessandro.
- Resumo para o Alessandro depois de cada horário com publicação.

## 5. Vendas
- Oferta: **conversa grátis de 20 minutos**; nunca colocar preço na divulgação.
- **Só 2 vagas abertas** na assessoria (atualizar quando o Alessandro avisar).
- Chamadas: "Comente ASSESSORIA 👇" (venda) e "Comente GUIA 📘" (atração).
- Direct: o Alessandro usa atalhos do teclado Samsung (gguia, aassessoria, rreuniao, ppreco, ffollowup). Os textos estão em `mensagens-direct.md`.

## 6. Preferências do Alessandro
- Quer o mínimo de trabalho possível: eu faço tudo e só peço o que for indispensável.
- Não quer inventar formatos: prefere MODELAR o que já dá resultado nos concorrentes (mesma estrutura, gancho e formato), com as informações e os vídeos dele. Nunca copiar vídeo, texto ou imagem dos outros literalmente.
- Usa celular Samsung com o Instagram em inglês e o computador com Windows. Passo a passo sempre com os nomes dos botões em inglês.
- Gosta de ver o resultado (imagem ou arquivo) antes de aprovar.
- Casa 953 (Elmira, NY): telhado vai ser **preto**; carrossel de cores aprovado (cinza escuro, off-white, verde-exército, azul-escuro).
- Quer conteúdo feito para SALVAR e COMPARTILHAR (alcance): calendário de leilões com data e condado, listas e checklists úteis, sempre com a chamada "Salve e mande pra quem quer investir nos EUA". Datas só depois de conferidas no site oficial.
- Quer estudar também o mercado de "dolarizar o patrimônio" (criadores que falam disso) para ampliar o público além do leilão.
- Ferramentas: Nano Banana (Gemini) só funciona em sessão nova, com a variável GEMINI_API_KEY; HeyGen é para vídeos educativos com avatar (marcar "Informação de IA").

## 7. Organização e pesquisa de concorrentes
- Organograma e ciclo semanal: `ORGANOGRAMA.md`.
- Toda sexta, às 8h54, o agente de pesquisa analisa os concorrentes e salva o relatório em `inteligencia-concorrentes/`. A pauta da semana seguinte sempre parte do relatório mais recente.
- Concorrentes acompanhados: @lucipuerari, @roavanzo, @bm_investiments, @minas__home, @ocacadordetitulos (Marcos Jacober), @wkleiloes.
