import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { data, dinheiro } from "@/lib/format";
import { Cabecalho, Campo, Vazio, Voltar } from "@/components/ui";
import { Formulario } from "@/components/Formulario";
import { CamposContato } from "@/components/CamposContato";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { excluirFornecedor, salvarFornecedor } from "../actions";

export default async function Fornecedor({ params }: { params: { id: string } }) {
  await exigirAdmin();
  const fornecedor = await db.fornecedor.findUnique({
    where: { id: params.id },
    include: { lancamentos: { include: { obra: true }, orderBy: { data: "desc" }, take: 50 } },
  });
  if (!fornecedor) notFound();
  const total = await db.lancamento.aggregate({ where: { fornecedorId: fornecedor.id, tipo: "SAIDA" }, _sum: { valorCent: true } });

  return (
    <>
      <Voltar href="/fornecedores" rotulo="Fornecedores" />
      <Cabecalho titulo={fornecedor.nome} subtitulo={`Total comprado: ${dinheiro(total._sum.valorCent ?? 0)}`} />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="cartao">
          <h2 className="mb-3">Dados do fornecedor</h2>
          <Formulario acao={salvarFornecedor.bind(null, fornecedor.id)}>
            <CamposContato valor={fornecedor} rotuloDocumento="CNPJ / CPF" />
            <Campo rotulo="Categoria">
              <input className="campo" name="categoria" defaultValue={fornecedor.categoria ?? ""} />
            </Campo>
            <BotaoEnviar>Salvar alterações</BotaoEnviar>
          </Formulario>
        </div>

        <div className="space-y-4">
          <div className="cartao overflow-x-auto">
            <h2 className="mb-3">Últimas compras</h2>
            {fornecedor.lancamentos.length === 0 ? (
              <Vazio>Nenhuma compra registrada.</Vazio>
            ) : (
              <table className="tabela">
                <thead><tr><th>Data</th><th>Obra</th><th>Descrição</th><th className="text-right">Valor</th></tr></thead>
                <tbody>
                  {fornecedor.lancamentos.map((l) => (
                    <tr key={l.id}>
                      <td>{data(l.data)}</td>
                      <td><Link href={`/obras/${l.obraId}`} className="link">{l.obra.nome}</Link></td>
                      <td>{l.descricao}</td>
                      <td className="text-right tabular-nums">{dinheiro(l.valorCent)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <form action={excluirFornecedor.bind(null, fornecedor.id)}>
            <BotaoEnviar className="botao-perigo" confirmar="Excluir este fornecedor? As compras continuam nas obras, sem o fornecedor.">
              Excluir fornecedor
            </BotaoEnviar>
          </form>
        </div>
      </div>
    </>
  );
}
