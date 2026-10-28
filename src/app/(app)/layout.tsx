import Link from "next/link";
import { exigirUsuario } from "@/lib/auth";
import { sair } from "@/app/login/actions";
import { Menu } from "@/components/Menu";

export default async function LayoutApp({ children }: { children: React.ReactNode }) {
  const usuario = await exigirUsuario();
  const admin = usuario.papel === "ADMIN";

  const itens = admin
    ? [
        { href: "/", rotulo: "Painel" },
        { href: "/obras", rotulo: "Obras" },
        { href: "/clientes", rotulo: "Clientes" },
        { href: "/fornecedores", rotulo: "Fornecedores" },
        { href: "/funcionarios", rotulo: "Funcionários" },
        { href: "/registros", rotulo: "Horas" },
        { href: "/empresa", rotulo: "Empresa" },
        { href: "/ponto", rotulo: "Meu ponto" },
      ]
    : [{ href: "/ponto", rotulo: "Meu ponto" }];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <Link href={admin ? "/" : "/ponto"} className="flex items-center gap-2 font-bold">
            <img src="/icon.svg" alt="" className="h-8 w-8" />
            <span>Tababog</span>
          </Link>
          <Menu itens={itens} />
          <div className="ml-auto flex items-center gap-3 text-sm">
            <Link href="/conta" className={`text-stone-600 hover:underline ${admin ? "hidden sm:inline" : ""}`}>
              {usuario.nome}
            </Link>
            <form action={sair}>
              <button className="text-stone-500 hover:text-stone-900">Sair</button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-4 pb-16">{children}</main>
    </div>
  );
}
