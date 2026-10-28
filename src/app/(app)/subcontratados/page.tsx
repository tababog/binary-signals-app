import { ListaFornecedores } from "@/components/ListaFornecedores";

export default function Subcontratados({ searchParams }: { searchParams: { q?: string } }) {
  return <ListaFornecedores tipo="SUBCONTRATADO" q={searchParams.q} />;
}
