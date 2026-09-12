// Guarda a sessão do usuário para que qualquer tela saiba se ele está conectado.
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { getToken, setUnauthorizedHandler } from '../../services/api/apiClient'
import * as authService from '../../features/auth/services/authService'

const AuthContext = createContext(null)

// Deixa as informações de acesso disponíveis para toda a aplicação.
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

  // Inicia a sessão e busca os dados da pessoa que acabou de entrar.
  const login = useCallback(async (username, password) => {
    await authService.login(username, password)
    const dados = await authService.me()
    setUser(dados)
    setStatus('authenticated')
  }, [])

  // Sai da conta mesmo se o servidor estiver indisponível naquele momento.
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

// Entrega a sessão atual para a tela que precisar dela.
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  return context
}
