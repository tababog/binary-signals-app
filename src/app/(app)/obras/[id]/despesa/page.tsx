import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { campoData } from "@/lib/format";
import { CATEGORIAS_DESPESA, FORMAS_PAGAMENTO } from "@/lib/constantes";
import { Cabecalho, Campo, Voltar } from "@/components/ui";
import { Formulario } from "@/components/Formulario";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { FotoRecibo } from "@/components/FotoRecibo";
import { lancarDespesa } from "../../actions";

export default async function NovaDespesa({ params }: { params: { id: string } }) {
  await exigirAdmin();
  const [obra, fornecedores] = await Promise.all([
    db.obra.findUnique({ where: { id: params.id } }),
    db.fornecedor.findMany({ orderBy: { nome: "asc" }, select: { id: true, nome: true, tipo: true } }),
  ]);
  if (!obra) notFound();

  return (
    <>
      <Voltar href={`/obras/${obra.id}?aba=caixa`} rotulo={obra.nome} />
      <Cabecalho titulo="Lançar despesa" subtitulo="A despesa entra direto no caixa desta obra" />
      <div className="cartao max-w-2xl">
        <Formulario acao={lancarDespesa.bind(null, obra.id)}>
          <FotoRecibo />
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo rotulo="Valor total *">
              <input className="campo text-lg" name="valor" inputMode="decimal" placeholder="0.00" required />
            </Campo>
            <Campo rotulo="Data da compra">
              <input className="campo" name="data" type="date" defaultValue={campoData(new Date())} />
            </Campo>
            <Campo rotulo="Categoria">
              <select className="campo" name="categoria" defaultValue="MATERIAL">
                {Object.entries(CATEGORIAS_DESPESA).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </Campo>
            <Campo rotulo="Fornecedor ou subcontratado">
              <select className="campo" name="fornecedorId" defaultValue="">
                <option value="">— Nenhum —</option>
                <optgroup label="Fornecedores">
                  {fornecedores.filter((f) => f.tipo !== "SUBCONTRATADO").map((f) => <option key={f.id} value={f.id}>{f.nome}</option>)}
                </optgroup>
                <optgroup label="Subcontratados">
                  {fornecedores.filter((f) => f.tipo === "SUBCONTRATADO").map((f) => <option key={f.id} value={f.id}>{f.nome}</option>)}
                </optgroup>
              </select>
            </Campo>
            <div className="sm:col-span-2">
              <Campo rotulo="O que foi comprado *">
                <input className="campo" name="descricao" placeholder="Ex.: 20 sacos de cimento CP-II" required />
              </Campo>
            </div>
            <Campo rotulo="Forma de pagamento">
              <select className="campo" name="formaPagamento" defaultValue="">
                <option value="">—</option>
                {FORMAS_PAGAMENTO.map((f) => <option key={f}>{f}</option>)}
              </select>
            </Campo>
          </div>
          <BotaoEnviar>Salvar despesa</BotaoEnviar>
        </Formulario>
      </div>
    </>
  );
}
