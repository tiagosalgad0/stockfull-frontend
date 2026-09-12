import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import ProtectedRoute from './routes/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'
import Login from './pages/Login/Login'
import Dashboard from './pages/Dashboard/Dashboard'
import Ingredientes from './pages/Ingredientes/Ingredientes'
import Fechamento from './pages/Fechamento/Fechamento'
import Compras from './pages/Compras/Compras'
import Historico from './pages/Historico/Historico'
import HistoricoDetalhe from './pages/Historico/HistoricoDetalhe'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/ingredientes" element={<Ingredientes />} />
                <Route path="/fechamento" element={<Fechamento />} />
                <Route path="/compras" element={<Compras />} />
                <Route path="/historico" element={<Historico />} />
                <Route path="/historico/:id" element={<HistoricoDetalhe />} />
              </Route>
            </Route>

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
