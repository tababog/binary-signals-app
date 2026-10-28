import Link from "next/link";

export function Cabecalho({ titulo, subtitulo, children }: { titulo: string; subtitulo?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1>{titulo}</h1>
        {subtitulo && <div className="text-sm text-stone-500">{subtitulo}</div>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

export function Voltar({ href, rotulo = "Voltar" }: { href: string; rotulo?: string }) {
  return (
    <Link href={href} className="mb-2 inline-block text-sm text-stone-500 hover:underline">
      ← {rotulo}
    </Link>
  );
}

export function Indicador({ rotulo, valor, tom = "neutro", detalhe }: { rotulo: string; valor: string; tom?: "neutro" | "bom" | "ruim"; detalhe?: string }) {
  const cor = tom === "bom" ? "text-emerald-700" : tom === "ruim" ? "text-red-700" : "text-stone-900";
  return (
    <div className="cartao">
      <div className="text-xs font-medium uppercase tracking-wide text-stone-500">{rotulo}</div>
      <div className={`mt-1 text-xl font-bold tabular-nums ${cor}`}>{valor}</div>
      {detalhe && <div className="mt-0.5 text-xs text-stone-500">{detalhe}</div>}
    </div>
  );
}

export function Vazio({ children }: { children: React.ReactNode }) {
  return <p className="py-6 text-center text-sm text-stone-500">{children}</p>;
}

export function Campo({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="rotulo">{rotulo}</span>
      {children}
    </label>
  );
}

const CORES_STATUS: Record<string, string> = {
  PLANEJADA: "bg-sky-100 text-sky-800",
  EM_ANDAMENTO: "bg-amber-100 text-amber-800",
  PAUSADA: "bg-stone-200 text-stone-700",
  CONCLUIDA: "bg-emerald-100 text-emerald-800",
};

export function SeloStatus({ status, rotulo }: { status: string; rotulo: string }) {
  return <span className={`selo ${CORES_STATUS[status] ?? "bg-stone-100"}`}>{rotulo}</span>;
}
