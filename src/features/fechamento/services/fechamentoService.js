// Reúne as ações do servidor ligadas ao período de fechamento e aos seus registros.
import { apiClient, listarTodos } from '../../../services/api/apiClient'

// Busca todos os períodos já cadastrados.
export function listarFechamentos() {
  return listarTodos('/fechamentos/')
}

// Busca os detalhes de um período específico.
export function obterFechamento(id) {
  return apiClient.get(`/fechamentos/${id}/`)
}

// Cria o período referente ao ano e mês escolhidos.
export function criarFechamento(ano, mes) {
  return apiClient.post('/fechamentos/', { ano, mes })
}

// Busca os ingredientes registrados em um fechamento.
export function listarRegistros(fechamentoId) {
  return apiClient.get(`/fechamentos/${fechamentoId}/estoques/`)
}

// Inclui um novo registro de estoque no período.
export function registrarEstoque(fechamentoId, dados) {
  return apiClient.post(`/fechamentos/${fechamentoId}/estoques/`, dados)
}

// Atualiza um registro de estoque que já existe.
export function atualizarRegistro(fechamentoId, registroId, dados) {
  return apiClient.put(`/fechamentos/${fechamentoId}/estoques/${registroId}/`, dados)
}

// Solicita o cálculo dos resultados do período.
export function calcularFechamento(fechamentoId) {
  return apiClient.post(`/fechamentos/${fechamentoId}/calcular/`)
}

// Solicita o encerramento definitivo do período.
export function encerrarFechamento(fechamentoId) {
  return apiClient.post(`/fechamentos/${fechamentoId}/encerrar/`)
}

// Busca a lista de reposição sugerida para o período.
export function listaCompras(fechamentoId) {
  return apiClient.get(`/fechamentos/${fechamentoId}/lista-compras/`)
}

// Busca possíveis ajustes de meta encontrados no fechamento.
export function sugestoesMetas(fechamentoId) {
  return apiClient.get(`/fechamentos/${fechamentoId}/sugestoes-metas/`)
}
