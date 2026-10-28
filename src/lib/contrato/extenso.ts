const UNIDADES = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const DEZENAS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

function ate999(n: number): string {
  const c = Math.floor(n / 100);
  const r = n % 100;
  const partes: string[] = [];
  if (c) partes.push(`${UNIDADES[c]} hundred`);
  if (r) partes.push(r < 20 ? UNIDADES[r] : `${DEZENAS[Math.floor(r / 10)]}${r % 10 ? `-${UNIDADES[r % 10]}` : ""}`);
  return partes.join(" ");
}

/** 2300050 centavos → "Twenty-three thousand dollars and fifty cents" (valor por extenso em inglês, para o contrato). */
export function dolaresPorExtenso(centavos: number) {
  const dolares = Math.floor(Math.abs(centavos) / 100);
  const cents = Math.abs(centavos) % 100;
  const grupos: [number, string][] = [[1_000_000_000, "billion"], [1_000_000, "million"], [1000, "thousand"], [1, ""]];
  let resto = dolares;
  const partes: string[] = [];
  for (const [valor, nome] of grupos) {
    const q = Math.floor(resto / valor);
    resto %= valor;
    if (q) partes.push(`${ate999(q)}${nome ? ` ${nome}` : ""}`);
  }
  let texto = `${partes.join(" ") || "zero"} ${dolares === 1 ? "dollar" : "dollars"}`;
  if (cents) texto += ` and ${ate999(cents)} ${cents === 1 ? "cent" : "cents"}`;
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
