// Reúne os recursos que todas as telas compartilham, como rotas, sessão e avisos.
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './providers/AuthProvider'
import { ToastProvider } from './providers/ToastProvider'
import AppRoutes from './routes'

// Monta a base da aplicação com tudo o que as páginas precisam compartilhar.
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
