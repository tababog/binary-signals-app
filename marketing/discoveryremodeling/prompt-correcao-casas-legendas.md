# Prompt para o Claude do notebook: correção das casas 1 a 4 (legendas e títulos no padrão novo)

> **ATUALIZAÇÃO 27/10 – FONTE NOVA:** troque Alumni Sans e Work Sans por **Montserrat** (Google Fonts) em tudo:
> títulos e legendas em **Montserrat ExtraBold (800)**, em letras normais (NÃO precisa caixa alta), com ~70% do tamanho indicado abaixo;
> textos pequenos, etiquetas e botões em **Montserrat Bold (700)** ou **Medium (500)**.


Copie o bloco abaixo e cole na conversa do Claude do notebook.

```
CORREÇÃO DOS REELS casa-1 a casa-4 (pasta "Reels Semana Vendas") – PADRÃO VISUAL NOVO DA DISCOVERY

Analisei o casa-1-nova-york.mp4 (43,6 s). A edição e as falas estão boas, mas o visual está amador. Corrija os 4 vídeos com as regras abaixo e salve como casa-1-nova-york-v2.mp4 … casa-4-nova-york-v2.mp4 (sem apagar os originais).

=== 0. ANTES DE TUDO: OS VALORES ===
Os valores do casa-1 (lance inicial US$ 14.000 e valor de mercado ~US$ 320.000) foram passados por mim: MANTENHA, só no estilo novo dos cartões. Nas casas 2 a 4, use só valores que eu te passei; sem valor meu, sem cartão de número.

=== 1. FONTES (instale, são grátis no Google Fonts) ===
- Alumni Sans, peso Black (900): títulos, números e legendas. Sempre em CAIXA ALTA.
- Work Sans, pesos Regular e Bold: textos pequenos (etiquetas e aviso de risco).
Não use mais a fonte atual das legendas e dos cartões.

=== 2. LEGENDAS (o principal problema) ===
Hoje: frase inteira em 2 linhas, branca com contorno preto, letras grudadas. Fica amador.
Novo padrão, estilo "karaokê":
- No máximo 3 palavras por vez, em 1 linha só. Troque o bloco a cada 2 ou 3 palavras, seguindo o tempo de cada palavra.
- Alumni Sans Black, CAIXA ALTA, 110 px, branco, espaçamento normal entre as letras (nada de letras encostando).
- A palavra que está sendo falada fica DOURADA (#F2C14E). As outras ficam brancas.
- Cada bloco entra com um "pop": escala de 90% para 100% em 4 quadros.
- SEM contorno, SEM sombra dura e SEM caixa atrás. Para dar leitura, use um degradê escuro suave na parte de baixo do vídeo (preto de 0% a 45% de opacidade, de y=1100 até y=1920).
- Posição: centro, com a base em y≈1380. Nunca em cima do rosto (se o rosto estiver embaixo, suba a legenda para y≈1150).
- Transcreva com o tempo de cada palavra (whisper com word timestamps). A legenda tem que bater com a fala: ±2 quadros.

=== 3. CARTÕES DE TÍTULO E NÚMEROS ===
- Etiqueta de local: "📍 NOVA YORK" em Work Sans Bold 30 px, caixa alta, espaçamento de 5 px entre letras, letra verde-escura #17361A em fundo dourado #F2C14E, cantos retos, no topo à esquerda (x=72, y=260).
- Cartão de número (só se o valor for confirmado):
  - linha 1: "LANCE INICIAL" em Work Sans Bold 34 px, branco, caixa alta e espaçado;
  - linha 2: o valor em Alumni Sans Black 170 px, dourado #F2C14E;
  - fundo verde-escuro #17361A com uma barra dourada de 10 px na esquerda, alinhado à esquerda em x=72 (não centralizado);
  - entra deslizando da esquerda (8 quadros, desacelerando) e sai deslizando para a esquerda;
  - sem emoji dentro do cartão.
- "Vale a pena? Depende da reforma e da análise 🔍": mesmo estilo, em 2 linhas Alumni Sans Black 90 px, branco com "DEPENDE" em dourado.

=== 4. FINAL (CTA) ===
- Nos últimos 5 s antes da logo: painel verde #17361A ocupando a metade de baixo (de y=1050 a 1500), com:
  - "QUER QUE A GENTE ENCONTRE UMA CASA ASSIM PRA VOCÊ?" em Alumni Sans Black 96 px, branco;
  - botão em pílula dourada com "Comente ASSESSORIA 👇" em Work Sans Bold 46 px, verde-escuro, pulsando de leve (escala 100% → 104% → 100% a cada 1 s);
  - etiqueta "SÓ 2 VAGAS ABERTAS" acima do título, no estilo da etiqueta de local.
- O painel não pode cobrir o rosto: se o rosto estiver na metade de baixo, coloque o painel na metade de cima.
- Depois, o logo-reveal-discovery-original.mp4 (como já está).

=== 5. AVISO DE RISCO ===
Hoje ele fica o vídeo inteiro em cima da imagem. Novo padrão: mostre só junto com os cartões de número e nos 5 s finais, em Work Sans Regular 22 px, branco 80%, sem caixa, em y=1470. Ele também vai na legenda do post.

=== 6. RITMO ===
- Entre 7 s e 13 s do casa-1 há uns 6 s só de grama e parede, sem o apresentador. Encurte esses trechos ou acelere as partes SEM fala. Nunca acelere fala.
- O gancho (cartão do número ou primeira frase) tem que aparecer já no primeiro quadro.
- Mantenha as falas inteiras: corte só nas pausas (0,3 s antes e 0,5 s depois).

=== 7. ÁUDIO ===
Normalize para -14 LUFS (pico -1 dB). Se quiser, coloque uma música instrumental sem direitos autorais bem baixa (cerca de 20 dB abaixo da voz), abaixando ainda mais quando alguém fala.

=== ENTREGA ===
Primeiro faça só o casa-1-nova-york-v2.mp4 e me mostre 3 prints (um com legenda, um com cartão de número e um do final). Depois que eu aprovar, aplique nos outros 3. Prazo: sexta 30/10.
```

## Valores da casa-2 (C22), passados pelo Alessandro em 27/10
```
VALORES DA casa-2 (C22, casa de 2 famílias na avenida principal): lance inicial US$ 6.500 · valor de mercado ~US$ 125.000. Use nos cartões de número no estilo novo (mesmo padrão do casa-1), com o aviso de risco junto.
```

## Valores da casa-4 (C08), passados pelo Alessandro em 27/10
```
VALORES DA casa-4 (C08, "a importância da visita presencial"): lance inicial US$ 3.500 · valor de mercado ~US$ 125.000. Use os cartões de número no estilo novo LOGO DEPOIS da parte do Google ("no Google parecia bonita…"), antes de mostrar o interior. Logo em seguida, um cartão "MAS OLHA O QUE TINHA LÁ DENTRO 😳". Aviso de risco junto dos números.
```

## Valores da casa-3 (C18), passados pelo Alessandro em 27/10
```
VALORES DA casa-3 (C18, "essa a gente NÃO compraria"): lance inicial US$ 5.000 · valor de mercado ~US$ 110.000. Mostre os cartões de número logo no começo e, em seguida, o cartão "E MESMO ASSIM A GENTE NÃO COMPRARIA. OLHA POR QUÊ 👇" antes da minha fala. Aviso de risco junto dos números.
```

## casa-5 (C12, "VENDEMOS!"), valores passados pelo Alessandro em 27/10
```
casa-5 – "VENDEMOS!" (C12: vídeos 20260521_140307.mp4 e 20260521_140338.mp4 da pasta "Pesquisa de Campo"), no mesmo padrão visual novo das casas 1 a 4 (legendas karaokê, cartões, final e áudio).
- Gancho (0 a 2 s): eu dizendo "Vendemos!" + texto "VENDEMOS! 🎉" em Alumni Sans Black 150 px, caixa alta, com "VENDEMOS!" em dourado, e a etiqueta "35 DIAS NO MERCADO".
- Tour da casa pronta (deck, piso, pintura, banheiro) com as minhas falas inteiras. Corte o que for repetido; alvo de 45 a 60 s.
- Perto do fim, 3 cartões entrando um de cada vez (0,4 s de intervalo), sobre a imagem mais bonita da casa pronta:
  "COMPRA" US$ 48.000 / "REFORMA" US$ 38.000 / "VENDA" US$ 135.000
  + aviso: "Valores reais deste caso. Resultados passados não garantem resultados futuros. Todo investimento envolve risco." Sem a palavra "lucro" e sem fazer a conta.
- Final: painel verde com "SÓ 2 VAGAS NA ASSESSORIA", "QUER FAZER O MESMO COM A GENTE?" e a pílula "Comente ASSESSORIA 👇", depois o logo-reveal.
- Sem endereço, número da casa ou placa (desfoque).
Salve como casa-5-vendemos.mp4 na pasta "Reels Semana Vendas" até sábado 31/10.
```

## ATUALIZAÇÃO 29/10: pedido do Alessandro depois de rever o casa-1 (vale para as casas 1 a 5)
```
AJUSTES NOVOS NOS REELS casa-1 a casa-5 (substituem o que for diferente no prompt anterior)

O Alessandro reviu o casa-1. O roteiro e o Bruno aparecendo estão ótimos: NÃO mude a história nem as falas. Mude só isto:

1. SEM CAIXA VERDE: tire TODOS os retângulos verdes atrás dos textos ("Lance inicial", "Valor de mercado", "Vale a pena?", final). Eles tapam a casa.
   Novo estilo: texto direto sobre a imagem, sem caixa. Para ler bem, use um degradê escuro suave só na faixa onde o texto fica (preto de 0% a 40%) e uma sombra leve (0 2px 12px preto 50%).
   - Número em Montserrat ExtraBold, dourado #F2C14E, grande (~120 px); o rótulo ("Lance inicial", "Valor de mercado") em Montserrat Bold branco, ~44 px, logo acima.
   - Coloque os números sobre o CÉU ou o CHÃO, nunca em cima da casa nem do rosto.

2. IMAGENS MELHORES DA CASA: quando os números aparecerem, use o melhor ângulo da casa disponível nos vídeos dessa visita (fachada inteira, de frente, com a casa ocupando bem a tela). Procure outros ângulos no material bruto; troque os planos em que a casa aparece cortada ou de lado.

3. FONTE: Montserrat em tudo (ExtraBold nos títulos e na legenda, Bold nas etiquetas). Nada de Arial ou da fonte atual.

4. LEGENDA: estilo karaokê, até 3 palavras, palavra falada em dourado, sem caixa atrás.

5. AVISO DE RISCO: só junto dos números e nos 5 s finais (hoje está o vídeo todo).

6. FINAL ("Vale a pena?" e "Quer que a gente encontre…"): sem caixa verde e NUNCA em cima do rosto do Bruno. Hoje cobre o rosto dele de 34 s a 43 s. Coloque o texto na parte de baixo (acima de y=1560) com o degradê, e a pílula dourada "Comente ASSESSORIA 👇".

Salve como casa-N-nova-york-v2.mp4 (e casa-5-vendemos-v2.mp4). Prazo: sexta 30/10. Mostre 3 prints do casa-1-v2 primeiro (números, meio com legenda e final).
```

## casa-5-vendemos: correções depois da análise de 29/10
```
CORREÇÕES DO casa-5-vendemos.mp4 (salvar como casa-5-vendemos-v2.mp4)

A história está ótima (o Alessandro falando "Vendemos!", o tour e os valores). Mantenha as falas e a ordem. Corrija:

1. FONTE: hoje está em Alumni Sans, caixa alta. Troque tudo por Montserrat (ExtraBold na legenda e nos títulos, Bold nas etiquetas), em letras normais. A legenda continua no estilo karaokê (palavra falada em dourado).
2. GANCHO (0 a 2 s): "Vendemos! 🎉" está em cima do telhado da casa e repete a legenda. Suba o título para o céu, maior, e não mostre a legenda "VENDEMOS!" ao mesmo tempo.
3. 14 a 16 s: o plano da rua vazia com a casa pequena lá no fundo é fraco. Troque por um plano da fachada de frente, mais perto.
4. DECK (21 a 27 s): o tronco da árvore ocupa a tela e o deck quase não aparece. Use os planos em que o deck aparece de perto e inteiro.
5. VALORES (48 a 52 s): tire as 3 caixas verdes, que ficam em cima da rua. Coloque os números SEM caixa (rótulo branco + valor dourado grande, com degradê suave e sombra leve), sobre a imagem mais bonita da casa pronta (sala com piso novo ou fachada), sem tapar a casa. Mantenha o aviso de risco junto.
6. FINAL (52 a 55 s): tire o painel verde da metade de baixo. Texto direto na imagem, com degradê: "Só 2 vagas na assessoria" (etiqueta), "Quer fazer o mesmo com a gente?" e a pílula dourada "Comente ASSESSORIA 👇".
7. LOGO NO FIM: troque pelo logo-reveal NOVO (6,5 s): https://raw.githubusercontent.com/tababog/binary-signals-app/claude/beautiful-hamilton-br5zyn/marketing/discoveryremodeling/designer/logo-reveal/logo-reveal-discovery-novo.mp4
8. Confira de novo: sem número da casa nem placa de rua (desfoque se aparecer).

Prazo: sexta 30/10 às 18h (vai ao ar sexta 06/11 às 12h). Mostre 3 prints: gancho, valores e final.
```

## Logo no final: vale para TODOS os vídeos (casas 1 a 5, Elkland, episódios da casa de Elmira)
Use o logo-reveal novo no lugar do antigo: https://raw.githubusercontent.com/tababog/binary-signals-app/claude/beautiful-hamilton-br5zyn/marketing/discoveryremodeling/designer/logo-reveal/logo-reveal-discovery-novo.mp4

## casa-2-nova-york-v2: correções depois da análise de 29/10 (salvar como casa-2-nova-york-v3.mp4)
```
CORREÇÕES DO casa-2-nova-york-v2.mp4 → salvar como casa-2-nova-york-v3.mp4

1. VALORES ERRADOS (urgente): o vídeo mostra "Lance inicial US$ 60.000" e "~US$ 140.000". Os valores certos, passados pelo Alessandro, são:
   Lance inicial: US$ 6.500
   Valor de mercado na região: ~US$ 125.000
   Confira os dois números letra por letra antes de salvar.

2. LEGENDA SOBREPOSTA (quase o vídeo todo): dois blocos aparecem ao mesmo tempo, um em cima do outro (ex.: 10 s, "DEIXOU…" + "SEJA… VOCÊ"). Refaça a legenda do zero:
   - transcreva de novo com o tempo de cada palavra (whisper com word timestamps);
   - UM bloco por vez: o bloco seguinte só entra quando o anterior sai (sem sobreposição, nem por 1 quadro);
   - até 3 palavras por bloco, Montserrat ExtraBold, palavra falada em dourado;
   - antes de salvar, exporte 10 quadros aleatórios e confira que nenhum tem duas legendas.

3. TELA CHEIA: hoje o vídeo fica numa faixa no meio, com fundo borrado em cima e embaixo. Recorte para a tela inteira (9:16), seguindo a casa e as pessoas. Se em algum trecho o recorte cortar demais, use 4:5 grande no centro, nunca a faixa fina.

4. AVISO DE RISCO: hoje fica em cima da casa (2 a 6 s). Coloque embaixo, na área da legenda, só junto dos números e nos 5 s finais.

5. "VALE A PENA?" (31 a 35 s): o texto fica em cima da casa e some sem dar para ler. Coloque no céu ou embaixo, com 2 s inteiros na tela.

6. LOGO NO FIM: troque pelo logo-reveal NOVO: https://raw.githubusercontent.com/tababog/binary-signals-app/claude/beautiful-hamilton-br5zyn/marketing/discoveryremodeling/designer/logo-reveal/logo-reveal-discovery-novo.mp4

7. VALE PARA AS OUTRAS CASAS: confira nas casas 1, 3, 4 e 5 a legenda sobreposta e os valores. Valores certos: casa-1 US$ 14.000 / ~US$ 320.000 · casa-2 US$ 6.500 / ~US$ 125.000 · casa-3 US$ 5.000 / ~US$ 110.000 · casa-4 US$ 3.500 / ~US$ 125.000 · casa-5 compra US$ 48.000, reforma US$ 38.000, venda US$ 135.000.

Mostre 3 prints (números, meio com legenda e final). Prazo: sexta 30/10 às 18h.
```
