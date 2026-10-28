/** Situação do seguro (COI) de um subcontratado: vencido, vencendo em 30 dias, em dia ou não informado. */
export function SeloSeguro({ validade }: { validade: Date | null }) {
  if (!validade) return <span className="selo bg-stone-100 text-stone-600">Sem COI</span>;
  const dias = Math.floor((validade.getTime() - Date.now()) / (24 * 3600 * 1000));
  if (dias < 0) return <span className="selo bg-red-100 text-red-800">Seguro vencido</span>;
  if (dias <= 30) return <span className="selo bg-amber-100 text-amber-800">Vence em {dias} dia(s)</span>;
  return <span className="selo bg-emerald-100 text-emerald-800">Seguro em dia</span>;
}
