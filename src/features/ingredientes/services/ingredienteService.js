// Ações do servidor para cadastrar e manter os ingredientes do estoque.
import { apiClient, listarTodos } from '../../../services/api/apiClient'

// Busca todos os ingredientes cadastrados.
export function listarIngredientes() {
  return listarTodos('/ingredientes/')
}

// Busca um ingrediente específico.
export function obterIngrediente(id) {
  return apiClient.get(`/ingredientes/${id}/`)
}

// Envia os dados para cadastrar um ingrediente.
export function criarIngrediente(dados) {
  return apiClient.post('/ingredientes/', dados)
}

// Envia as alterações feitas em um ingrediente.
export function atualizarIngrediente(id, dados) {
  return apiClient.put(`/ingredientes/${id}/`, dados)
}

// Remove um ingrediente cadastrado.
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
