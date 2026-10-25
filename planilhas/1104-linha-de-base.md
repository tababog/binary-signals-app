# Linha de base — 1104 fluxo de caixa

Lido do `.xlsx` oficial em 25/10/2026, antes de qualquer conversão para
Planilha Google. Serve para julgar a conversão: a Planilha Google tem de
reproduzir **todos** estes números. Qualquer divergência é defeito da
conversão, não "arredondamento".

Arquivo: `1104 fluxo de caixa - NOVO.xlsx`
(Drive: `Isaques - Discovery / Casa 1104 Agnew / 03 Financeiro - Planilha e Projeção`)
Id: `1xcLjSZ_JVMPBfnh_ruyN3yijfiZ7ZB8U` · modificado 20/10/2026

## Resumo — os seis números do topo

| Campo | Célula | Valor |
|---|---|---|
| Saldo inicial | C3 | $0,00 |
| Entrou | E4 | $30.807,29 |
| Saiu | G4 | $52.070,75 |
| Saldo em caixa hoje | I4 | −$21.263,46 |
| Saldo projetado em Feb/27 | K4 | −$32.137,18 |
| Taxas Discovery | M4 | $4.625,00 |

## Saldo acumulado, mês a mês

| Mês | Entradas | Saídas | Acumulado |
|---|---|---|---|
| Apr/26 | 30.807,29 | 30.504,16 | 303,13 |
| May/26 | 0 | 93,43 | 209,70 |
| Jun/26 | 0 | 93,43 | 116,27 |
| Jul/26 | 0 | 93,43 | 22,84 |
| Aug/26 | 0 | 910,85 | −888,01 |
| Sep/26 | 0 | 4.568,43 | −5.456,44 |
| Oct/26 | 0 | 15.807,02 | −21.263,46 |

## Por grupo

| Grupo | Tipo | Total |
|---|---|---|
| Entradas | Entrada | 30.807,29 |
| Taxas Discovery | Discovery | 4.625,00 |
| Aquisição | Saída | 32.379,16 |
| Reforma | Saída | 17.922,65 |
| Custos fixos | Saída | 992,35 |
| Viagem | Saída | 456,59 |
| Pessoas | Saída | 300,00 |
| Outros | Saída | 20,00 |

## Por categoria — só as que têm valor

| Categoria | Total | Nº lanç. |
|---|---|---|
| Entrada de Investidores | 30.807,29 | 4 |
| Taxa de Servico de Arremate | 4.625,00 | 4 |
| COMPRA DA CASA | 30.429,16 | 1 |
| TITLE | 1.950,00 | 1 |
| EXTERIOR/TRIMS/PINTURA | 300,00 | 4 |
| BANHEIRO | 2.364,73 | 7 |
| COZINHA | 1.722,37 | 3 |
| DRYWALL | 1.853,26 | 5 |
| PORTAS | 84,00 | 2 |
| PISO | 2.367,45 | 1 |
| PINTURA INTERNA | 1.142,21 | 3 |
| LIMPEZA INICIAL | 300,00 | 1 |
| APPLIANCES | 3.788,63 | 1 |
| MAO DE OBRA - REFORMA GERAL | 4.000,00 | 1 |
| SEGURO MENSAL | 560,58 | 6 |
| IMPOSTO | 141,77 | 1 |
| AGUA | 30,00 | 1 |
| ENERGIA/GAS | 260,00 | 1 |
| ALIMENTACAO | 48,54 | 3 |
| GASOLINA | 408,05 | 4 |
| ALE | 300,00 | 2 |
| OUTROS | 20,00 | 1 |

Soma das saídas por categoria: 52.070,75 — fecha com G4.
Soma das entradas: 30.807,29 — fecha com E4.
Taxas Discovery ficam fora do caixa: 4.625,00 não entra em nenhuma das duas.

## Projeção — Nov/26 a Feb/27

| Linha | Nov/26 | Dec/26 | Jan/27 | Feb/27 | Total |
|---|---|---|---|---|---|
| Material restante da reforma | 2.800,00 | 0 | 0 | 0 | 2.800,00 |
| Mão de obra (Dante) | 1.000,00 | 5.000,00 | 0 | 0 | 6.000,00 |
| Água | 50,00 | 50,00 | 50,00 | 50,00 | 200,00 |
| Energia e gás | 225,00 | 225,00 | 225,00 | 225,00 | 900,00 |
| Seguro | 93,43 | 93,43 | 93,43 | 93,43 | 373,72 |
| Imposto | 150,00 | 150,00 | 150,00 | 150,00 | 600,00 |
| **Total saídas previstas** | 4.318,43 | 5.518,43 | 518,43 | 518,43 | 10.873,72 |
| **Saldo projetado (fim do mês)** | −25.581,89 | −31.100,32 | −31.618,75 | −32.137,18 | |

Precisa de aporte até o fim do período: **32.137,18**

Taxa de reforma (10% das despesas sem a compra), linha Discovery da projeção:
2.596,00 / 551,84 / 51,84 / 51,84 = **3.251,52**. Essa linha não entra no
caixa dos investidores e por isso **não** aparece na projeção pública da
página — ela vive no bloco cifrado. Não confundir com divergência.

## Armadilhas da conversão

1. **`tblLanc` e `tblCat`** são tabelas nomeadas do Excel. Em Planilhas
   Google isso não existe igual: viram intervalos. Toda fórmula que usa
   referência estruturada (`tblLanc[Valor]`) precisa virar referência de
   intervalo, e a tabela não cresce mais sozinha ao digitar embaixo.
2. **O Resumo é todo automático** e o `exportar.ps1` lê célula fixa:
   `C3`, `E4`, `G4`, `I4`, `K3`, `K4`, `M4`, linhas 6/7/8/10 das colunas
   C..N, e varre `A12:A60` procurando `Item` e `Precisa de aporte`. Se a
   conversão deslocar uma linha, o export quebra calado.
3. **Três categorias lixo** — `A/S/S`, `S/a/í`, `O/u/t` — são restos de uma
   célula partida em letras. Já estão na planilha hoje com total zero.
   Aproveitar a conversão para apagar.
4. **Linhas com Obs** são de conferência manual (data que faltava,
   "fogao" escrito no lugar do dia). Não perder a coluna Obs.
5. A aba **Orçamento por área** está vazia, com a conferência
   "material da projeção − material desta aba = 2.800,00". Vazia é o
   estado atual, não erro de conversão.
