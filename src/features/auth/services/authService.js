import { apiClient, getToken, setToken } from '../../../services/api/apiClient'

export async function login(username, password) {
  const { token } = await apiClient.post('/auth/login/', { username, password })
  setToken(token)
  return token
}

export async function logout() {
  try {
    await apiClient.post('/auth/logout/')
  } finally {
    setToken(null)
  }
}

export function me() {
  return apiClient.get('/auth/me/')
}

export function isAuthenticated() {
  return Boolean(getToken())
}
