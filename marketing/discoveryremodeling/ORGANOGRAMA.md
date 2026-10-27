# Organograma: Instagram @discoveryremodeling

```
                    ┌──────────────────────────────┐
                    │  ALESSANDRO (dono e rosto)   │
                    │  aprova a semana · grava     │
                    │  · atende direct e WhatsApp  │
                    └──────────────┬───────────────┘
                                   │
                    ┌──────────────▼───────────────┐
                    │ CLAUDE GERENTE (esta conversa)│
                    │ planeja · cria artes · legendas│
                    │ · publica · responde comentários│
                    │ · guarda tudo no manual        │
                    └───┬──────────┬──────────┬─────┘
                        │          │          │
        ┌───────────────▼──┐ ┌─────▼────────┐ ┌▼──────────────────────┐
        │ AGENTE DE PESQUISA│ │ EDITOR DE    │ │ ESTÚDIO DE IMAGEM     │
        │ (rotina semanal,  │ │ VÍDEO        │ │ (conversa nova com     │
        │  sexta 8h54)      │ │ (Claude do   │ │  Nano Banana / Gemini) │
        │ concorrentes →    │ │  notebook)   │ │ "expectativa", fotos   │
        │ relatório e ideias│ │ Reels e      │ │                        │
        └───────────────────┘ │ stories v2   │ └────────────────────────┘
                              └──────────────┘
```

## Quem faz o quê
| Papel | Quem | O que faz | Quando |
|---|---|---|---|
| Dono | Alessandro | Aprova a semana, grava os vídeos com o rosto, atende direct e WhatsApp, fecha a venda | Semana de gravação + todo dia no direct |
| Gerente | Claude (esta conversa) | Planeja a semana, cria artes e legendas, escreve os prompts do editor, publica, responde GUIA e ASSESSORIA, faz o resumo diário, atualiza o manual | Todo dia |
| Agente de pesquisa | Rotina "Agente de pesquisa de concorrentes" | Lê os 6 concorrentes na Windsor, monta o ranking da semana e as ideias para modelar, salva em `inteligencia-concorrentes/` | Toda sexta, 8h54 (Brasília) |
| Editor de vídeo | Claude do notebook | Edita Reels e stories a partir dos prompts e salva os v2 no Drive | Quando recebe o prompt |
| Designer / Estúdio de imagem | Claude numa conversa nova (com GEMINI_API_KEY) | Gera imagens de "expectativa" com o Nano Banana | Quando precisar |

## Ciclo semanal
| Dia | O que acontece |
|---|---|
| **Sexta** | O agente de pesquisa entrega o relatório dos concorrentes |
| **Sexta/sábado** | O gerente monta a pauta da semana seguinte (com base no relatório) e o roteiro de gravação |
| **Sábado/domingo** | O Alessandro aprova a pauta e grava os vídeos com o rosto |
| **Domingo** | O editor (notebook) edita; o gerente confere e coloca na agenda automática |
| **Segunda a domingo** | Publicação automática + comentários + resumo diário |

## Onde fica cada coisa
- Regras e preferências: `REGRAS-DISCOVERY.md`
- Relatórios dos concorrentes: `inteligencia-concorrentes/`
- Agenda da semana: `agenda-semana-automatica.md` e painel fixado no claude.ai
- Vídeos: Google Drive, pasta "Isaques - Discovery"


## Designer (desde 27/10)
Cuida de todas as artes estáticas (carrosséis, frases e stories) no padrão visual do manual (seção 1): layouts alternados, fotos reais nítidas, Alumni Sans + Work Sans. Ferramentas: gerador HTML em `designer/` e Adobe Express para edição.
