import { NavLink } from 'react-router-dom'
import Logo from '../branding/Logo'
import './Sidebar.css'

// Agrupado por etapa do fluxo do produto: primeiro o dia a dia do estoque,
// depois o que já aconteceu (histórico). Só entram aqui telas que existem de verdade.
const GRUPOS = [
  {
    links: [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/ingredientes', label: 'Estoque' },
      { to: '/fechamento', label: 'Fechamentos' },
      { to: '/compras', label: 'Compras' },
    ],
  },
  {
    titulo: 'Análise',
    links: [{ to: '/historico', label: 'Histórico' }],
  },
]

export default function Sidebar({ open, onNavigate }) {
  return (
    <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
      <div className="sidebar__logo">
        <Logo size="sm" />
      </div>
      <nav className="sidebar__nav">
        {GRUPOS.map((grupo, i) => (
          <div key={i} className="sidebar__group">
            {grupo.titulo && <p className="sidebar__group-title">{grupo.titulo}</p>}
            {grupo.links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onNavigate}
                className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  )
}
