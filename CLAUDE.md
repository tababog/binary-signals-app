# CLAUDE.md

## Marca nas peças de leilão

**Regra: toda peça — vídeo ou imagem — que trate de leilões de imóveis leva a
logomarca da Discovery Remodeling.** Sem exceção, em qualquer formato (Reels
9:16, carrossel 4:5, Stories 9:16, post 1:1).

Isso cobre: slides de calendário de leilões, Reels de casas, cartelas de alerta,
checklists, capas e qualquer arte derivada desse material.

### Arquivo da marca

    assets/discovery-logo.png

PNG com fundo transparente, lado maior ≥ 512 px. Se só existir versão com fundo
branco, a logo entra dentro de um selo branco de cantos arredondados — nunca
colada como quadrado branco sobre a imagem.

Se o arquivo não estiver nesse caminho, **peça o arquivo ao usuário. Não
redesenhe nem aproxime a marca.** Logo aproximada é logo errada.

### Posicionamento

| | |
|---|---|
| Canto | superior direito |
| Margem | 56 px das bordas |
| Altura | 96 px no 9:16 (1080×1920), 84 px no 4:5 (1080×1350) |
| Alinhamento | base alinhada com o selo amarelo de período, que fica à esquerda |

O canto superior direito é o único livre: a esquerda tem o selo de período, a
base tem a tarja de dados, e no Reels a coluna de ícones do Instagram ocupa a
direita **inferior**.

Sobre fundo escuro ou foto, usar a versão branca (knockout). Sobre fundo claro
(creme, amarelo), usar a versão original em verde.

### Animação, quando for vídeo

A logo entra junto com o selo de período — fade mais deslocamento de 26 px para
baixo, entre 0,18 s e 0,63 s — e permanece até o fim, inclusive durante o CTA.
Nunca pisca nem sai.

## Conteúdo de leilão: precisão antes de publicar

Peça publicada é pública. Antes de colocar data em arte:

- Conferir o dia da semana contra o calendário do ano. É o teste que pega data
  reciclada de edição anterior.
- Marcar o grau de confiança de cada dado e dizer ao usuário o que não foi
  confirmado em fonte independente.
- Nunca inventar horário, tipo de leilão ou prazo de inscrição. Sem o dado,
  usar rótulo genérico e avisar.

Os sites dos condados e os agregadores de leilão (`susqco.com`,
`venangocountypa.gov`, `aarauctions.com`, `auctionsinternational.com`) estão
bloqueados pela política de rede deste ambiente. Quando precisar deles, peça ao
usuário que cole o conteúdo.

## Ferramentas desta máquina

- `python3` é 3.11; **o Playwright está no `python3.13`**. Usar `python3.13`
  para qualquer script que importe playwright.
- Chromium em `/opt/pw-browsers/chromium`. Não rodar `playwright install`.
- Fonte **Inter** e **Inter Display** instaladas localmente — não depender do
  Google Fonts, que o proxy pode bloquear.
- `ffmpeg` 6.1.1 com `overlay`, `tpad`, `gradients`, `boxblur`, libx264.
