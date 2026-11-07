import { db } from "@/lib/db";
import { usuarioAtual } from "@/lib/auth";
import { getT } from "@/i18n/servidor";
import { descreverServicos, descreverSubservicos, nomesServicos, todosServicos } from "@/lib/constantes";
import { rateioCustosFixos } from "@/lib/custos-fixos";
import { calcularOpcao } from "@/lib/orcamento";
import { dolaresPorExtenso } from "@/lib/contrato/extenso";
import { CATEGORIAS_ESCOPO, PAGAMENTO_PADRAO, itemEscopo } from "@/lib/proposta";
import { dataEUA, gerarContratoPDF, maisDiasUteis } from "@/lib/contrato/gerar";

/**
 * Contrato em PDF (campos editáveis) para a opção escolhida do orçamento: cliente, endereço, escopo, preço,
 * forma de pagamento e prazos já preenchidos. Só administradores.
 */
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const usuario = await usuarioAtual();
  if (!usuario || usuario.papel !== "ADMIN") return new Response("Não autorizado", { status: 403 });

  const opcaoId = new URL(req.url).searchParams.get("opcao");
  const orc = await db.orcamento.findUnique({
    where: { id: params.id },
    include: { cliente: true, obra: true, propostas: { where: { resposta: "APROVADA" }, orderBy: { respondidaEm: "desc" }, take: 1 }, opcoes: { include: { itens: { orderBy: { ordem: "asc" } } }, orderBy: { ordem: "asc" } } },
  });
  if (!orc) return new Response("Não encontrado", { status: 404 });
  const opcao = orc.opcoes.find((o) => o.id === opcaoId) ?? orc.opcoes[0];
  if (!opcao) return new Response("Orçamento sem opções", { status: 400 });

  const en = getT("en");
  const rateio = await rateioCustosFixos();
  const preco = calcularOpcao(opcao, rateio.porDiaPadrao).preco;
  // Sem preço (nem definido, nem sugestão de mercado) o contrato sairia com $0
  if (preco <= 0) return new Response("Defina o preço desta opção antes de gerar o contrato.", { status: 400, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  const servico = orc.tipoServico ? nomesServicos(orc, en) : "Home improvement";
  const detalhes = todosServicos(orc).length > 1 ? descreverServicos(orc, en) : descreverSubservicos(orc.tipoServico, orc.subServicos, en);

  // Escopo: descrição da opção (em inglês, para o cliente) + materiais e serviços listados nela
  const itensEscopo = opcao.itens
    .filter((i) => CATEGORIAS_ESCOPO.includes(i.categoria))
    .map((i) => `- ${itemEscopo(i)}`);
  const escopo = [`${opcao.nome} option${opcao.descricao ? `: ${opcao.descricao}` : ""}`, ...itensEscopo].join("\n");

  const hoje = new Date();
  const pdf = await gerarContratoPDF({
    data: dataEUA(hoje),
    cancelarAte: dataEUA(maisDiasUteis(hoje, 3)),
    cliente: {
      nome: orc.cliente.nome,
      endereco: orc.endereco ?? orc.cliente.endereco ?? "",
      contato: [orc.cliente.telefone, orc.cliente.email].filter(Boolean).join("  ·  "),
    },
    projeto: `${servico}${detalhes ? ` (${detalhes})` : ""}${orc.cidade ? ` - ${orc.cidade}, CT` : ""}`,
    escopo,
    naoIncluso: "",
    precoCent: preco,
    precoExtenso: dolaresPorExtenso(preco),
    // A forma de pagamento que o cliente aprovou na proposta; sem proposta aprovada, a padrão
    pagamento: orc.propostas[0]?.pagamento ?? PAGAMENTO_PADRAO,
    inicio: dataEUA(orc.obra?.dataInicio),
    termino: dataEUA(orc.obra?.dataPrevista),
  });

  const nome = `Contract - ${orc.cliente.nome} - ${opcao.nome}.pdf`.replace(/[^\w .-]/g, "");
  return new Response(Buffer.from(pdf), {
    headers: { "Content-Type": "application/pdf", "Content-Disposition": `inline; filename="${nome}"`, "Cache-Control": "no-store" },
  });
}
