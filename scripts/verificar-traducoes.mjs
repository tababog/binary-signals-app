// Confere se todos os textos das telas (t("...")) têm tradução em inglês e espanhol,
// e se as variáveis {assim} são as mesmas nas três línguas. Uso: npm run i18n:verificar
import { readFileSync, readdirSync, statSync } from "fs";
import path from "path";

const arquivos = [];
(function andar(d) {
  for (const n of readdirSync(d)) {
    const p = path.join(d, n);
    if (statSync(p).isDirectory()) andar(p);
    else if (/\.tsx?$/.test(n) && !p.includes(`${path.sep}i18n${path.sep}`)) arquivos.push(p);
  }
})("src");

const literal = String.raw`"((?:[^"\\]|\\.)*)"`;
const chaves = new Set();
const ler = (s) => JSON.parse(`"${s}"`);
for (const a of arquivos) {
  const s = readFileSync(a, "utf8");
  for (const m of s.matchAll(new RegExp(String.raw`\b(?:t|getT\(\))\(\s*` + literal, "g"))) chaves.add(ler(m[1]));
  for (const m of s.matchAll(new RegExp(String.raw`\bt\(\s*'((?:[^'\\]|\\.)*)'`, "g"))) chaves.add(m[1]);
  // Nomes de listas (status, categorias, serviços...) e mensagens de erro passados para t() depois
  if (/lib[\\/](constantes|custos-fixos|followup)\.ts$/.test(a))
    for (const m of s.matchAll(new RegExp(String.raw`(?:^|[{,\s])(?:[A-Z_]+|nome|rotulo):\s*` + literal, "gm"))) chaves.add(ler(m[1]));
  for (const m of s.matchAll(new RegExp(String.raw`new Error\(\s*` + literal, "g"))) if (/lib[\\/](uploads|auth|convite)\.ts$/.test(a)) chaves.add(ler(m[1]));
  if (/FluxoCaixaEmpresa|visitas[\\/]\[id\]/.test(a))
    for (const m of s.matchAll(new RegExp(String.raw`(?:OBRA|FIXO|SOCIOS|rotulo):\s*` + literal, "g"))) chaves.add(ler(m[1]));
}

const vars = (s) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(",");
let erros = 0;
for (const idioma of ["en", "es"]) {
  const fonte = readFileSync(`src/i18n/${idioma}.ts`, "utf8");
  const corpo = fonte.slice(fonte.indexOf("{"), fonte.lastIndexOf("}") + 1);
  const dic = Function(`return (${corpo})`)();
  for (const c of chaves) {
    if (!(c in dic)) { console.log(`[${idioma}] falta: ${JSON.stringify(c)}`); erros++; }
    else if (vars(c) !== vars(dic[c])) { console.log(`[${idioma}] variáveis diferentes: ${JSON.stringify(c)}`); erros++; }
  }
}
console.log(erros ? `${erros} problema(s) em ${chaves.size} textos.` : `OK: ${chaves.size} textos traduzidos em inglês e espanhol.`);
process.exit(erros ? 1 : 0);
