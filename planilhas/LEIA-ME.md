
---

# Lançamento sem o PC — `lancar-recibos.gs`

Apps Script preso à Planilha Google de cada casa. Substitui o
`lancar-recibos.ps1`, que abria o Excel por COM e por isso só rodava no
Windows com a planilha fechada.

## Instalação, uma vez por casa

1. Abra a Planilha Google da casa → **Extensões → Apps Script**
2. Cole o conteúdo de `lancar-recibos.gs`, apagando o `Código.gs` vazio
3. Ajuste o bloco `CFG` no topo: `casa`, `idNovos`, `idLancados`
4. Salve, recarregue a planilha → aparece o menu **Recibos**
5. **Recibos → Instalar gatilho diário (22h)** e autorize quando pedir

Pronto. A partir daí roda nos servidores do Google.

## Fluxo

| Onde | O quê |
|---|---|
| Celular | foto para `recibos/novos` pelo app do Drive |
| Celular ou PC | linha na aba **A LANCAR**: Data, Categoria, Descrição, Valor, Obs, Foto |
| Google, às 22h | valida, lança, arquiva a foto, põe o link na coluna Recibo |
| A qualquer hora | menu **Recibos → Lançar o que está em A LANCAR** |

A aba `A LANCAR` precisa deste cabeçalho, nesta ordem:

    Data | Categoria | Descrição | Valor | Obs | Foto | Situação

## O que ele recusa, e o que faz com a linha

Recusa data que não é data, valor ≤ 0, categoria que não existe na aba
Categorias, foto que não está em `recibos/novos`, e data+valor iguais a um
lançamento que já existe. Em todos os casos **não escreve nada** e grava o
motivo na coluna Situação. Nada de linha pela metade.

Acha a foto antes de escrever a linha, de propósito: se a foto não estiver
lá, a linha não entra.

No fim, se alguma linha parou, manda e-mail para o dono da planilha.

## Um ponto de atenção na conversão

Na aba Lançamentos, as colunas **Mês**, **Grupo** e **Tipo** são
automáticas no Excel porque `tblLanc` é tabela nomeada e estende a fórmula
sozinha. Planilha Google não faz isso. Resolva com `ARRAYFORMULA` no topo
de cada uma dessas três colunas. O script detecta: se achar fórmula na
célula, não encosta; se não achar, preenche o valor na mão para a linha não
ficar vazia. Os dois caminhos funcionam, mas `ARRAYFORMULA` é o certo.
