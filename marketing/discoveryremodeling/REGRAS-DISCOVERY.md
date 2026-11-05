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
- **Repositório privado a partir de 09/11 (decisão 02/11, opção b):** da semana 3 em diante, toda mídia publicada sai do **Google Drive** (links drive.usercontent), nunca do GitHub. O Claude faz as artes no repositório e o Claude do notebook copia para a pasta "Reels Semana Vendas › Artes Semana 3 (09-15nov)" (id 1U7dR5qglVFJDVBIdPS9p12xdcXvXkcqX) ANTES de o repositório ficar privado.
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
- **Logo nos Reels:** nada de logo nos 3 primeiros segundos (só gancho e rosto); depois, logo pequena e meio transparente no canto de cima, como marca d'água; logo-reveal no final continua. **Nos stories** a logo continua como está.
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
