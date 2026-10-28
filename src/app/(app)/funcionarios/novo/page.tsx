import { exigirAdmin } from "@/lib/auth";
import { Cabecalho, Voltar } from "@/components/ui";
import { Formulario } from "@/components/Formulario";
import { CamposFuncionario } from "@/components/CamposFuncionario";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { criarFuncionario } from "../actions";
import { getT } from "@/i18n/servidor";

export default async function NovoFuncionario({ searchParams }: { searchParams: { vinculo?: string } }) {
  const helper = searchParams.vinculo === "HELPER";
  const t = getT();
  await exigirAdmin();
  return (
    <>
      <Voltar href="/funcionarios" rotulo={t("Equipe")} />
      <Cabecalho titulo={helper ? t("Novo helper") : t("Novo funcionário")} subtitulo={t("Deixe a senha em branco para enviar um link de convite pelo WhatsApp")} />
      <div className="cartao">
        <Formulario acao={criarFuncionario}>
          <CamposFuncionario novo vinculoInicial={helper ? "HELPER" : "FIXO"} />
          <BotaoEnviar>{t("Cadastrar")}</BotaoEnviar>
        </Formulario>
      </div>
    </>
  );
}
