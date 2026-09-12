import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Logo from '../../components/branding/Logo'
import Input from '../../components/ui/Input'
import PasswordInput from '../../components/ui/PasswordInput'
import Button from '../../components/ui/Button'
import './Login.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  function validar() {
    const proximosErros = {}
    if (!username.trim()) proximosErros.username = 'Informe seu usuário.'
    if (!password) proximosErros.password = 'Informe sua senha.'
    setErrors(proximosErros)
    return Object.keys(proximosErros).length === 0
  }

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
      <div className="login__card">
        <div className="login__logo">
          <Logo />
        </div>
        <p className="login__subtitle">Entre para gerenciar o estoque do seu restaurante.</p>

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
    </div>
  )
}
