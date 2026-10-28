import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { data, dinheiro } from "@/lib/format";
import { Cabecalho, Vazio, Voltar } from "@/components/ui";
import { Formulario } from "@/components/Formulario";
import { CamposFornecedor } from "@/components/CamposFornecedor";
import { SeloSeguro } from "@/components/SeloSeguro";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { excluirFornecedor, salvarFornecedor } from "../actions";

export default async function Fornecedor({ params }: { params: { id: string } }) {
  await exigirAdmin();
  const fornecedor = await db.fornecedor.findUnique({
    where: { id: params.id },
    include: { lancamentos: { include: { obra: true }, orderBy: { data: "desc" }, take: 50 } },
  });
  if (!fornecedor) notFound();
  const sub = fornecedor.tipo === "SUBCONTRATADO";
  const total = await db.lancamento.aggregate({ where: { fornecedorId: fornecedor.id, tipo: "SAIDA" }, _sum: { valorCent: true } });

  return (
    <>
      <Voltar href={sub ? "/subcontratados" : "/fornecedores"} rotulo={sub ? "Subcontratados" : "Fornecedores"} />
      <Cabecalho
        titulo={fornecedor.nome}
        subtitulo={
          <span className="flex flex-wrap items-center gap-2">
            {sub ? "Subcontratado" : "Fornecedor"}
            {fornecedor.categoria && ` · ${fornecedor.categoria}`} · {sub ? "Total pago" : "Total comprado"}: {dinheiro(total._sum.valorCent ?? 0)}
            {sub && <SeloSeguro validade={fornecedor.seguroValidade} />}
          </span>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="cartao">
          <h2 className="mb-3">Dados</h2>
          <Formulario acao={salvarFornecedor.bind(null, fornecedor.id)}>
            <CamposFornecedor valor={fornecedor} />
            <BotaoEnviar>Salvar alterações</BotaoEnviar>
          </Formulario>
        </div>

        <div className="space-y-4">
          <div className="cartao overflow-x-auto">
            <h2 className="mb-3">{sub ? "Últimos pagamentos" : "Últimas compras"}</h2>
            {fornecedor.lancamentos.length === 0 ? (
              <Vazio>{sub ? "Nenhum pagamento registrado." : "Nenhuma compra registrada."}</Vazio>
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
            <BotaoEnviar className="botao-perigo" confirmar="Excluir este cadastro? Os lançamentos continuam nas obras, sem o vínculo.">
              Excluir cadastro
            </BotaoEnviar>
          </form>
        </div>
      </div>
    </>
  );
}
