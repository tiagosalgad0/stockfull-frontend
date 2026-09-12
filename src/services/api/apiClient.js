// Porta de entrada para falar com o servidor e lidar com respostas de forma consistente.
const API_URL = import.meta.env.VITE_API_URL || '/api'
const TOKEN_KEY = 'stockfull_token'

// Handlers registrados pelo AuthContext para reagir a uma sessão que expirou.
let onUnauthorized = null

// Registra o que deve acontecer quando a sessão expirar.
export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler
}

// Lê o acesso salvo neste navegador.
export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

// Guarda ou apaga o acesso salvo neste navegador.
export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

export class ApiError extends Error {
  // Cria o erro com as informações que ajudam a entender o que aconteceu.
  constructor(message, { status, data } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

// Traduz erros técnicos em mensagens que fazem sentido para quem usa o sistema.
function mensagemPadrao(status) {
  switch (status) {
    case 400:
      return 'Dados inválidos. Verifique os campos e tente novamente.'
    case 401:
      return 'Sua sessão expirou. Faça login novamente.'
    case 403:
      return 'Você não tem permissão para realizar esta ação.'
    case 404:
      return 'Recurso não encontrado.'
    case 500:
      return 'Erro no servidor. Tente novamente em instantes.'
    default:
      return 'Não foi possível completar a operação.'
  }
}

// Extrai a primeira mensagem útil de um payload de erro do DRF (formatos variam por serializer).
function extrairMensagem(data, status) {
  if (!data) return mensagemPadrao(status)
  if (typeof data.detail === 'string') return data.detail
  if (Array.isArray(data.detail)) return data.detail[0]
  if (typeof data === 'string') return data

  const primeiraChave = Object.keys(data)[0]
  if (primeiraChave) {
    const valor = data[primeiraChave]
    const texto = Array.isArray(valor) ? valor[0] : valor
    if (typeof texto === 'string') return texto
  }
  return mensagemPadrao(status)
}

// Faz uma solicitação ao servidor e organiza a resposta.
export async function request(path, { method = 'GET', body, params, signal } = {}) {
  const token = getToken()
  const headers = { Accept: 'application/json' }
  if (token) headers.Authorization = `Token ${token}`

  let url = `${API_URL}${path}`
  if (params) {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    ).toString()
    if (query) url += `?${query}`
  }

  let payload
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }

  let response
  try {
    response = await fetch(url, { method, headers, body: payload, signal })
  } catch {
    throw new ApiError('Não foi possível conectar ao servidor. Verifique sua conexão.', {
      status: 0,
    })
  }

  if (response.status === 204) return null

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    if (response.status === 401 && onUnauthorized) onUnauthorized()
    throw new ApiError(extrairMensagem(data, response.status), { status: response.status, data })
  }

  return data
}

export const apiClient = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
}

// A API pagina listas (DRF PageNumberPagination); a maioria das telas cabe em uma página,
// mas isso garante que nenhum item fique escondido caso o cadastro cresça.
export async function listarTodos(path, params) {
  let resultado = await apiClient.get(path, { params })
  const itens = [...resultado.results]
  while (resultado.next) {
    // "next" vem absoluto (outra origem); reaproveita só a query string para continuar no proxy do Vite.
    const proximaPagina = new URL(resultado.next).search
    resultado = await apiClient.get(`${path}${proximaPagina}`)
    itens.push(...resultado.results)
  }
  return itens
}
