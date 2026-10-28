import Link from "next/link";
import { exigirUsuario } from "@/lib/auth";
import { sair } from "@/app/login/actions";
import { Menu } from "@/components/Menu";
import { SeletorIdioma } from "@/components/SeletorIdioma";
import { getT } from "@/i18n/servidor";

export default async function LayoutApp({ children }: { children: React.ReactNode }) {
  const usuario = await exigirUsuario();
  const admin = usuario.papel === "ADMIN";
  const t = getT();

  const itens = admin
    ? [
        { href: "/", rotulo: t("Painel") },
        { href: "/obras", rotulo: t("Obras") },
        { href: "/visitas", rotulo: t("Visitas") },
        { href: "/orcamentos", rotulo: t("Orçamentos") },
        { href: "/clientes", rotulo: t("Clientes") },
        { href: "/fornecedores", rotulo: t("Fornecedores") },
        { href: "/subcontratados", rotulo: t("Subcontratados") },
        { href: "/funcionarios", rotulo: t("Equipe") },
        { href: "/registros", rotulo: t("Horas") },
        { href: "/precos", rotulo: t("Preços") },
        { href: "/empresa", rotulo: t("Empresa") },
        { href: "/ponto", rotulo: t("Meu ponto") },
      ]
    : [{ href: "/ponto", rotulo: t("Meu ponto") }];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <Link href={admin ? "/" : "/ponto"} className="flex items-center gap-2 font-bold">
            <img src="/logo.svg" alt="Tababog Construction LLC" className="h-10 w-10" />
            <span>Tababog</span>
          </Link>
          <Menu itens={itens} />
          <div className="ml-auto flex items-center gap-3 text-sm">
            <SeletorIdioma />
            <Link href="/conta" className={`text-stone-600 hover:underline ${admin ? "hidden sm:inline" : ""}`}>
              {usuario.nome}
            </Link>
            <form action={sair}>
              <button className="text-stone-500 hover:text-stone-900">{t("Sair")}</button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-4 pb-16">{children}</main>
    </div>
  );
}
