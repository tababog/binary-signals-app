/* eslint-disable @next/next/no-img-element */
import { EMPRESA } from "@/lib/empresa";
import { PORTFOLIO, fotoPortfolio } from "@/lib/portfolio";

/** Portfólio da Tababog para o cliente (sempre em inglês, regra 9). Usado na proposta (/p/[token]) e em /portfolio. */
export function Portfolio() {
  const p = PORTFOLIO;
  return (
    <div className="bg-white text-stone-900">
      <header className="bg-logo text-white">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3">
          <img src="/logo.svg" alt="" className="h-11 w-11" />
          <div>
            <div className="font-bold tracking-wide">TABABOG CONSTRUCTION LLC</div>
            <div className="text-xs opacity-80">Bridgeport · Serving all of Connecticut</div>
          </div>
        </div>
      </header>

      <div className="relative h-[340px] bg-stone-800 bg-cover sm:h-[420px]" style={{ backgroundImage: `url(${p.capa})`, backgroundPosition: "center 65%" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-[#0a1937]/85" />
        <div className="absolute inset-x-0 bottom-7 mx-auto max-w-4xl px-4 text-white">
          <h1 className="text-balance text-[26px] font-bold leading-tight sm:text-[32px]">{p.titulo}</h1>
          <p className="mt-1 opacity-90">{p.subtitulo}</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4">
        <div className="grid grid-cols-2 gap-3 border-b border-stone-200 py-5 sm:grid-cols-4">
          {p.numeros.map((n) => (
            <div key={n.rotulo} className="text-center">
              <div className="text-2xl font-bold text-logo">{n.valor}</div>
              <div className="text-xs text-stone-600">{n.rotulo}</div>
            </div>
          ))}
        </div>

        <h2 className="mb-3 mt-9 text-2xl font-bold text-logo">About us</h2>
        <div className="space-y-3 leading-relaxed">
          {p.sobre.map((t) => <p key={t.slice(0, 20)}>{t}</p>)}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {p.socios.map((s) => (
            <div key={s.nome} className="flex items-center gap-3 rounded-2xl border-2 border-marca-100 bg-marca-50 p-3">
              <div className="grid h-14 w-14 flex-none place-items-center rounded-full bg-logo text-xl font-bold text-white">{s.inicial}</div>
              <div>
                <div className="font-semibold text-logo">{s.nome}</div>
                <div className="text-sm text-stone-600">{s.texto}</div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="mb-3 mt-9 text-2xl font-bold text-logo">What we do</h2>
        <div className="flex flex-wrap gap-2">
          {p.servicos.map((s) => (
            <span key={s} className="rounded-full border-2 border-marca-500 bg-marca-50 px-3 py-1 text-sm font-semibold text-logo">{s}</span>
          ))}
        </div>

        <h2 className="mb-1 mt-9 text-2xl font-bold text-logo">Our work</h2>
        {p.categorias.map((c) => (
          <section key={c.nome} className="mt-6">
            <h3 className="text-lg font-semibold text-logo">{c.nome}</h3>
            <p className="mb-2 text-sm text-stone-600">{c.texto}</p>
            <div className={`grid gap-2 ${c.fotos.length === 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3"}`}>
              {c.fotos.map((f) => (
                <img key={f} src={fotoPortfolio(f)} alt={c.nome} loading="lazy" className="aspect-[4/3] w-full rounded-lg object-cover" />
              ))}
            </div>
          </section>
        ))}

        <h2 className="mb-3 mt-9 text-2xl font-bold text-logo">What our clients say</h2>
        <div className="flex items-center gap-4 rounded-2xl bg-logo p-4 text-white">
          <span className="text-4xl font-bold leading-none">{p.nota}</span>
          <div>
            <div className="tracking-widest text-amber-300">★★★★★</div>
            <div className="text-sm">Overall rating on Thumbtack</div>
          </div>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {p.avaliacoes.map((a) => (
            <blockquote key={a.nome} className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
              <div className="tracking-widest text-amber-500">★★★★★</div>
              <p className="my-2 text-sm">“{a.texto}”</p>
              <footer className="text-sm text-stone-600">
                <b>{a.nome}</b>
                {a.servico && ` · ${a.servico}`}
                <span className="block text-xs text-emerald-700">Verified on Thumbtack</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </div>
  );
}

export function RodapeEmpresa() {
  return (
    <footer className="mt-10 bg-logo px-4 py-7 text-center text-white">
      <div className="text-xl font-bold">Let&apos;s build something great</div>
      <p className="mt-1 text-sm opacity-85">
        {EMPRESA.nome} · {EMPRESA.endereco} · {EMPRESA.telefone} · {EMPRESA.hic} · {PORTFOLIO.instagram}
      </p>
    </footer>
  );
}
