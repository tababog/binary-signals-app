# Agenda automática: semana de vendas, 02/11 a 08/11 (horário de Brasília)

**APROVADA pelo Alessandro em 27/10. Ajustada em 29/10 pela análise do perfil:** os Reels com vídeo real da casa 953 Erie St alcançaram de 6 a 10 vezes mais que imagens e carrosséis, então a série continua na semana de vendas (ter e qui 19h). Publicar sem pedir aprovação de novo. Oferta: conversa grátis de 20 min · sem preço · **Só 2 vagas** (se o Alessandro avisar que uma vaga foi preenchida, trocar o texto para "Só 1 vaga"; com as duas preenchidas, "Vagas encerradas. Comente ASSESSORIA para entrar na lista de espera").

## Onde estão os arquivos
- **Artes e vídeos do Claude** (link público, GitHub): `BASE = https://raw.githubusercontent.com/tababog/binary-signals-app/claude/beautiful-hamilton-br5zyn/marketing/discoveryremodeling/semana-vendas/`
  - stories: `BASE + animados/story-XXX.mp4` (vídeos de 7 s)
  - Reel: `BASE + animados/reel-como-funciona.mp4`
  - imagens: `BASE + frase-01.jpg`, `frase-02.jpg`, `frase-03.jpg`, `post-calendario-leiloes.jpg`
- **Vídeos do Claude do notebook**: pasta do Drive **"Reels Semana Vendas"** (dentro de "Isaques - Discovery"). Encontre o arquivo com `mcp__Google_Drive__search_files` (title contains '<nome>') e publique com `https://drive.usercontent.google.com/download?id=<ID>&export=download&confirm=t`. Se a pasta não estiver como "qualquer pessoa com o link", avise o Alessandro para liberar.
  - `reel-segunda-assessoria.mp4`, `casa-1-*.mp4` … `casa-5-*.mp4`, `elkland-carrossel-01.jpg` … `-10.jpg`, `elkland-reel.mp4`
  - Use sempre a versão MAIS ALTA que existir (v3 > v2 > original). **Casas 1 a 5: NUNCA publique as v2** (legenda sobreposta e, na casa 2, valores errados). Publique só a **v3** (casa-N-nova-york-v3.mp4 / casa-5-vendemos-v3.mp4); se a v3 não existir na hora, não publique e avise o Alessandro.
  - Se existir a versão "-v2", use a v2 (no carrossel de Elkland, use os elkland-carrossel-NN-v2.jpg; se o slide 8 foi retirado, são 9 imagens).
- **Se o arquivo do notebook ainda não existir na hora:** não publique nada no lugar. Avise o Alessandro na hora ("o vídeo X não chegou no Drive") e tente de novo no próximo horário do mesmo dia. Se não chegar até as 19h, pule o item e anote no resumo.

## Feed
| Dia | Hora | Post | Arquivo | Ação |
|---|---|---|---|---|
| Seg 02/11 | 12h | Reel do Ale "Você NÃO precisa morar nos EUA" | Drive `reel-segunda-assessoria` | create_video_post |
| Seg 02/11 | 19h | Calendário de leilões (post para salvar) | `post-calendario-leiloes.jpg` | create_image_post |
| Ter 03/11 | 12h | Casa 1: "A melhor casa do leilão" | Drive `casa-1-` | create_video_post |
| Ter 03/11 | 19h | **Série 953 Erie St, episódio 7** (vídeo editado pelo Alessandro) | Drive `erie-ep7` (pasta "Reels 953 Erie St"); **se não existir até 19h, publique `frase-01.jpg`** | create_video_post (ou create_image_post na frase) |
| Qua 04/11 | 12h | Casa 2: casa de 2 famílias | Drive `casa-2-` | create_video_post |
| Qui 05/11 | 12h | Carrossel "Do leilão à venda" (Elkland) | Drive `elkland-carrossel-01..10` | create_carousel_post |
| Qui 05/11 | 19h | **Série 953 Erie St, episódio 8** (vídeo editado pelo Alessandro) | Drive `erie-ep8` (pasta "Reels 953 Erie St"); **se não existir até 19h, publique `frase-02.jpg`** | create_video_post (ou create_image_post na frase) |
| Sex 06/11 | 12h | "VENDEMOS! 35 dias no mercado" | Drive `casa-5-` | create_video_post |
| Sex 06/11 | 19h | Casa 3: "Essa a gente NÃO compraria" | Drive `casa-3-` | create_video_post |
| Sáb 07/11 | 10h | Casa 4: "A importância da visita presencial" | Drive `casa-4-` | create_video_post |
| Sáb 07/11 | 19h | Reel "Do leilão à venda" (Elkland) | Drive `elkland-reel` | create_video_post |
| Dom 08/11 | 19h | Reel animado "Como funciona a nossa assessoria" | `animados/reel-como-funciona.mp4` | create_video_post |

Para os Reels do notebook, use a legenda do arquivo `legendas-visitas.txt` (ou a legenda que o notebook deixou na pasta) e acrescente no fim, se ainda não tiver, o bloco **CTA de vendas** abaixo. Sem legenda pronta, use o modelo de cada post abaixo.

## Stories (vídeos animados; action create_story com video_url)
| Dia | 8h | 14h |
|---|---|---|
| Seg 02/11 | `story-seg-08.mp4` | `story-seg-14.mp4` |
| Ter 03/11 | o próprio vídeo `casa-1-` do Drive (teaser do post do meio-dia; se tiver mais de 60 s, pule) | `story-ter-14.mp4` |
| Qua 04/11 | `story-destaque-avaliacao.mp4` | `story-qua-14.mp4` |
| Qui 05/11 | `story-qui-08.mp4` | `story-qui-14.mp4` |
| Sex 06/11 | o próprio vídeo `casa-3-` do Drive (teaser; se tiver mais de 60 s, pule) | `story-sex-14.mp4` |
| Sáb 07/11 | `story-sab-08.mp4` | `story-sab-14.mp4` |
| Dom 08/11 | `story-dom-08.mp4` | `story-dom-14.mp4` |

## Legendas
**Regra (29/10):** toda legenda termina com uma PERGUNTA fácil (já incluída abaixo; `\n` = quebra de linha) e só depois o CTA de vendas. Nas legendas do notebook (Elkland, casas), se não houver pergunta no fim, acrescente uma no mesmo estilo antes do CTA.

**CTA de vendas** (fim de toda legenda desta semana):
```
📞 Conversa grátis de 20 minutos pra entender o seu objetivo. Estamos com só 2 vagas abertas na assessoria.
👉 Comente ASSESSORIA ou chame no WhatsApp (link na bio).

Valores estimados. Resultados passados não garantem resultados futuros. Todo investimento envolve risco.
#leilaodeimoveis #taxdeed #imoveisnoseua #brasileirosnoseua #casasnoseua #investirnoseua
```

- **Seg 12h, Reel do Ale:** "Você NÃO precisa morar nos Estados Unidos pra comprar casa em leilão aqui 🇺🇸🏠 A gente visita, analisa e acompanha tudo por você.\n\nVocê sabia disso? Conta aqui 👇" + CTA
- **Seg 19h, Calendário:** "📌 SALVE este post: leilões de casas em Nova York e na Pensilvânia em novembro e dezembro. Mande pra quem quer investir nos EUA! Datas conferidas nos sites oficiais em 27/10; confira sempre no site do condado antes de se inscrever.\n\nQual condado você quer acompanhar? 👇" + CTA
- **Ter 12h, Casa 1:** "Essa foi a melhor casa que a gente viu nesse leilão 👀 Olha o estado dela por dentro e por fora.\n\nVocê compraria essa casa? Sim ou não 👇" + CTA
- **Ter 19h e Qui 19h, Série 953 Erie St (ep. 7 e 8):** use a legenda que o Alessandro deixar na pasta (arquivo `erie-ep7.txt` / `erie-ep8.txt`). Sem legenda: "Diário da reforma, episódio [7/8] 🔨 A casa que compramos em leilão em Elmira, NY. O que você faria primeiro nessa casa? 👇" + CTA. Termine SEMPRE com uma pergunta simples antes do CTA.
- **Ter 19h, Frase 1 (só se o ep. 7 não chegar):** "Quem espera o momento perfeito vê os outros comprando a casa. 💭\n\nConcorda? 👇" + CTA
- **Qua 12h, Casa 2:** "Casa de 2 famílias numa avenida principal: compraria? 🤔 Olha o tour por dentro.\n\nVocê moraria ou alugaria? 👇" + CTA
- **Qui 12h, Carrossel Elkland:** use a legenda do notebook; se não tiver: "Do leilão à venda: a transformação da casa de Elkland, PA, cômodo por cômodo 🔨➡️🏡 Arraste pro lado.\n\nQual foi a maior transformação? 👇" + CTA
- **Qui 19h, Frase 2 (só se o ep. 8 não chegar):** "Casa barata não é oportunidade. Oportunidade é casa bem analisada. 🔍\n\nConcorda? 👇" + CTA
- **Sex 12h, VENDEMOS:** "VENDEMOS! 🎉 Compramos, reformamos e vendemos: 100% do processo concluído, 35 dias no mercado. Compra US$ 48.000 · Reforma US$ 38.000 · Venda US$ 135.000 (valores reais deste caso).\n\nQual parte você achou mais difícil: comprar, reformar ou vender? 👇" + CTA
- **Sex 19h, Casa 3:** "Essa a gente NÃO compraria, e você precisa saber por quê 👇\n\nVocê teria comprado? 👇" + CTA
- **Sáb 10h, Casa 4:** "No Google ela parecia bonita… olha o que a gente encontrou na visita 😳 Por isso a visita presencial é obrigatória.\n\nVocê entraria nesse leilão? 👇" + CTA
- **Sáb 19h, Reel Elkland:** use a legenda do notebook; se não tiver: "Essa casa foi a leilão… olha como ela ficou depois da reforma 🏡✨\n\nVocê imaginava esse resultado? 👇" + CTA
- **Dom 19h, Reel "Como funciona":** "Como funciona a nossa assessoria, em 5 passos: da conversa grátis até a chave na mão, sem você precisar morar nos EUA 🇧🇷🇺🇸 Últimas vagas deste mês.\n\nQual é a sua maior dúvida? Pergunta aqui 👇" + CTA

## Comentários e direct (14h e 19h)
- Comentário com **ASSESSORIA** (ou VAGA, CONVERSA, LEILÃO): responder em público, uma vez só, variando: "Que bom, [nome]! Te chamei no direct pra marcar uma conversa grátis de 20 min 📞" e listar a pessoa no resumo para o Alessandro chamar no direct (atalho **aassessoria**).
- Comentário com **GUIA**: "Te mandei o guia! Também está no primeiro link da bio 📘"
- Perguntas, críticas, preço, retorno: não responder; listar para o Alessandro.

## Regras
- Nunca publique o mesmo item duas vezes: antes de publicar, confira pela leitura do Instagram (Windsor get_data) o que já saiu hoje.
- Item de horário anterior do mesmo dia que não saiu (reinício do sistema): publique agora.
- Datas de leilão: o post do calendário já foi conferido; não altere.
- Nada de endereço, contrato ou nome de comprador nas legendas.
