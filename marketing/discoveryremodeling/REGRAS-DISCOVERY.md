# Regras da Discovery: o jeito de trabalhar do Alessandro

Atualize este arquivo sempre que uma regra nova for combinada.

## 1. Marca
- Nome da marca: **"Discovery"** (nunca "Discovery Investiment", "Investment" ou "Investimento"). Instagram: **@discoveryremodeling**.
- Cores: verde-escuro **#17361A** (principal), verde da logo #29721D, dourado **#F2C14E** (destaque), branco. Fonte: Inter (Black/Bold).
- Logos: `marca/logo-discovery-branca.png` e `marca/logo-discovery-colorida.png`. Animação do final de TODO vídeo: `designer/logo-reveal/logo-reveal-discovery-novo.mp4` (feita do `discovery-logo-reveal.html`, aprovada em 29/10). O logo-reveal antigo foi removido.
- Toda arte e todo vídeo levam a logo (branca no canto de cima à direita, nos vídeos).
- WhatsApp oficial: **+1 (475) 349-9986** (link `https://wa.me/14753499986`).
- Guia grátis (PDF público): https://drive.google.com/file/d/1ulALUwXcDuyvy-1aK0RQ5Rf8V-tRbsnd/view (primeiro link da bio).
- Perfil: nome "Alessandro | Leilão Casas EUA"; links da bio: Guia grátis, WhatsApp e site; destaques verdes, com "Assessoria" em primeiro e "Avaliação" para os depoimentos.

### Padrão visual (Designer, aprovado em 27/10)
- **Fonte oficial (27/10): Montserrat** (ExtraBold 800 nos títulos, em letras normais, sem caixa alta; Medium 500 no texto; Bold nas etiquetas e botões). O Alessandro adorou essa fonte: usar em TODOS os carrosséis, stories e Reels daqui pra frente. Cores da marca + creme #F5F1E6. Fundo não muito escuro.
- **A cara do Alessandro:** em posts de assessoria, venda e oferta, usar fotos dele (rosto, na frente das casas, em visita). Em posts sobre casas, usar as casas. Não em todos os posts, conforme o assunto.
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
- **Legendas no padrão novo (27/10):** estilo karaokê, até 3 palavras por vez, Montserrat ExtraBold, palavra falada em dourado, sem contorno/caixa, degradê escuro suave embaixo. Detalhes em `prompt-correcao-casas-legendas.md`. Aviso de risco só junto dos números e no final.
- **Frases inteiras e começo forte (01/11):** vídeo nunca começa com "mas", "e", "então" ou "porque" (sobra de corte não é gancho). O gancho é o texto na tela + uma frase completa. Nunca cortar no meio de frase nem juntar pedaços de frases: melhor um pouco mais longo e com sentido do que picado.
- **Troca de legenda SECA (01/11):** um bloco de legenda nunca entra antes do anterior sair (sem fade/transição entre blocos). Cartões ("Vale a pena?", CTA) ficam no terço de cima e nunca colados na legenda da fala. Conferir isso em todo vídeo antes de aprovar.
- **Drywall da casa de Elmira (corrigido em 03/11):** US$ 1.400, material e mão de obra, SÓ do hallway da entrada (não US$ 2.800 da casa inteira). Isolamento US$ 600 · gabinetes US$ 3.600 · reforma total ~US$ 40.000 (estimativa).
- **Casa 4 (casarão):** lance US$ 8.000 · valor de mercado ~US$ 180.000 (confirmado em 01/11).
- **Casa 2 (C22):** lance inicial US$ 6.500 · valor de mercado ~US$ 125.000 (confirmado em 01/11; a v3 saiu com 60.000 × 140.000, errado).
- **Casa 3 (C18):** o vídeo aprovado em 02/11 (v4) mostra lance US$ 5.000 · mercado ~US$ 110.000 (o Alessandro aprovou assim; em 01/11 ele tinha dito 5.500 × 130.000). Use 5.000 × 110.000 nas legendas.
- Legendas sincronizadas em português no terço de baixo; gancho em texto no terço de cima; nada nos 15% de baixo nem nos 10% de cima.
- Deixar claro o contexto: "ANTES DA LIMPEZA / DEPOIS DA LIMPEZA" (não confundir com reforma).
- Stories: série "DIÁRIO DA CASA DE LEILÃO · DIA X/7", com texto de contexto e chamada para o post do dia, texto animado e a logo.
- Quem edita é o **Claude do notebook**. Aqui eu analiso o vídeo (o Alessandro manda pela conversa) e escrevo o prompt de correção. As versões corrigidas são salvas com **"-v2"** em `G:\My Drive\Isaques - Discovery\Reels 953 Erie St` (pasta do Drive liberada como "qualquer pessoa com o link").

## 4. Rotina de publicação
- O Alessandro aprova a semana uma vez; depois eu publico tudo sozinho, sem pedir aprovação de novo.
- Horários (Brasília): story em vídeo às 8h, post do feed às 12h (sexta 19h, sábado 10h, domingo 19h), story de pergunta às 14h, checagem de comentários às 14h e 19h.
- Regra do v2: se existir o "-v2" no Drive na hora do post, publico o v2; se não, publico o original.
- Semana de vendas (02 a 08/11): `agenda-semana-vendas-automatica.md` (mesma rotina, desliga em 09/11; o repositório fica público até 09/11 porque as artes saem dele).
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

## Aprendizados da 1ª semana automática (análise de 29/10)
- Reel com **vídeo real da casa e da família** (série 953 Erie St) alcança de 6 a 10 vezes mais que imagem ou carrossel. Prioridade: vídeo real; imagens só como apoio (para salvar e compartilhar).
- **Série com episódios** segura o público: continuar a série da casa em todas as semanas.
- **Gancho no 1º segundo** derrubou de ~60% para ~20% quem pula o vídeo. Manter em todo vídeo.
- "Comente GUIA" sozinho não gera comentário: **toda legenda termina com uma pergunta fácil** antes do CTA.
- Análise completa: `inteligencia-concorrentes/2026-10-29-analise-perfil-semana1.md`.

## Textos sobre vídeo (pedido do Alessandro em 29/10)
- **Nada de caixa/retângulo verde atrás do texto** em cima das imagens da casa: tapa a casa. Texto direto na imagem, com degradê escuro suave e sombra leve.
- Números (lance, valor) em dourado, grandes, sobre o céu ou o chão; nunca em cima da casa nem do rosto.
- Usar sempre o melhor ângulo da casa (fachada inteira) quando aparecerem os números.

## Logo no final dos vídeos (pedido do Alessandro em 29/10)
- A partir de 29/10, TODOS os vídeos terminam com o **logo-reveal novo**: `designer/logo-reveal/logo-reveal-discovery-novo.mp4` (1080x1920, 6,5 s, fundo branco, Montserrat, com @discoveryremodeling). Feito a partir do `discovery-logo-reveal.html` do Drive.
- Link direto para baixar: https://raw.githubusercontent.com/tababog/binary-signals-app/claude/beautiful-hamilton-br5zyn/marketing/discoveryremodeling/designer/logo-reveal/logo-reveal-discovery-novo.mp4
- O antigo `logo-reveal-discovery-original.mp4` foi REMOVIDO (29/10). Nunca usar. Se o arquivo antigo aparecer em alguma pasta do notebook, apagar.

## Painel da semana (pedido de 29/10)
- Cada item do painel tem, ao lado do status, um botão **"▶ Ver vídeo"** ou **"🖼 Ver foto"**, que abre o arquivo que vai ser publicado. Se o arquivo ainda está em edição, o botão é **"📁 Ver pasta (em edição)"**.
- Quando um arquivo novo chegar (por exemplo, as v3 das casas ou os episódios 7 e 8), atualizar o link desse item no painel.

## Fuso horário e país do perfil (29/10)
- O perfil @discoveryremodeling é dos **Estados Unidos** (Alessandro mora em Connecticut). Assinaturas e preços (Meta Verified, Instagram Plus) são os dos EUA, em dólar.
- **Os horários de publicação continuam no horário de BRASÍLIA** (o público é ~79% Brasil). As rotinas usam CRON_TZ=America/Sao_Paulo.
- Para o Alessandro, sempre mostrar também o horário de Connecticut: até 31/10, 1 h a menos (12h Brasília = 11h em Connecticut); a partir de 01/11 (fim do horário de verão nos EUA), 2 h a menos (12h Brasília = 10h em Connecticut).

## Publicação pelo Meta Business Suite (31/10)
- Postar pelo Claude (Windsor) sempre pede "Allow once" ao Alessandro: é uma trava da plataforma e não dá para tirar.
- **Repositório privado a partir de 09/11 (decisão 02/11, opção b):** da semana 3 em diante, toda mídia publicada sai do **Google Drive** (links drive.usercontent), nunca do GitHub. O Claude faz as artes no repositório e o Claude do notebook copia para a pasta "Reels Semana Vendas › Artes Semana 3 (09-15nov)" (id 1U7dR5qglVFJDVBIdPS9p12xdcXvXkcqX) ANTES de o repositório ficar privado.
- **Formato "Especialista + Ale" (a partir da semana 4, 1 ou 2 por semana, sem ser obrigatório; decidido em 02/11):** Ale fala primeiro (gancho "Dolarizar não é só comprar dólar" + "investir em dólar = ativo que trabalha pra você, como imóvel nos EUA" + aviso de risco + "olha o que ele falou 👇"), depois entra o trecho do especialista (máx. 15 s, sem o Ale na tela) com cartão "Nome · cargo · fonte", e fecha com cartão "Comente ASSESSORIA" + logo. Crédito @ do especialista na legenda. Nunca cortar a fala dele para mudar o sentido nem sugerir que ele recomenda a Discovery. Preferir trechos de canal de notícia/entrevista/podcast. O Ale não diz "agora é a hora" nem "vai valorizar". Tema central: investir EM dólar (imóvel nos EUA), não só comprar dólar.
- **Posts com gráficos (02/11):** só gráficos educativos (composição de custos de um caso real, dólar x real, índice oficial de preço de casas nos EUA, tabela de diferenças imóvel EUA x renda fixa sem números de rentabilidade). NÃO publicar comparação de retorno com CDB/bolsa (a menos que o Alessandro libere depois de falar com advogado/contador).
- **Música padrão da Discovery (definida e aprovada pelo Alessandro em 02/11):** "Upbeat Corporate", de The_Mountain (Pixabay Music, faixa 576594, https://pixabay.com/music/corporate-upbeat-corporate-576594/). Licença: Pixabay Content License; marcada como instrumental e gerada por IA; a página não cita Content ID. Arquivo: musica-padrao-discovery.mp3 em Drive › Reels Semana Vendas › Artes Semana 3 (09-15nov). Andamento ~120 BPM. PADRÃO para as próximas semanas: mesma música e mesmo trecho (45,805 s a 52,805 s), ganho -4,7 dB, volume final -16 LUFS (medido -16,1), fade-in 0,3 s e fade-out 0,5 s, sem recodificar a imagem nem alterar a duração. Vale para todos os stories animados (e carrosséis em vídeo). Carrossel de FOTOS publicado pela API não aceita música.
- **Decisão sobre música (02/11):** não embutir músicas em alta do Instagram nos vídeos (direitos autorais). Música em alta só entra pelo próprio app, na postagem manual e dentro do que a conta permite.
- **Aprovação pelo painel (02/11):** item marcado como **"pronto"** no painel da semana (https://claude.ai/artifact/J39wU8iVxtmEvYAZ1XBHhW) = APROVADO pelo Alessandro. "edicao" ou sem marca = ainda não aprovado. Quando ele aprova um vídeo no chat, o Claude marca "pronto" no painel.
- **MUDANÇA 02/11:** o Alessandro NÃO vai agendar no Meta. Na semana de vendas a rotina PUBLICA pelo Windsor (agenda `agenda-publicacao-semana-vendas.md`, gerada por `meta-business-suite/gen_agenda.py`) só o que está "pronto" no painel, e ele libera cada "Allow" no celular. Regra antiga, só para referência: a partir da semana de vendas (02/11), **o Alessandro agenda os posts no Meta Business Suite** (grátis, publica sozinho no horário). O Claude prepara toda semana uma página-pacote com arquivo para baixar, legenda pronta e horário de Connecticut (modelo em `meta-business-suite/`), e a rotina só confere se saiu, responde comentários e marca o painel.
- Horários do pacote: no fuso de Connecticut (o app usa o fuso do celular). Brasília = Connecticut + 2 h (a partir de 01/11).
