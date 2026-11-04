import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { exigirUsuario } from "@/lib/auth";
import { data } from "@/lib/format";
import { Cabecalho, Campo, Vazio } from "@/components/ui";
import { Formulario } from "@/components/Formulario";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { FotoRecibo } from "@/components/FotoRecibo";
import { enviarRecibo } from "./actions";
import { getT } from "@/i18n/servidor";

// Tela do funcionário que compra material: só as obras em aberto e os recibos dele. Nenhum valor aparece aqui.
export default async function Recibos() {
  const usuario = await exigirUsuario();
  if (usuario.papel !== "ADMIN" && !usuario.podeEnviarRecibos) redirect("/ponto");
  const t = getT();
  const [obras, meus] = await Promise.all([
    db.obra.findMany({ where: { status: { in: ["EM_ANDAMENTO", "PLANEJADA", "PAUSADA"] } }, orderBy: [{ status: "asc" }, { nome: "asc" }], select: { id: true, nome: true } }),
    db.reciboFuncionario.findMany({ where: { usuarioId: usuario.id }, include: { obra: { select: { nome: true } } }, orderBy: { criadoEm: "desc" }, take: 15 }),
  ]);

  return (
    <>
      <Cabecalho titulo={t("Enviar recibo")} subtitulo={t("Tire a foto do recibo do material que você comprou e escolha a obra.")} />
      <div className="mx-auto max-w-md space-y-4">
        <div className="cartao">
          {obras.length === 0 ? (
            <Vazio>{t("Nenhuma obra ativa no momento. Fale com o administrador.")}</Vazio>
          ) : (
            <Formulario acao={enviarRecibo} limparAoSalvar>
              <Campo rotulo={t("Para qual obra?")}>
                <select className="campo text-lg" name="obraId" required defaultValue="">
                  <option value="" disabled>{t("Selecione...")}</option>
                  {obras.map((o) => <option key={o.id} value={o.id}>{o.nome}</option>)}
                </select>
              </Campo>
              <FotoRecibo rotulo={t("Foto do recibo *")} />
              <Campo rotulo={t("O que você comprou (opcional)")}>
                <input className="campo" name="descricao" placeholder={t("Ex.: 20 sacos de cimento CP-II")} />
              </Campo>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="pagoDoBolso" className="h-5 w-5" />
                <span>{t("Paguei com meu dinheiro (preciso de reembolso)")}</span>
              </label>
              <BotaoEnviar>{t("Enviar recibo")}</BotaoEnviar>
            </Formulario>
          )}
        </div>
        <div className="cartao">
          <h2 className="mb-2">{t("Meus recibos enviados")}</h2>
          {meus.length === 0 ? (
            <Vazio>{t("Nenhum recibo enviado ainda.")}</Vazio>
          ) : (
            <ul className="divide-y divide-stone-100 text-sm">
              {meus.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-2 py-2">
                  <span>
                    <b>{data(r.criadoEm)}</b> · {r.obra.nome}
                    {r.descricao && <span className="block text-stone-500">{r.descricao}</span>}
                  </span>
                  <span className={`selo ${r.lancadoEm ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                    {r.lancadoEm ? t("Recebido") : t("Enviado")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
