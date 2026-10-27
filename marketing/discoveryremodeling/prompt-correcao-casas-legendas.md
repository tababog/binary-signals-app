# Prompt para o Claude do notebook: correção das casas 1 a 4 (legendas e títulos no padrão novo)

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
