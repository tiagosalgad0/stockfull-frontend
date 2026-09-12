import { apiClient, listarTodos } from './api/apiClient'

export function listarIngredientes() {
  return listarTodos('/ingredientes/')
}

export function obterIngrediente(id) {
  return apiClient.get(`/ingredientes/${id}/`)
}

export function criarIngrediente(dados) {
  return apiClient.post('/ingredientes/', dados)
}

export function atualizarIngrediente(id, dados) {
  return apiClient.put(`/ingredientes/${id}/`, dados)
}

export function excluirIngrediente(id) {
  return apiClient.delete(`/ingredientes/${id}/`)
}

// UC08 — confirma explicitamente uma nova meta sugerida após uma falta.
export function confirmarNovaMeta(id, novaMeta) {
  return apiClient.put(`/ingredientes/${id}/meta/`, { nova_meta: novaMeta })
}

export const UNIDADES = [
  { value: 'KG', label: 'Quilograma (kg)' },
  { value: 'L', label: 'Litro (L)' },
  { value: 'UN', label: 'Unidade (un)' },
]

export const UNIDADE_LABEL = { KG: 'kg', L: 'L', UN: 'un' }
