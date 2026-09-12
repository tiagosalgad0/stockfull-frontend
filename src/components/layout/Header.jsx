import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import './Header.css'

export default function Header({ title, onMenuClick }) {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

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
          {user?.username || 'Usuário'} <span aria-hidden="true">▾</span>
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
