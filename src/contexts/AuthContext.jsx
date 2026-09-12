import { createContext, useCallback, useEffect, useState } from 'react'
import { getToken, setUnauthorizedHandler } from '../services/api/apiClient'
import * as authService from '../services/authService'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // "checking" evita redirecionar para /login antes de confirmar se o token salvo ainda é válido.
  const [status, setStatus] = useState(getToken() ? 'checking' : 'anonymous')

  useEffect(() => {
    if (status !== 'checking') return
    authService
      .me()
      .then((dados) => {
        setUser(dados)
        setStatus('authenticated')
      })
      .catch(() => setStatus('anonymous'))
  }, [status])

  useEffect(() => {
    // Qualquer 401 vindo da API (token expirado/inválido) derruba a sessão local sem nova chamada.
    setUnauthorizedHandler(() => {
      setUser(null)
      setStatus('anonymous')
    })
    return () => setUnauthorizedHandler(null)
  }, [])

  const login = useCallback(async (username, password) => {
    await authService.login(username, password)
    const dados = await authService.me()
    setUser(dados)
    setStatus('authenticated')
  }, [])

  const logout = useCallback(async () => {
    await authService.logout().catch(() => {})
    setUser(null)
    setStatus('anonymous')
  }, [])

  const value = {
    user,
    status,
    isAuthenticated: status === 'authenticated',
    isChecking: status === 'checking',
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
