// Tela de entrada: confere os dados básicos e leva a pessoa para a área solicitada.
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../app/providers/AuthProvider'
import Logo from '../../../components/branding/Logo'
import Input from '../../../components/ui/Input'
import PasswordInput from '../../../components/ui/PasswordInput'
import Button from '../../../components/ui/Button'
import './Login.css'

const ANO_ATUAL = new Date().getFullYear()

// Cuida da tela em que a pessoa entra na conta.
export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  // Confere se os dados obrigatórios foram preenchidos antes de continuar.
  function validar() {
    const proximosErros = {}
    if (!username.trim()) proximosErros.username = 'Informe seu usuário.'
    if (!password) proximosErros.password = 'Informe sua senha.'
    setErrors(proximosErros)
    return Object.keys(proximosErros).length === 0
  }

  // Envia os dados preenchidos depois de conferir o formulário.
  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')
    if (!validar()) return

    setLoading(true)
    try {
      await login(username.trim(), password)
      const destino = location.state?.from?.pathname || '/dashboard'
      navigate(destino, { replace: true })
    } catch {
      setFormError('Usuário ou senha inválidos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login">
      <div className="login__panel login__panel--brand">
        <div className="login__brand-top">
          <Logo />
        </div>

        <div className="login__brand-middle">
          <div className="login__illustration" aria-hidden="true">
            <svg viewBox="0 0 64 64" width="40" height="40">
              <rect x="10" y="14" width="10" height="10" rx="2" fill="var(--color-primary)" opacity="0.85" />
              <rect x="24" y="10" width="10" height="14" rx="2" fill="var(--color-primary)" />
              <rect x="38" y="18" width="10" height="6" rx="2" fill="var(--color-primary)" opacity="0.6" />
              <rect x="10" y="30" width="38" height="6" rx="2" fill="var(--color-border)" />
              <rect x="10" y="42" width="24" height="6" rx="2" fill="var(--color-border)" />
            </svg>
          </div>
          <h2 className="login__brand-title">Tenha uma visão clara do seu estoque.</h2>
          <p className="login__brand-text">
            Controle ingredientes, acompanhe níveis de estoque e realize fechamentos com mais organização.
          </p>
        </div>

        <p className="login__copyright">© {ANO_ATUAL} StockFull</p>
      </div>

      <div className="login__panel login__panel--form">
        <div className="login__card">
          <h1 className="login__title">Entrar na sua conta</h1>
          <p className="login__subtitle">Acesse o StockFull para acompanhar e gerenciar seu estoque.</p>

          <form className="login__form" onSubmit={handleSubmit} noValidate>
            <Input
              label="Usuário"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={errors.username}
            />
            <PasswordInput
              label="Senha"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />

            {formError && (
              <p className="login__error" role="alert">
                {formError}
              </p>
            )}

            <Button type="submit" fullWidth loading={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </div>

        <p className="login__copyright login__copyright--mobile">© {ANO_ATUAL} StockFull</p>
      </div>
    </div>
  )
}
