# Regras da Discovery: o jeito de trabalhar do Alessandro

Atualize este arquivo sempre que uma regra nova for combinada.

## 1. Marca
- Nome da marca: **"Discovery"** (nunca "Discovery Investiment", "Investment" ou "Investimento"). Instagram: **@discoveryremodeling**.
- Cores: verde-escuro **#17361A** (principal), verde da logo #29721D, dourado **#F2C14E** (destaque), branco. Fonte: Inter (Black/Bold).
- Logos: `marca/logo-discovery-branca.png` e `marca/logo-discovery-colorida.png`. Animação do final de TODO vídeo: `designer/logo-reveal/logo-reveal-discovery-novo.mp4` (feita do `discovery-logo-reveal.html`, aprovada em 29/10). O logo-reveal antigo foi removido.
- Artes (imagens) levam a logo. **Vídeos: SEM logo durante o vídeo (regra de 10/11); só o logo-reveal branco de 1,5 s no final.**
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
- **Valores reais da casa de Elmira (03/11):** descarte do lixo = **2 toneladas**, pago **US$ 157,44** · telhado = **US$ 6.000**.
- **Troca da semana 3 (aprovada 03/11):** seg 09/ter 10 = "Quanto pesa essa carga de lixo?" p1/p2 (vídeos da pasta Drive "Obra 02-11"); sex 13/sáb 14 = "Quanto custou o telhado?" p1/p2. Drywall (US$ 1.400) e gabinetes (US$ 3.600) passam para a semana 4.
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
- **ADIADO (09/11): repositório fica PÚBLICO até 29/11 (Reels reeditados de novembro saem dele; decisão 09/11); privado a partir de 30/11 (lembrete trig_0117zeAhM5jQ2j7JfPEDQe4E).** Regra original: **Repositório privado a partir de 09/11 (decisão 02/11, opção b):** da semana 3 em diante, toda mídia publicada sai do **Google Drive** (links drive.usercontent), nunca do GitHub. O Claude faz as artes no repositório e o Claude do notebook copia para a pasta "Reels Semana Vendas › Artes Semana 3 (09-15nov)" (id 1U7dR5qglVFJDVBIdPS9p12xdcXvXkcqX) ANTES de o repositório ficar privado.
- **Formato "Especialista + Ale" (a partir da semana 4, 1 ou 2 por semana, sem ser obrigatório; decidido em 02/11):** Ale fala primeiro (gancho "Dolarizar não é só comprar dólar" + "investir em dólar = ativo que trabalha pra você, como imóvel nos EUA" + aviso de risco + "olha o que ele falou 👇"), depois entra o trecho do especialista (máx. 15 s, sem o Ale na tela) com cartão "Nome · cargo · fonte", e fecha com cartão "Comente ASSESSORIA" + logo. Crédito @ do especialista na legenda. Nunca cortar a fala dele para mudar o sentido nem sugerir que ele recomenda a Discovery. Preferir trechos de canal de notícia/entrevista/podcast. O Ale não diz "agora é a hora" nem "vai valorizar". Tema central: investir EM dólar (imóvel nos EUA), não só comprar dólar.
- **Posts com gráficos (02/11):** só gráficos educativos (composição de custos de um caso real, dólar x real, índice oficial de preço de casas nos EUA, tabela de diferenças imóvel EUA x renda fixa sem números de rentabilidade). NÃO publicar comparação de retorno com CDB/bolsa (a menos que o Alessandro libere depois de falar com advogado/contador).
- **Música padrão da Discovery (definida e aprovada pelo Alessandro em 02/11):** "Upbeat Corporate", de The_Mountain (Pixabay Music, faixa 576594, https://pixabay.com/music/corporate-upbeat-corporate-576594/). Licença: Pixabay Content License; marcada como instrumental e gerada por IA; a página não cita Content ID. Arquivo: musica-padrao-discovery.mp3 em Drive › Reels Semana Vendas › Artes Semana 3 (09-15nov). Andamento ~120 BPM. PADRÃO para as próximas semanas: mesma música e mesmo trecho (45,805 s a 52,805 s), ganho -4,7 dB, volume final -16 LUFS (medido -16,1), fade-in 0,3 s e fade-out 0,5 s, sem recodificar a imagem nem alterar a duração. Vale para todos os stories animados (e carrosséis em vídeo). Carrossel de FOTOS publicado pela API não aceita música.
- **Decisão sobre música (02/11):** não embutir músicas em alta do Instagram nos vídeos (direitos autorais). Música em alta só entra pelo próprio app, na postagem manual e dentro do que a conta permite.
- **Aprovação pelo painel (02/11):** item marcado como **"pronto"** no painel da semana (https://claude.ai/artifact/J39wU8iVxtmEvYAZ1XBHhW) = APROVADO pelo Alessandro. "edicao" ou sem marca = ainda não aprovado. Quando ele aprova um vídeo no chat, o Claude marca "pronto" no painel.
- **MUDANÇA 02/11:** o Alessandro NÃO vai agendar no Meta. Na semana de vendas a rotina PUBLICA pelo Windsor (agenda `agenda-publicacao-semana-vendas.md`, gerada por `meta-business-suite/gen_agenda.py`) só o que está "pronto" no painel, e ele libera cada "Allow" no celular. Regra antiga, só para referência: a partir da semana de vendas (02/11), **o Alessandro agenda os posts no Meta Business Suite** (grátis, publica sozinho no horário). O Claude prepara toda semana uma página-pacote com arquivo para baixar, legenda pronta e horário de Connecticut (modelo em `meta-business-suite/`), e a rotina só confere se saiu, responde comentários e marca o painel.
- Horários do pacote: no fuso de Connecticut (o app usa o fuso do celular). Brasília = Connecticut + 2 h (a partir de 01/11).

## Capas dos Reels e logo (definido em 03/11)
- **Todo Reel tem capa padrão** (gerador `designer/gerar-capas-semana3.py`, saída `semana-N/capas/capa-sN-<dia>-<hora>.jpg`): foto do Ale ou da obra, etiqueta dourada no topo, título de 3 a 6 palavras em Montserrat ExtraBold com a palavra-chave em dourado, subtítulo curto. Texto dentro do recorte 3:4 do perfil (y 240 a 1680). Logo pequena no canto.
- A rotina publica o Reel com `cover_url` apontando para a capa (Windsor create_video_post aceita).
- **Logo nos Reels (SUBSTITUÍDO em 10/11: sem logo durante o vídeo, só no final):** antes era: nada de logo nos 3 primeiros segundos (só gancho e rosto); depois, logo pequena e meio transparente no canto de cima, como marca d'água; logo-reveal no final continua. **Nos stories** a logo continua como está.
- **Capas da semana 3 APROVADAS pelo Alessandro em 03/11.**
- **Decisão (03/11):** o Alessandro deixou a escolha com o Claude ("você é o especialista, eu só quero crescer"). Capas e regra da logo entram na semana 3 como TESTE. No domingo 15/11, comparar com a semana 2 (visitas ao perfil, seguidores novos, alcance e retenção dos Reels). Se piorar, volta ao jeito antigo.
- **Windsor sem "Permitir" (03/11):** o Alessandro mudou em claude.ai/customize/connectors → Windsor: "Ferramentas somente leitura" = Sempre permitir; em "gravação/exclusão" só **Execute Action** = Sempre permitir (o resto continua pedindo aprovação). A rotina publica sozinha, mas só o que está "pronto" no painel.
- **Facebook (03/11):** o Alessandro ativou no Instagram (Accounts Center → Sharing across profiles) o compartilhamento automático de Posts, Reels e Stories da @discoveryremodeling para a Page "Discovery Remodeling" (NÃO a Tababog). A testar se vale também para o que a rotina publica pela Windsor (primeiro teste: Reel das 19h BRT de 03/11).

## Varredura semanal de leilões (definido em 03/11)
- **Toda sexta-feira de manhã** o Claude faz a varredura dos leilões de **Pensilvânia e Nova York** (sites oficiais dos condados e plataformas: Bid4Assets, GovEase, NYSAuctions/AAR, Auctions International etc.) e compara com o calendário anterior (`calendario-leiloes/`).
- Entrega: `calendario-leiloes/AAAA-MM-DD-varredura.md` com os leilões **NOVOS**, os que **mudaram** e os que **nos interessam** (prazo de inscrição, depósito, link oficial, distância de Connecticut e de Elmira), mais um resumo curto para a reunião de domingo à tarde.
- **Nada de pesquisa de listas, documentos ou due diligence sem o OK do Alessandro.** Ele escolhe na reunião de domingo à tarde quais leilões seguem; só aí o Claude começa listas, documentação e análise de cada imóvel.
- Só marcar CONFIRMADO o que aparecer com data no site oficial; o resto é A CONFERIR.
- **TUDO NA NUVEM (03/11):** o PC do Alessandro às vezes desliga, então o máximo possível roda na nuvem, sem depender do PC nem de ninguém. A pesquisa de listas e documentos dos leilões (due diligence) roda aqui na nuvem, com a habilidade tax-sale-due-diligence, assim que o Alessandro der SIM a um leilão. A sessão "Pesquisa do condado de York" (PC) fica só como histórico de setembro: numa vez em que o PC estiver ligado, pedir a ela que exporte o método e os arquivos para a nuvem.
- **Alessandro escreve o mínimo (03/11):** tudo o que for para ele decidir vem em tópicos com caixas de marcar (✅ sim / ❌ não), poucas opções e pouquíssimos campos de texto. Nada de perguntas abertas quando der para oferecer opções.
- **Reunião semanal (03/11):** DOMINGO À TARDE (não segunda). Sugestão: 15h em Connecticut / 17h de Brasília, antes da live de domingo (20h BRT). Pauta em tópicos com ✅/❌: aprovar a semana de conteúdo, leilões da varredura de sexta, obra e clientes.

## Central Alessandro e planilha mãe (03/11)
- **Página central:** https://claude.ai/artifact/Q2SicM1p2Xzt9jtsHEt8kb (decisões Sim/Não, checklists, agentes, níveis, 3 meses). As marcações ficam na coleção "checks" (ArtifactData). Ler antes de cada reunião de domingo e agir no que ele marcou SIM.
- **Planilha mãe das casas:** PLANILHA-MAE-CASAS.xlsx (8 casas, 1.333 lançamentos das planilhas "DESPESAS COM REFORMA", que NÃO foram alteradas). Abas: LEIA-ME, PAINEL, CASAS, LANÇAMENTOS, INVESTIDORES, CONFERIR, CATEGORIAS. Dados financeiros NUNCA vão para o repositório (só no Drive dele).
- **Fale comigo (03/11):** a Central tem campo de texto e botão de áudio; as mensagens ficam na coleção "mensagens" (áudio = id em assets). A cada disparo da rotina, ler as mensagens com lido=false, agir e marcar lido=true. A Central está fixada no menu lateral do claude.ai dele.
- **REGRA DOS LEILÕES (03/11): o que manda é o PRAZO DE INSCRIÇÃO, não o dia do leilão.** É o tempo que o Alessandro tem para visitar, pesquisar documentos e decidir. Toda varredura, tabela, resumo e decisão começa pelo "inscrição até DD/MM" e é ORDENADA por ele; mostrar também "faltam X dias para a inscrição". Prazo de inscrição desconhecido = destacar como A CONFERIR e tratar como urgente.
- **Casas Discovery (03/11, em HTML, no lugar do Excel):** https://claude.ai/artifact/1CB2Mt6EgquY8mM5scNkMN (fixada no menu). Junta as 5 páginas "Caixa" (953, Rumsey, Beckwith, Agnew, Rote) e o Excel de Elkland, 501 Elmira e New Castle. Recibos/fotos/lançamentos novos chegam na coleção "recibos" (status novo → lancado; foto = asset). A cada disparo da rotina, lançar os novos na casa certa e marcar "lancado". Status das casas e respostas do CONFERIR ficam em "estado/status" e "estado/conferir". Aportes por investidor continuam só nas páginas Caixa (com senha).
- **Cada pedido ao Alessandro tem link direto e "💬 Falar sobre isto" (03/11):** na Central, todo item que peço traz o link exato (nunca "busque em tal pasta") e um campo próprio para texto, áudio, foto ou vídeo daquele item. As mensagens vão para "mensagens" com o campo `item` (id do item). Áudios do isolamento etc. podem vir direto por ali, sem passar pelo Drive.
- **Leitura das respostas (03/11):** rotina "Leitura da Central e da Casas Discovery" (trig_011kLUKTzq6zNz79nswr3HWq), 3x por dia: 7h47, 12h47 e 18h47 de Connecticut. Lê mensagens (texto/áudio), marcações Sim/Não/Feito e recibos novos; age, marca lido/lançado e só escreve ao Alessandro quando há novidade. Na reunião de domingo, leitura completa.
- **Secretário por e-mail (03/11):** rotina trig_01Gvutoo6EWFqJ2M58Xy7riF, 6h53 "Seu dia hoje" e 17h53 "Fechamento" (Connecticut), para o Gmail dele. Canal escolhido é WhatsApp, mas o LetsBot não conecta (código não chega); voltar para o WhatsApp quando ele conseguir entrar no LetsBot. O número do WhatsApp dele fica só na Central (coleção "sistema"), nunca no repositório.
- **Central sempre limpa (03/11):** vale também para o que ele responder AQUI NA CONVERSA (Sim, Não, feito, resolvido): eliminar da Central na hora. A cada leitura (3x/dia), tirar da Central o que ele recusou (❌ Não, ex.: leilões que não quer), o que já foi resolvido e o que perdeu a validade; acrescentar só o que é novo, com link e ordenado por prazo. A página já esconde sozinha o que foi marcado (vai para o "Arquivo" no fim, com "Desfazer"). Mensagens lidas há mais de 7 dias são apagadas.
- **Distância dos leilões (03/11):** todo leilão listado traz o ENDEREÇO DO BUILDING DEPARTMENT da cidade/condado do leilão (referência oficial) e a DISTÂNCIA e o TEMPO DE CARRO da casa do Alessandro até lá. O endereço da casa dele está só na Central (coleção "sistema", doc "contato", campo "casa") e no prompt privado da varredura; nunca no repositório.
- **Mapa dos Leilões (03/11):** https://claude.ai/artifact/5hFtuHLo3r6gSqiecVwWyh (fixado no menu). Um leilão só vale a pena se estiver perto de uma das nossas bases. Todo leilão novo entra no mapa com a linha e a distância até a casa do Alessandro, 8 Rumsey (Seneca Falls) e 953 Erie St (Elmira), e com a "base mais perto". Gerador: scratchpad/mapa (tpl.html + leiloes.json + build.py); atualizar depois de cada varredura de sexta.
- **Padrão aprovado da Central (03/11, "ficou excelente"):** cada leilão na Central traz o MAPINHA ao lado do Sim/Não (linhas até a casa dele, 8 Rumsey e 953 Erie, tempo de carro até cada uma, ⭐ na mais perta) e o link "Abrir no mapa" que abre o mapa grande já no leilão. Tudo centralizado na Central; não espalhar em outras páginas.
- **Itens marcados continuam visíveis por 6 horas** com a frase do que ele marcou (para ele poder desfazer); depois vão para o Arquivo e a leitura limpa. Leilão marcado SIM = começar a pesquisa (lista, regras, documentos) na nuvem na hora.
- **Facebook (03/11, opção 1 + 2):** o compartilhamento automático do Instagram NÃO pega o que a rotina publica pela Windsor. (1) Fotos, carrosséis e posts de texto/link: publicar também na Page "Discovery Remodeling" pela Windsor (connector facebook_organic: create_photo_post / create_post), assim que ele ligar a Page na Windsor. (2) Reels/vídeos: a Windsor não publica vídeo no Facebook; o Secretário põe no "Seu dia hoje" o Reel do dia com o link do Drive para ele postar na Page pelo app do Facebook (só os Reels principais).
- **Família liberada nos vídeos (03/11):** Alessandro, Tiene (esposa), Bruno e Gabriela estão AUTORIZADOS a aparecer em todos os vídeos, com rosto e voz. Não desfocar nem cortar o rosto deles; quando falarem, usar a voz deles com legenda karaokê (mesmas regras: 1 bloco por vez, troca seca, nada sobre o rosto, nada abaixo de y=1560). Continua valendo: trabalhadores e terceiros só com autorização (senão, desfocar).
- **Comentários (03/11):** comentário público é com o Claude, não com o Alessandro. Rotina trig_01MrGUGqVLY16mxCxUv7XLoR, 4x por dia (8h43, 12h43, 16h43, 20h43 de Connecticut), responde ASSESSORIA/VAGA/CONVERSA com o texto DELE: "Oi, [nome]! Que bom que você se interessou 🙌 Para eu te explicar do jeito certo, me chama no Direct que eu te faço 3 perguntas rápidas." Não duplica se ele já respondeu. Direct e WhatsApp são com ele (o Windsor não acessa). Perguntas, críticas e preço vão para o resumo dele. Registro em "comentarios" na Central; o "Fechamento" lista quem chamar no Direct.

## Agente dos Aplicativos (definido em 04/11)
- Rotina toda segunda 7h37 (Connecticut): confere se PS Log (pslog.netlify.app), Duo Life (duo-life-rouge.vercel.app), Tababog Obras e Obrik/Obrik Limpeza estão no ar, lê o andamento nas conversas e painéis de cada app, atualiza a pasta "Aplicativos" da Central e manda o e-mail "Aplicativos · semana".
- Só leitura: não programa, não roda SQL, não mexe em senha/chave e não fala com as sessões dos apps sem o OK do Alessandro. Cada app continua com a sua própria conversa e as suas regras (não misturar projetos).
- "Apps TN" = Obrik (Obrik e Obrik Limpeza). TN = Tiene, esposa do Alessandro.
- **Versões antigas (04/11):** nunca vão para a lixeira. Sempre para a subpasta "antigos" da mesma pasta (ex.: "Reels Semana Vendas/antigos"). Vale para o notebook e para mim.
- **Equipe da obra de Elmira autorizada (04/11):** os trabalhadores da obra da 953 Erie St (equipe do telhado e da reforma) autorizaram aparecer. NÃO desfocar o rosto deles; deixar natural. Outras pessoas (vizinhos, desconhecidos, quem aparece de fundo) continuam desfocadas.
- **Prévias para o Alessandro:** todo vídeo para ele aprovar vai salvo como PRÉVIA no Drive (subpasta "previas" da pasta de destino), para ele assistir no celular. Só depois do OK vira a versão final.
- **Live 08/11 mudou (04/11):** domingo 08/11 às **11h de Brasília = 9h em Connecticut** (não mais 20h). Stories de convite refeitos com o horário novo; no domingo os stories "É hoje" saem às 8h e às 10h (agenda editada à mão; se regenerar com gen_agenda.py, manter esses horários). Resposta a "LIVE": "Te espero domingo às 11h de Brasília".
- **Agenda pessoal (04/11):** quando o Alessandro disser o que tem que fazer e quando (na conversa ou no 💬 da Central), o Claude registra na Central, coleção "agenda" ({quando ISO com fuso de Connecticut, hora, texto, obs, feito}), aparece em "Minha agenda" na Central e no topo do "Seu dia hoje". Se ele ligar o Google Agenda, também criar o evento lá.

## Nome das semanas (definido em 04/11)
- Semanas por MÊS: "Novembro S1, S2, S3, S4", depois "Dezembro S1"... Semana = segunda a domingo; ela pertence ao mês em que tem mais dias (ex.: 30/11 a 06/12 = Dezembro S1).
- Novembro 2026: **S1 = 02 a 08/11** (a antiga "semana 2", de vendas) · **S2 = 09 a 15/11** (antiga "semana 3") · **S3 = 16 a 22/11** (antiga "semana 4") · **S4 = 23 a 29/11** · Dezembro S1 = 30/11 a 06/12.
- As pastas antigas do repositório (semana-vendas, semana-3, semana-4) ficam com o nome antigo para não quebrar links; as novas serão "2026-11-S4", "2026-12-S1" etc. Nas conversas, painéis e e-mails, usar só o nome novo.

## Windsor instável (aprendido em 04/11)
- Se a publicação der timeout E o get_data não mostrar nem posts que com certeza saíram (lista atrasada), NÃO reenviar: perguntar ao Alessandro o que aparece no perfil (resposta curta, ex.: "Casa 2: 1 · story: sim"). Em 04/11 o Reel saiu na 2ª tentativa e o story na 1ª, apesar dos timeouts.

## O que funciona no feed (números de 30/10 a 04/11)
- Reel com o Ale falando de frente + gancho forte: 2.489, 2.413 e 1.617 views. Tour de casa sem rosto: 284 (Casa 2). Episódios da série às 19h: 106 e 221.
- Dois Reels no mesmo dia dividem o alcance (04/11: reel manual às 8h24 + Casa 2 às 12h52 = 183 + 284).
- Regra: priorizar o Ale de frente nos primeiros 2 s; tour de casa só com o rosto dele no gancho; 1 Reel por horário nobre; se ele quiser postar algo à mão, me avisar para eu tirar o automático do dia.

## Feedback semanal das gravações (pedido em 05/11)
- Toda semana, antes da reunião de domingo, medir as gravações novas (feedback-gravacoes/medir-voz.py), comparar com a linha de base em feedback-gravacoes/historico.md e dar ao Alessandro: o que melhorou, o que ainda soa recitado e 2 ou 3 dicas práticas. Registrar no histórico.

## Meta de seguidores (05/11)
- Meta do Alessandro: 150 mil seguidores no @discoveryremodeling. Marcos: 10 mil → 50 mil → 150 mil. Na reunião de domingo, mostrar o ritmo da semana (seguidores/dia) e quanto falta.

## Agente do Drive (aprovado em 05/11)
- Objetivo: tirar cópias duplicadas de fotos, vídeos e áudios para facilitar achar as coisas.
- Duplicado = mesmo nome-base (sem " (1)", "Cópia de", "Copy of") E mesmo tamanho exato. Fica o mais antigo; as cópias vão para "_duplicados (apagar depois)" (id 1rtAUuPKwKzUJjzvW-IvH_OBIxU7UbyLr). Nunca apagar nem usar a lixeira: quem esvazia a pasta é o Alessandro.
- Não mexe em: pastas "antigos", conta discoveryremodelingllc, documentos/planilhas do Google, arquivos de 0 bytes, ids usados nas rotinas/painel.
- Roda todo sábado 22h17 (CT). Log em drive-limpeza/.

## Carrossel: formato certo (aprendido em 05/11)
- O carrossel de Elkland foi feito em 9:16 (1080x1920) e o Instagram cortou para 4:5 no feed: sumiram o título de cima e as etiquetas ANTES/DEPOIS de baixo.
- Regra: carrossel e post de foto SEMPRE em 1080x1350 (4:5). Textos e etiquetas dentro da área segura: 80 px das bordas, nada nos 100 px de cima e de baixo. Story e Reel continuam 1080x1920.
- Antes de aprovar um carrossel, mostrar a prévia já no recorte 4:5.

## Pasta diária de vídeos (05/11)
- Todo dia em que o Alessandro for gravar, criar no Drive a pasta "Estoque Obra DD-MM" (dentro da mesma pasta das anteriores, parent 1v3ofmnl8nKXelxI6RkGiJ4bIr3ThiUqe) já com link público (Anyone with the link · Viewer), autorizado por ele. Ele só sobe e avisa.

## Semana mesclada (decidido em 06/11)
- Nada de semana temática inteira (só quiz, só vendas). Toda semana mistura os tipos, 1 Reel por dia ao meio-dia (no máximo 1 Reel por dia, contando os que o Alessandro posta à mão):
  2 informativos (ex.: Tax Deed em 30 s, 3 coisas antes do lance) · 2 alerta/medo com solução (roteiros-medo.md) · 1 bastidor/obra · 1 quiz/interação (quanto custa?, enquete) · 1 prova/venda (antes e depois, "vendemos", assessoria).
- Medo sempre com verdade e com a solução que a Discovery oferece; sem exagero, sem promessa de lucro.

## Calibração de orçamentos (06/11)
- Estimativas e custos reais de obra NÃO vão para o GitHub. Ficam na Casas Discovery (privada), coleção "calibracao" (um documento por casa, ex.: "953-erie"). O Claude lança ali cada gasto real que o Alessandro mandar e, no fim, compara estimativa x real.

## Recibos de material por casa (06/11)
- Pasta privada no Drive: "Recibos de Material - Casas Discovery" (id 105h2031X8rVnNs34-GYbR1x_z0SmjULW), uma subpasta por casa:
  953 Erie (1RygPmpYEJlpVn8L75d4C92JaW_Q8rDxI) · 8 Rumsey (1zZmaBOP9ssln4w42rZJz0_ADk9HSr8gd) · 348 Beckwith (1Cw9tj0oOhhAj3Kd2nKfdoko73IsC8zXo) · 1104 Agnew (1ixkbeDse0aqiBgLwdm0HqNMe6Z3xRneN) · 6955 State Route 51 (1qm1TJCFvq1eQhIldMUWgT_0sV0UPja_L).
- O Alessandro escaneia direto na subpasta da casa (app Drive → + → Scan). A leitura das 7h47/12h47/18h47 lê os arquivos novos dessas pastas, lança na casa e na calibração. Pastas NÃO públicas (dados financeiros).

- (07/11) O Alessandro também manda recibos pela página **Caixa** de cada casa (botão Câmera/Galeria/PDF no topo; ex.: Caixa 953 Erie = https://claude.ai/artifact/BMn8c1jTMV28aYoJbehiDt, coleção "recibos", status "novo"). A leitura confere também essas páginas. Na dúvida, marcar status "duvida" com a pergunta em "duvida" e "sugestoes" (categorias da Caixa): aparece para ele escolher na própria página.

## Separação dos recibos por departamento (06/11)
Cada linha de cada recibo vai para um departamento. Mapa:
- **Telhado:** shingles, plywood/OSB (padrão = telhado, salvo se a nota/obra indicar subfloor), underlayment/manta, ice & water, drip edge, ridge vent, flashing, prego de telhado, dumpster do telhado.
- **Drywall:** sheetrock/drywall, joint compound ("compound"/massa), fita, parafuso de drywall, corner bead, lixa de drywall.
- **Insulation:** lã de vidro/rockwool, espuma, barreira de vapor.
- **Pintura interna:** tinta interior, primer interior/PVA, primer bloqueador, rolo/bandeja/fita/lona usados dentro, massa corrida.
- **Pintura externa:** tinta exterior (ex.: Peppercorn), primer exterior, calafetação exterior, material de power wash.
- **Elétrica:** fio, caixas, tomadas, GFCI, interruptores, recessed, luminárias, ventilador de teto, disjuntores.
- **Encanamento:** PVC/ABS/PEX, conexões, registros, válvula de chuveiro, ralo, cano de esgoto.
- **Banheiro:** banheira, vanity, vaso, cerâmica, argamassa, rejunte, painel de parede, exaustor, acessórios.
- **Cozinha:** gabinetes, bancada, pia, torneira, fogão, exaustor, dishwasher.
- **Piso:** laminado, manta do piso, shoe molding, stain e verniz de piso/escada.
- **Janelas e portas:** janelas, portas, fechaduras.
- **Trim/carpintaria:** rodapé, guarnição, madeira de acabamento, closet.
- **Lavanderia:** lavadora, secadora, mangueiras, duto.
- **Demolição/descarte:** dumpster de dentro, trailer, taxa do descarte, sacos.
- **Consumíveis/ferramentas:** lâminas, luvas, brocas, itens gerais.
Regras: usar a descrição do produto (interior/exterior, uso). Se uma linha não der para saber o departamento, perguntar ao Alessandro em ✅/❌ e não chutar. Imposto (sales tax) é rateado proporcionalmente entre os departamentos da nota.
- (06/11, Alessandro) Na dúvida, SEMPRE perguntar antes de lançar: o mesmo produto pode ir para áreas diferentes. A linha fica "pendente" até ele responder; depois vai para o departamento que ele disser. Guardar as respostas dele como exemplo para as próximas notas (lista "Respostas do Alessandro" no doc de calibração da casa).
- (06/11) Base de preços de mão de obra definida pelo Alessandro fica na Casas Discovery, coleção "calibracao", doc "base-precos" (ex.: laminado = base fixa por sq ft). Para cada casa nova (próxima: 348 Beckwith), entregar dois números por cômodo e no total: "Preço Adin" (padrão da 953: total dele ≈ piso da minha faixa) e "Preço de mercado" (cotando fora). Material separado da mão de obra.

## Painel da semana: data da última atualização (06/11)
- Toda vez que eu atualizar o painel (https://claude.ai/artifact/J39wU8iVxtmEvYAZ1XBHhW), troco a faixa dourada no topo: "🕒 Última atualização: [dia da semana], DD/MM/AAAA, às XhYY (Connecticut) · XhYY (Brasília)".
- Publique sempre com `url` = J39wU8iVxtmEvYAZ1XBHhW (o arquivo local é scratchpad/painel/painel-semana.html). Sem o url, a publicação cria outro link.

## Casas Discovery: cartão de cada casa (07/11)
- O cartão de cada casa e os números do topo mostram só: **Valor pago na casa** (Aquisição) · **Despesas com material** (Reforma, exceto mão de obra) · **Mão de obra** (Pessoas, MAO DE OBRA, labor/Zelle de contractor) · **Outros** (lixo e permit + todo o restante: viagem, seguro, água, luz, "Outros") · **Total** (soma dos quatro = tudo o que a casa já gastou). Tirados a pedido do Alessandro: "Aportes", "Caixa hoje", "Falta aportar".
- (07/11) Viagem, custos fixos e "Outros" entram no item Outros, então o Total = todos os lançamentos da casa.
- Cada recibo lançado entra também nos lançamentos da Casas Discovery, para os totais ficarem em dia.
- (07/11) Ao lançar recibos de uma casa, atualizar também a página **Caixa** dela (ex.: Caixa 953 = https://claude.ai/artifact/BMn8c1jTMV28aYoJbehiDt): lançamentos, totais por categoria, meses e projeção. A Caixa é compartilhada com os investidores pelo link, então só entram valores da casa (nada pessoal). Não existe mais rotina automática às 22h; quem lança é a leitura das 7h47, 12h47 e 18h47.

## Lives (08/11)
- O vídeo das lives (ou o .zip do "Export your information" do Instagram) vai para o Google Drive: Isaques - Discovery > Instagram > **Lives** (https://drive.google.com/drive/folders/1D4zhJRTtNRFXvnhy8KA2E_QKfuJjN3_2). Dali o Claude faz os cortes (30–60 s, com legenda) e põe no painel como "a fazer" para aprovação.
- O app dele não baixa a live direto do Live Archive (abre "Live video ended"); o caminho é Accounts Center > Your information and permissions > Export your information > só Media, última semana.

## Semana 09 a 15/11: 100% crescimento, SEM vendas (decisão 08/11)
- Objetivo único: seguidores novos. Nada de "vagas", "assessoria", "conversa grátis" ou WhatsApp em Reels, legendas e stories desta semana.
- Formatos que trazem seguidor (análise dos concorrentes 08/11): jogo de chute ("quanto custou?"), antes/depois com história, "você conhecia…?" (termo americano), quebra de mito, suspense até o fim (@roavanzo).
- Legenda termina com pergunta + "siga para ver a resposta amanhã". Stories só com enquete/quiz/bastidor.
- Os comentários com ASSESSORIA continuam sendo respondidos pela rotina (responder não é vender).
- Meta: +100 seguidores na semana, comparar no domingo 15/11.
- S3 (16-22/11): `agenda-publicacao-novembro-s3.md` (docs `s3-*`). Terrenos parte 2 e episódio 9 reeditados sem venda (semana-crescimento/). S4 (23-29/11): `agenda-publicacao-novembro-s4.md` (docs `s4-*`), 3 Reels dependem de gravação (roteiros-s4.md). A rotina de publicação (trig_01NR1H8coPYEoYD3sm1SJQz3) cobre S2 a S4 e desliga em 29/11.
- Agenda: `agenda-publicacao-semana-crescimento.md` (docs `s2-*` no painel). Rotina "Semana de crescimento" (trig_01NR1H8coPYEoYD3sm1SJQz3) publica às 8h, 12h e 14h de Brasília e desliga sozinha no domingo 15/11. As 3 respostas (parte 2) foram reeditadas sem "Comente ASSESSORIA" (pasta `semana-crescimento/`). O estoque (drywall, gabinetes) pode ter chamada de venda gravada no vídeo: conferir e reeditar antes de usar.

## Ajuste no meio do caminho (regra do Alessandro, 08/11)
- O plano da semana NÃO é para seguir até o fim se não estiver dando certo. Todo dia, antes da publicação das 12h, o Claude compara o Reel do dia anterior (alcance, comentários, seguidores novos) com a média da semana.
- Se cair mais de ~30% (ou 2 dias seguidos de queda), o Claude TROCA o Reel do dia seguinte (ou o resto da semana) por outro formato do estoque e avisa o Alessandro em 1 linha (o que trocou e por quê). Não precisa pedir licença para trocar dentro do estoque já aprovado; conteúdo novo continua precisando de aprovação no painel.
- Continua valendo: máximo 1 Reel por dia, sem vendas na semana de crescimento.

## Formato "fala em casa + obra no fundo" (teste aprovado em 09/11)
- O Alessandro grava em casa, de frente para uma parede lisa e clara (1 m da parede, luz de frente, roupa escura ou colorida, nunca branca). O Claude recorta e coloca atrás um vídeo da obra (equipe trabalhando), levemente desfocado, voz original.
- Ferramenta: segmentação (modelo selfie_multiclass, ai-edge-litert) + recorte da parede clara + preenchimento de buracos (óculos). Script de referência: scratchpad teste/seg-padrao.py (pessoa ~66% da largura, canto inferior esquerdo, parede aprendida por cor a cada quadro). Para gravar: dar 1 passo para trás para os ombros caberem inteiros na imagem.
- Primeiro uso real: Reel "Comprar barato não é lucro" (dom 29/11). Se ficar bom, vira padrão das falas.

## Casa do Lago e rodízio de casas (decisão 09/11)
- NUNCA mostrar valores (custos, preço de compra, gastos) da Casa do Lago (348 Beckwith) no Instagram, por causa dos investidores. Quizzes da Casa do Lago sem número de dinheiro.
- Não concentrar o conteúdo numa casa só. S3: Reels da 953 (fecham a fase) + stories da Casa do Lago. S4 (23-29/11): semana da Casa do Lago, sem a 953. Dezembro: a 953 volta misturada com a Casa do Lago (e casas antigas, como Elkland).
- Vídeos da Casa do Lago para edição: cópias em Drive › Estoque Obra 09-11 (equipe 953) › "Casa do Lago (para Instagram)" (a pasta original da casa é privada e tem planilha de caixa; não tornar pública).

## Horários e 2 Reels por dia (decisão 09/11, com base nos insights do app)
- Público: 80,5% Brasil, 15,5% EUA; 55% mulheres; 35-54 anos. Pico de atividade: 18h EST = 20h de Brasília.
- Reel 1 (descoberta na casa, traz alcance): **14h de Brasília** (12h em Connecticut). Reel 2 (Alessandro falando, traz seguidor): **20h de Brasília** (18h em Connecticut), a partir da S3 (16/11).
- A regra antiga de "no máximo 1 Reel por dia" foi trocada por 2 Reels por dia (teste de 3 semanas; mantém se o alcance médio por Reel não cair mais de 20%).
- O Claude manda toda semana na Central os roteiros de ~4 falas curtas para o Reel das 20h.

## Animação nos vídeos (pedido do Alessandro, 09/11)
- Ele gostou do teste com HyperFrames ("No dia em que pegamos a chave") e quer MAIS animação em todos os próximos Reels: texto entrando palavra por palavra, impacto/tremor nas revelações, etiquetas deslizando, barra de progresso, números subindo, botão "Seguir" animado no fim, transições. Usar imaginação e variar os efeitos de um Reel para outro.
- Ferramenta: HyperFrames (CLI `hyperframes`, render com `--sdr`; GSAP local em vez de CDN, porque a rede bloqueia jsdelivr). Projeto de referência: scratchpad hf-lago/.

## Meta de 50 seguidores por dia e teste 953 × Casa do Lago (decisão 09/11)
- META DIÁRIA: **50 seguidores novos por dia** (350 por semana). Todo conteúdo, a partir de agora, é pensado para ALCANCE e ENGAJAMENTO (chegar no maior número de pessoas). Placar diário no arquivo `metricas-crescimento.md`.
- Conta da meta (dados de 26/10 a 08/11): ~5 seguidores a cada 1.000 views. 50/dia ≈ 10 mil views por dia ≈ 5 mil por Reel com 2 Reels/dia. Nosso melhor Reel até hoje: 2.852 views. Ou seja: precisamos de Reels 2x melhores que o nosso recorde, e de pelo menos 1 que "estoure" (10 mil+) por semana.
- Linha de base: melhor dia 69 seguidores (02/11, "Você NÃO precisa morar nos EUA"); média de 02 a 08/11 ≈ 17/dia; de 05 a 08/11 ≈ 3/dia (semana de vendas derrubou o alcance).
- A partir da S3 (16/11): **2 Reels por dia** (14h e 20h de Brasília) e **teste 953 × Casa do Lago**: uma casa em cada horário, invertendo os horários no meio da semana para o horário não decidir o resultado. Medir em 24 h: views, alcance, % que pula (skip), tempo médio, compartilhamentos e seguidores do dia. A casa que ganhar ganha mais espaço na semana seguinte.
- Calendário: S3 = 953 às 14h e Casa do Lago às 20h; S4 = Casa do Lago às 14h e 953 às 20h. Gravações 10, 11 e 12/11 (cronograma-gravacoes-s3-s4.md).
- A ideia é "hypar": a história da transformação de uma casa e da outra, em série, com gancho forte, pergunta e "siga para ver a próxima parte".

## O que dá alcance (números reais do perfil, 26/10 a 08/11)
- MELHORES: casa do jeito que encontramos + bagunça ("Primeira visita": 2.852 views, só 19,6% pulam); descarte/caçambas com pergunta (2.051 views, 18% pulam); Ale falando de frente sobre a família (2.463) e "não precisa morar nos EUA" (2.531 views, 18 compartilhamentos, dia de 69 seguidores).
- PIORES: texto institucional ("A reforma continua", 41% pulam), bloco de venda "2 vagas/assessoria" (40–60% pulam, alcance caiu para 30–250), carrossel de datas, post de live, tour sem gancho.
- REGRA: menos de 30% de skip = alcance acima de 1.300. Mais de 45% = abaixo de 400. O primeiro 1 segundo decide: começar com a imagem mais forte (bagunça, revelação, rosto do Ale com a frase-gancho), nunca com logo, fachada parada ou texto longo.

## Regras de edição para alcance (pedidos do Alessandro, 09/11)
- Cenas com bagunça: plano mais ABERTO (afastado) e com MUITA bagunça visível. Nada de close vago (o story de terça da S3 foi refeito por isso).
- Cozinha: cenas mais LONGAS, para ver a pia inteira cheia de louça suja. Quartos: usar as cenas com muita roupa suja e sujeira; banheiro sujo quando houver vídeo.
- Formato aprovado "MEIA TELA": casa em cima, Ale embaixo, com DEGRADÊ suave entre as duas telas (sem linha dura). Legenda karaokê na emenda, etiquetas animadas dos cômodos sincronizadas com a fala, "HORRÍVEL"/revelações com carimbo e tremor, enquete SIM/NÃO, botão "+ Seguir" pulsando, logo no fim. Referência: semana-crescimento/s4-lago-meia-tela.mp4 (projeto scratchpad hf-tour/).
- Cortar repetições da gravação e deixar só a melhor fala de cada parte; CTA uma vez só, no fim.
- Reel de pergunta NÃO entrega a resposta (ex.: número de cargas de lixo fica para o Reel-resposta).
- HyperFrames não desenha emoji: usar só texto/SVG nas animações.

## Agentes de crescimento (criados em 09/11)
- Definições em `.claude/agents/` (na raiz do repositório): **analista-crescimento** (placar diário e teste 953 × Lago), **cacador-de-ganchos** (ganchos e roteiros a partir dos dados e dos concorrentes), **editor-reels** (checklist de edição para alcance), **ouvidor-seguidores** (o que o público pergunta e pede), **espiao-concorrentes** (o que os concorrentes fazem e como fazer melhor).
- Rotinas: "Analista de crescimento (placar diário)" todo dia; "Ouvidor dos seguidores" toda quarta; "Agente de pesquisa de concorrentes" toda sexta (já existia). Tudo vira pauta na Central e no painel para o Alessandro aprovar.

## O Alessandro aparece em TODOS os vídeos (regra de 09/11)
- Nenhum Reel ou story sai sem o Alessandro aparecendo. Tour de casa sem ele não é mais usado sozinho.
- Fonte principal: os vídeos em que ele já fala na obra (pasta Casa do Lago e da 953). Montagem padrão: **começa com ele de frente, em tela cheia, dizendo o gancho** → depois a casa entra como fundo/meia tela (com degradê) **e ele continua falando do mesmo assunto** (voz contínua), voltando ao rosto dele nas frases mais fortes e no final.
- Variar os formatos entre os Reels: meia tela com degradê, Ale recortado no canto com a casa atrás, Ale em tela cheia com janelas da casa entrando (picture-in-picture), corte seco rosto ↔ casa no ritmo da fala.
- Inventário dos assuntos que ele fala em cada vídeo: `semana-crescimento/inventario-falas-lago.md` (cada assunto vira um Reel).

## Cortes da live (decisão 09/11)
- Os 5 cortes da live de 08/11 (semana-crescimento/cortes-live/) entram como 2º Reel do dia, às 20h de Brasília, de segunda a sexta da S2 (09 a 13/11): ex-dono, preço, casa barata, telhado, permit. Formato: Ale em tela cheia, etiqueta "CORTE DA LIVE", legenda karaokê na altura do peito (nunca sobre o rosto), etiquetas animadas fora do rosto, pergunta final e "+ Seguir". Toda live nova vira cortes nesse formato.

## Recorte do Ale x meia tela (10/11)
- O Alessandro reprovou o "Comprar barato não é lucro" feito com ele RECORTADO na frente da casa (parecia colado). Padrão para falas gravadas em casa: MEIA TELA com degradê (casa em cima, ele embaixo com o fundo real dele). Recorte só se ele pedir. Script: scratchpad s3l/split.py + gen.py.
- Gravações: NÃO picotar a fala (o Alessandro reprovou em 10/11). Só encurtar pausas longas (>0,75 s) para ~0,5 s, mantendo o respiro entre frases, e tirar frases repetidas/recomeçadas. Script: scratchpad s3l/autocut2.py. Conferir na legenda que nenhuma palavra sumiu.

## Casas Discovery (10/11)
- 107 Elkland, 501 Elmira e 517 E. Moody já foram VENDIDAS: saíram da página Casas Discovery (cartões, lançamentos e perguntas). Ficam 5 casas: 953 Erie, 8 Rumsey, 348 Beckwith (Casa do Lago), 1104 Agnew e 6955 Rote.
- Sim/Não e status da página: corrigido o erro que travava os cliques (valor vazio gravado). Cada clique mostra "Salvo ✅".

## Fundo dos vídeos de fala (regra do Alessandro, 10/11) — SUBSTITUI a regra de meia tela
- NENHUM vídeo de fala sai com fundo branco/parede. Sempre RECORTAR o Alessandro (centralizado, **72% da largura**: tamanho aprovado em 10/11, para aparecer mais da casa) e colocar atrás um VÍDEO de uma casa. Não dividir a tela.
- Variar as casas do fundo: preferir as que o público ainda não viu (506 Elmira "casa da boneca", 8 Rumsey, 501, Elkland), para sair da 953 e da Casa do Lago. Vídeos da 506 copiados em Estoque Obra 09-11 (506-a..d.mp4); scratchpad c506/.
- Sem número da casa, rua ou placa no fundo (escolher trechos sem a porta da frente/caixa de correio).
- Logo final: 1,5 s, fundo BRANCO original.
- Script: scratchpad s3l/new/pa/segc.py (cutout centralizado) + blocos de texto um por vez + legenda karaokê y=1400.

## Não repetir imagem (regra do Alessandro, 10/11)
- Cada Reel usa uma casa DIFERENTE no fundo. Nunca a mesma casa em dois Reels seguidos da agenda, e nunca os mesmos trechos em dois vídeos. Variar também dentro/fora (fachada, quintal, obra, cômodos).
- Antes de editar um lote, montar a tabela "Reel → casa → trechos" e conferir que não há repetição. Registro: `semana-crescimento/fundos-usados.md`.
- Banco de fundos (cópias em Drive › Estoque Obra 09-11; scratchpad casasbg/ e c506/): 506 Elmira (fachada, quartos com lixo, banheiro), 501 Elmira (fachada, deck novo), 8 Rumsey (fachada, telhado sendo trocado), 107 Elkland (interior em reforma, fachada), além da 953 e da Casa do Lago. Faltam vídeos da 1104 Agnew e da 6955 Rote nas pastas (só há documentos); pedir ao Alessandro.
- Logo final: SEMPRE o original de fundo BRANCO (logo-reveal-discovery-novo.mp4), 1,5 s. Não trocar a cor do fundo (corrige a regra anterior do verde).
- Recorte APROVADO (10/11, exemplo "risco-menor"): Ale com 72% da largura, centralizado, apoiado embaixo. Método: segmentação em alta resolução por blocos (selfie_multiclass no quadro inteiro para achar a pessoa, depois em quadrados sobrepostos a partir do topo da cabeça), SEM recorte por cor (o recorte por cor comia a orelha e deixava mancha em cima da cabeça por causa da parede bege). Script: scratchpad s3l/new/pa/segc.py, montagem em s3l/modelo.py. Sempre conferir cabeça e orelhas em 5 quadros antes de mandar a prévia.
- **SEM LOGO DURANTE O VÍDEO (10/11, pedido do Alessandro):** a partir de agora nenhum vídeo leva logomarca no canto durante a fala. Só o logo-reveal branco de 1,5 s no final. Vale para Reels e para tudo que for editado daqui para frente.

## Avaliar TODA gravação do Alessandro (regra de 10/11)
- Pedido dele: "avaliar todos os meus vídeos, porque eu quero entender qual é o ponto que eu tenho que chegar". Vale para toda gravação nova que ele subir (ganchos, falas, Reels), sem ele precisar pedir.
- Formato: tabela por vídeo com nota de 0 a 10 e 1 linha de comentário; depois "o que está bom", "o que melhorar para chegar em 9 ou 10" e "precisa regravar?" (sim/não, e qual).
- Critérios: 1) primeiro segundo (começa falando na hora, sem respirar antes); 2) ritmo (gancho de 2 a 4 s, sem pausa no meio da frase); 3) energia e variação da voz; 4) rosto e mãos acompanham a frase (nojo, surpresa, indignação; não sorrir em tudo); 5) texto (curto, concreto, com pergunta no fim, sem "mas/e/então" no começo); 6) técnica (1920p, parede clara, luz de frente, 1 passo para trás com um palmo de parede de cada lado dos ombros, som limpo).
- Referência de 9,5: gancho do Reel 5 da S3 ("Essa parede eu não vou derrubar não, sabe por quê?"), gravado em 10/11.
- Ser honesto: dizer que a avaliação é por transcrição, ritmo, variação de tom medida no áudio e quadros do vídeo (não por ouvido); nota baixa quando for o caso, sempre com o que fazer para subir.
- Conferir o roteiro contra a IMAGEM antes de mandar para ele gravar (erro de 10/11: roteiro dizia "sofá" e o vídeo mostrava tambores).

## Variar o formato dos Reels (aprovado pelo Alessandro em 10/11 à noite)
- Motivo: "senão daqui a pouco vai ficar muito igual". Não repetir o mesmo formato dois dias seguidos no mesmo horário. Ele continua aparecendo em TODO vídeo (rosto, bolinha, ou voz + mãos com rosto no gancho).
- Formatos liberados: (1) recorte + casa de fundo (o atual); (2) ANDANDO E FALANDO NA OBRA, cru, selfie em tela cheia, SEM recorte (liberado em 10/11: o fundo é a casa de verdade; é o tipo do recorde do perfil); (3) BOLINHA: casa em tela cheia e ele num círculo no canto, com rosto cheio nos 2 primeiros segundos; (4) voz + rosto nas pontas (formato do Lago: gancho e fecho com ele, meio com a casa e a narração dele); (5) tela verde: ele pequeno embaixo apontando para foto, recibo ou site do condado; (6) resultado primeiro (1 s do "depois", volta para o "antes"); (7) resposta a comentário (comentário real no topo); (8) voto A ou B; (9) série numerada "Dia X".
- Meia tela continua FORA dos vídeos de fala (pedido dele em 10/11); só em tour, se ele pedir.
- Não fazer: tour sem rosto, texto institucional, anúncio de assessoria, mais de 1,5 s antes do gancho, abrir com logo ou fachada parada, fala parada por mais de 15 s sem trocar a imagem, acabamento com cara de IA.
- Teste da S4 (953, 20h): Reel 10 telhado = tela verde sobre foto do telhado; Reel 11 equipe = bolinha; Reel 12 antes e agora = resultado primeiro; Reel 13 = recorte atual. Comparar no placar por formato.
- Fonte: pesquisa do espião de concorrentes em 11/11 (indicação qualitativa; o dado mais firme é o histórico do próprio perfil).
- Recorte (ajuste de 11/11, script s3l/new/pa/segc.py, função fill_holes): os buracos que encostam na borda de baixo só viram "pessoa" nos pixels que NÃO têm cor de parede (comparação de cor a/b com a parede do topo). Assim não sobra parede debaixo dos cotovelos nem abre buraco na camiseta embaixo das mãos. Conferir sempre com zoom nos braços e nas mãos, além de cabeça e orelhas.
- Corte de fala: conferir a ÚLTIMA palavra pela energia do áudio, não só pela transcrição (erro de 11/11: "casa" foi cortada no meio porque a transcrição inventou um "valeu" depois). Deixar 0,3 s de respiro depois da última sílaba.

## Textos animados (aprovado pelo Alessandro em 11/11)
- Ele pediu "animação diferente com as informações de texto: balões, informação entrando pela parede". Aprovou o estilo no Reel "Casa do Lago: abrimos mais uma casa" e escolheu a versão ANIMADA para ir ao ar.
- Estilo aprovado (HyperFrames + GSAP, projeto de referência no scratchpad hf-lg8/index.html): etiqueta dourada caindo do topo; título entrando palavra por palavra; BALÃO de fala que estoura; CARIMBO que bate e treme; FAIXA escura com borda dourada entrando pela lateral (alternar esquerda e direita) com o nome do cômodo; etiquetas que estouram sobre os objetos; enquete SIM/NÃO pulsando no final; barra dourada de progresso no topo; flash branco na troca de cena.
- Regras: um elemento principal por vez; nada sobre o rosto; nada abaixo de y=1560; sem emoji (a ferramenta não desenha); animar só os textos, sem mexer na imagem (o vídeo continua "cru"); sumir tudo antes da logo final.
- Fluxo: montar a base com legenda karaokê e sem blocos (modelo.py com "blocks": []), renderizar a animação por cima (hyperframes render --sdr -w 2), recomprimir em crf 21. Cortar trechos de vídeo 4K um por vez (vários trims de uma vez estouram a memória).
- Legendas: a palavra não fica na tela mais de 0,8 s depois de falada (ajuste no cap_low.py).

## Teste de formatos e feedback na reunião (regra do Alessandro, 11/11)
- Pedido dele: testar os formatos, medir "o que mais deu retenção, que tipo de vídeo", e levar o resultado para a reunião da semana, "para a gente manter e fazer mais vezes da mesma forma".
- Todo Reel publicado ganha a etiqueta do FORMATO no placar (`metricas-crescimento.md`, tabela "Teste de formatos"): recorte · bolinha · tela dividida · andando na obra com textos animados · voz + rosto nas pontas (Lago) · tour/obra sem fala · outro.
- Números por Reel: views, alcance, % que pulam (skip), tempo médio assistido, compartilhamentos, salvos, comentários e seguidores do dia. Ler com 24 h e de novo com 72 h.
- Rodada 1 do teste: dom 15/11 20h andando na obra + animado (Lago "abrimos a casa") · ter 17/11 14h recorte (Reel 9) · qua 18/11 14h bolinha (Reel 11) · sáb 21/11 14h tela dividida (Reel 13). Aviso honesto a manter no relatório: assuntos e horários diferentes também pesam; por isso repetir cada formato pelo menos 2 vezes antes de concluir.
- NA REUNIÃO DA SEMANA (domingo): levar 1 tabela "formato x resultado" (média de skip, alcance e seguidores por formato), dizer qual formato ganhou, qual perdeu, e a decisão proposta: manter e repetir o vencedor, ajustar ou cortar o pior. Máximo 8 linhas, com ✅/❌ para ele decidir.
- Depois da decisão dele, a agenda da semana seguinte usa mais vezes o formato vencedor (sem deixar de variar).
