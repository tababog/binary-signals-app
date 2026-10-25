# Modelo das páginas de caixa por casa

`caixa-por-casa.html` é o molde das páginas "Caixa <casa>" publicadas como
artefato. Gerado da página **Caixa 1104 Agnew** em 25/10/2026, já com as
correções de envio de recibo pelo celular.

Substitui o antigo `modelo.html` que estava em
`Drive: Casa 1104 Agnew/recibos/painel-html/`. Aquele era de 18/10 e ficou
para trás: não tinha bloco de recibo, nem o cadeado dos investidores, nem a
aba Discovery. Não use mais.

## O que trocar em cada casa

| Marcador | Exemplo |
|---|---|
| `__TITULO__` | `Caixa 1104 Agnew` |
| `__ENDERECO__` | `1104 Agnew St, New Castle PA` |
| `__CIDADE_ESTADO__` | `New Castle, PA` (cabeçalho dos custos de closing) |
| `__PRECO__` | `110000` (preço inicial da simulação de venda) |
| `__PLANILHA__` | `1104 fluxo de caixa - NOVO.xlsx` |
| `__CHAVE_ABA__` | `aba1104` (chave do localStorage, única por casa) |
| `__CASA__` | `1104 Agnew` (vai no banco `senhas`) |
| `__LOGO__` | a logo em base64, de `assets/discovery-logo-original.jpg` |
| `__DADOS__` | o JSON que o `exportar.ps1` gera da planilha |
| `__CRIPTO__` | blocos cifrados dos investidores, ou `null` sem cadeado |
| `__CUSTOS__` | custos de closing do estado da casa |

`__CUSTOS__` muda por estado — PA e NY têm imposto de transferência
diferente. Não copie o de outra casa sem conferir.

## Capacidades que a página precisa no publish

    {"assets":{},
     "db":{"rules":[{"path":"recibos","read":"admin","write":"admin"},
                    {"path":"senhas","read":"admin","write":"admin"}]},
     "user":{}}

As duas regras ficam em `admin` de propósito: `recibos` recebe os anexos e
`senhas` guarda pedidos de troca de senha dos investidores. Abrir para
"qualquer um com o link" deixaria qualquer visitante ler pedidos de senha e
gravar recibo falso.

## Envio de recibo: três caminhos

Câmera (`capture="environment"`, foto nova), Galeria (sem `capture`, fotos
que já estão no celular) e PDF (`accept` separado). O `capture` obriga a
câmera no celular, e um `accept` misturando `image/*` com
`application/pdf` manda o seletor para Arquivos em vez de Fotos — foi esse
par que travou o envio pelo celular até 25/10/2026.

Quando a página abre sem permissão de dono, a barra de recibo aparece com um
aviso em vermelho dizendo o que falta, em vez de desaparecer calada.
