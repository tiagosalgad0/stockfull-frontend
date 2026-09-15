// Conversas com o servidor ligadas a entrar, sair e conferir a conta atual
import { apiClient, getToken, setToken } from '../../../services/api/apiClient'

// Envia o usuário e a senha para iniciar a sessão.
export async function login(username, password) {
  const { token } = await apiClient.post('/auth/login/', { username, password })
  setToken(token)
  return token
}

// Pede o encerramento da sessão e limpa o acesso salvo
export async function logout() {
  try {
    await apiClient.post('/auth/logout/')
  } finally {
    setToken(null)
  }
}

// Busca os dados da pessoa que está usando o sistema
export function me() {
  return apiClient.get('/auth/me/')
}

// Informa se existe um acesso salvo neste navegador
export function isAuthenticated() {
  return Boolean(getToken())
}
