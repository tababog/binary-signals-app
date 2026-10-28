import { ListaFornecedores } from "@/components/ListaFornecedores";

export default function Fornecedores({ searchParams }: { searchParams: { q?: string } }) {
  return <ListaFornecedores tipo="FORNECEDOR" q={searchParams.q} />;
}
