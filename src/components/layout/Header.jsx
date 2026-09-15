// Cabeçalho com a identificação do usuário e a saída da conta
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../app/providers/AuthProvider'
import './Header.css'

// Mostra o cabeçalho e as ações ligadas à conta
export default function Header({ title, onMenuClick }) {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  // Encerra a sessão quando a pessoa escolhe sair
  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="header">
      <button className="header__menu-btn" onClick={onMenuClick} aria-label="Abrir menu">
        ☰
      </button>
      <h1 className="header__title">{title}</h1>
      <div className="header__user">
        <button
          className="header__user-btn"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
        >
          <span className="header__avatar" aria-hidden="true">
            {(user?.username || 'U').charAt(0).toUpperCase()}
          </span>
          {user?.username || 'Usuário'} <span className="header__chevron" aria-hidden="true">▾</span>
        </button>
        {menuOpen && (
          <div className="header__dropdown" onMouseLeave={() => setMenuOpen(false)}>
            <button className="header__dropdown-item" onClick={handleLogout}>
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
