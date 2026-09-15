// Moldura padrão das páginas internas: menu lateral, cabeçalho e conteúdo
import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import './AppLayout.css'

const TITLES = [
  { prefix: '/dashboard', title: 'Dashboard' },
  { prefix: '/ingredientes', title: 'Estoque' },
  { prefix: '/fechamento', title: 'Fechamento de estoque' },
  { prefix: '/compras', title: 'Compras' },
  { prefix: '/historico', title: 'Histórico' },
]

// Monta a estrutura comum das páginas internas
export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const title = TITLES.find((t) => location.pathname.startsWith(t.prefix))?.title || 'StockFull'

  return (
    <div className="app-layout">
      <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
      {sidebarOpen && (
        <div className="app-layout__scrim" onClick={() => setSidebarOpen(false)} />
      )}
      <div className="app-layout__main">
        <Header title={title} onMenuClick={() => setSidebarOpen((v) => !v)} />
        <main className="app-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
