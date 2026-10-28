import { exigirAdmin } from "@/lib/auth";
import { Cabecalho, Voltar } from "@/components/ui";
import { Formulario } from "@/components/Formulario";
import { CamposContato } from "@/components/CamposContato";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { salvarCliente } from "../actions";
import { getT } from "@/i18n/servidor";

export default async function NovoCliente() {
  await exigirAdmin();
  const t = getT();
  return (
    <>
      <Voltar href="/clientes" rotulo={t("Clientes")} />
      <Cabecalho titulo={t("Cliente novo")} />
      <div className="cartao">
        <Formulario acao={salvarCliente.bind(null, null)}>
          <CamposContato />
          <BotaoEnviar>{t("Salvar cliente")}</BotaoEnviar>
        </Formulario>
      </div>
    </>
  );
}
