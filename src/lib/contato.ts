import { texto } from "./format";

export function dadosContato(form: FormData) {
  return {
    nome: String(form.get("nome") ?? "").trim(),
    documento: texto(form.get("documento")),
    telefone: texto(form.get("telefone")),
    email: texto(form.get("email")),
    endereco: texto(form.get("endereco")),
    observacoes: texto(form.get("observacoes")),
  };
}
