// Menu principal para trocar de área sem sair do sistema.
import { NavLink } from 'react-router-dom'
import Logo from '../branding/Logo'
import './Sidebar.css'

// Ícones minimalistas usados só para dar apoio visual ao rótulo de cada link.
const ICONES = {
  dashboard: (
    <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="2.5" y="2.5" width="6.5" height="6.5" rx="1.5" />
      <rect x="11" y="2.5" width="6.5" height="4.5" rx="1.5" />
      <rect x="11" y="9" width="6.5" height="8.5" rx="1.5" />
      <rect x="2.5" y="11" width="6.5" height="6.5" rx="1.5" />
    </svg>
  ),
  estoque: (
    <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M2.5 6.5 10 2.5l7.5 4v7L10 17.5l-7.5-4Z" strokeLinejoin="round" />
      <path d="M2.5 6.5 10 10.5l7.5-4M10 10.5v7" strokeLinejoin="round" />
    </svg>
  ),
  fechamentos: (
    <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3.5" width="14" height="13" rx="2" />
      <path d="M6.5 2v3M13.5 2v3M3 8.5h14" strokeLinecap="round" />
      <path d="m7 12.5 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  compras: (
    <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 3h1.6L6 12.6a1.6 1.6 0 0 0 1.6 1.4h6.4a1.6 1.6 0 0 0 1.6-1.3L17 6H5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8" cy="17" r="1.2" />
      <circle cx="14" cy="17" r="1.2" />
    </svg>
  ),
  historico: (
    <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="10" cy="10.5" r="7" />
      <path d="M10 6.5v4l2.8 1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
}

// Agrupado por etapa do fluxo do produto: primeiro o dia a dia do estoque,
// depois o que já aconteceu (histórico). Só entram aqui telas que existem de verdade.
const GRUPOS = [
  {
    links: [
      { to: '/dashboard', label: 'Dashboard', icone: ICONES.dashboard },
      { to: '/ingredientes', label: 'Estoque', icone: ICONES.estoque },
      { to: '/fechamento', label: 'Fechamentos', icone: ICONES.fechamentos },
      { to: '/compras', label: 'Compras', icone: ICONES.compras },
    ],
  },
  {
    titulo: 'Análise',
    links: [{ to: '/historico', label: 'Histórico', icone: ICONES.historico }],
  },
]

// Monta os links do menu principal.
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
                <span className="sidebar__link-icon" aria-hidden="true">
                  {link.icone}
                </span>
                {link.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  )
}
