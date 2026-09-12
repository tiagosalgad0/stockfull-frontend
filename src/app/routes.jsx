import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute'
import AppLayout from '../components/layout/AppLayout'
import Login from '../features/auth/pages/Login'
import Dashboard from '../features/dashboard/pages/Dashboard'
import Ingredientes from '../features/ingredientes/pages/Ingredientes'
import Fechamento from '../features/fechamento/pages/Fechamento'
import Compras from '../features/compras/pages/Compras'
import Historico from '../features/historico/pages/Historico'
import HistoricoDetalhe from '../features/historico/pages/HistoricoDetalhe'

export default function AppRoutes() {
  return (
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
  )
}
