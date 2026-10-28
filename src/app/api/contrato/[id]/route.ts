import { db } from "@/lib/db";
import { usuarioAtual } from "@/lib/auth";
import { getT } from "@/i18n/servidor";
import { descreverSubservicos, nomeTipoServico } from "@/lib/constantes";
import { rateioCustosFixos } from "@/lib/custos-fixos";
import { calcularOpcao } from "@/lib/orcamento";
import { dolaresPorExtenso } from "@/lib/contrato/extenso";
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
    include: { cliente: true, obra: true, opcoes: { include: { itens: { orderBy: { ordem: "asc" } } }, orderBy: { ordem: "asc" } } },
  });
  if (!orc) return new Response("Não encontrado", { status: 404 });
  const opcao = orc.opcoes.find((o) => o.id === opcaoId) ?? orc.opcoes[0];
  if (!opcao) return new Response("Orçamento sem opções", { status: 400 });

  const en = getT("en");
  const rateio = await rateioCustosFixos();
  const preco = calcularOpcao(opcao, rateio.porDiaPadrao).preco;
  const servico = orc.tipoServico ? en(nomeTipoServico(orc.tipoServico)) : "Home improvement";
  const detalhes = descreverSubservicos(orc.tipoServico, orc.subServicos, en);

  // Escopo: descrição da opção (em inglês, para o cliente) + materiais e serviços listados nela
  const itensEscopo = opcao.itens
    .filter((i) => ["MATERIAL", "INSTALACAO", "SERVICO", "EQUIPAMENTO", "DESCARTE", "LICENCA"].includes(i.categoria))
    .map((i) => `- ${i.descricao}${i.quantidade && i.unidade ? ` (${i.quantidade.toLocaleString("en-US")} ${i.unidade})` : ""}`);
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
    pagamento: "50% payable at the beginning of the work (at the end of the first day worked) and 50% upon completion of the work.",
    inicio: dataEUA(orc.obra?.dataInicio),
    termino: dataEUA(orc.obra?.dataPrevista),
  });

  const nome = `Contract - ${orc.cliente.nome} - ${opcao.nome}.pdf`.replace(/[^\w .-]/g, "");
  return new Response(Buffer.from(pdf), {
    headers: { "Content-Type": "application/pdf", "Content-Disposition": `inline; filename="${nome}"`, "Cache-Control": "no-store" },
  });
}
