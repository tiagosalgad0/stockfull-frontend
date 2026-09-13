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

const DESTAQUES = [
  'Controle de estoque em tempo real',
  'Fechamentos e relatórios automáticos',
  'Acesso seguro para toda a equipe',
]

const BARRAS_PREVIEW = [38, 62, 48, 80, 58, 92, 70]

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
          <span className="login__badge">Ambiente seguro</span>
        </div>

        <div className="login__brand-middle">
          <p className="login__eyebrow">Painel de gestão</p>
          <h2 className="login__brand-title">
            Tenha uma visão clara <span>do seu estoque</span>.
          </h2>
          <p className="login__brand-text">
            Controle ingredientes, acompanhe níveis de estoque e realize fechamentos com mais organização.
          </p>

          <div className="login__preview" aria-hidden="true">
            <div className="login__preview-header">
              <span className="login__preview-dot login__preview-dot--red" />
              <span className="login__preview-dot login__preview-dot--yellow" />
              <span className="login__preview-dot login__preview-dot--green" />
              <span className="login__preview-title">Visão geral do estoque</span>
            </div>

            <div className="login__preview-stats">
              <div className="login__preview-stat">
                <span className="login__preview-stat-label">Itens ativos</span>
                <span className="login__preview-stat-value">1.284</span>
              </div>
              <div className="login__preview-stat">
                <span className="login__preview-stat-label">Alertas</span>
                <span className="login__preview-stat-value login__preview-stat-value--warning">6</span>
              </div>
              <div className="login__preview-stat">
                <span className="login__preview-stat-label">Fechamentos</span>
                <span className="login__preview-stat-value login__preview-stat-value--success">32</span>
              </div>
            </div>

            <div className="login__preview-chart">
              {BARRAS_PREVIEW.map((altura, i) => (
                <span
                  key={i}
                  className={`login__preview-bar ${i === BARRAS_PREVIEW.length - 1 ? 'login__preview-bar--active' : ''}`}
                  style={{ height: `${altura}%` }}
                />
              ))}
            </div>
          </div>

          <ul className="login__highlights">
            {DESTAQUES.map((item) => (
              <li key={item} className="login__highlight">
                <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
                  <circle cx="10" cy="10" r="10" fill="rgba(255,255,255,0.12)" />
                  <path
                    d="M6 10.5 8.5 13 14 7"
                    stroke="#93c5fd"
                    strokeWidth="1.8"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="login__copyright">© {ANO_ATUAL} StockFull</p>
      </div>

      <div className="login__panel login__panel--form">
        <div className="login__card">
          <span className="login__welcome">Bem-vindo de volta</span>
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
                <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
                  <circle cx="10" cy="10" r="10" fill="var(--color-danger-soft)" />
                  <path d="M10 6v5" stroke="var(--color-danger)" strokeWidth="1.8" strokeLinecap="round" />
                  <circle cx="10" cy="13.5" r="1" fill="var(--color-danger)" />
                </svg>
                {formError}
              </p>
            )}

            <Button type="submit" fullWidth loading={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>

            <p className="login__help">Problemas para entrar? Fale com o administrador do sistema.</p>
          </form>
        </div>

        <p className="login__copyright login__copyright--mobile">© {ANO_ATUAL} StockFull</p>
      </div>
    </div>
  )
}
