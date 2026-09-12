import { apiClient, listarTodos } from './api/apiClient'

export function listarFechamentos() {
  return listarTodos('/fechamentos/')
}

export function obterFechamento(id) {
  return apiClient.get(`/fechamentos/${id}/`)
}

export function criarFechamento(ano, mes) {
  return apiClient.post('/fechamentos/', { ano, mes })
}

export function listarRegistros(fechamentoId) {
  return apiClient.get(`/fechamentos/${fechamentoId}/estoques/`)
}

export function registrarEstoque(fechamentoId, dados) {
  return apiClient.post(`/fechamentos/${fechamentoId}/estoques/`, dados)
}

export function atualizarRegistro(fechamentoId, registroId, dados) {
  return apiClient.put(`/fechamentos/${fechamentoId}/estoques/${registroId}/`, dados)
}

export function calcularFechamento(fechamentoId) {
  return apiClient.post(`/fechamentos/${fechamentoId}/calcular/`)
}

export function encerrarFechamento(fechamentoId) {
  return apiClient.post(`/fechamentos/${fechamentoId}/encerrar/`)
}

export function listaCompras(fechamentoId) {
  return apiClient.get(`/fechamentos/${fechamentoId}/lista-compras/`)
}

export function sugestoesMetas(fechamentoId) {
  return apiClient.get(`/fechamentos/${fechamentoId}/sugestoes-metas/`)
}
