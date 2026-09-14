// Decide qual situação mais clara deve aparecer para cada ingrediente
// Deriva um rótulo de situação (para o StatusBadge) a partir dos dados já calculados
// pelo backend — nunca reaplica a regra de negócio, só prioriza o que exibir
export function situacaoRegistro(registro, meta) {
  if (registro.faltou) return 'falta'
  const estoqueFinalConhecido = registro.estoque_final !== null && registro.estoque_final !== undefined
  if (registro.venceu || (estoqueFinalConhecido && meta != null && Number(registro.estoque_final) < Number(meta))) {
    return 'atencao'
  }
  return 'normal'
}
