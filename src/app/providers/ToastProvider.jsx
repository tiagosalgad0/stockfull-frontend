// Centraliza os avisos breves que aparecem no canto da tela
import { createContext, useCallback, useContext, useRef, useState } from 'react'
import ToastContainer from '../../components/ui/Toast'

const ToastContext = createContext(null)

let nextId = 1

// Organiza os avisos rápidos exibidos para a pessoa usuária
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())

  // Retira um aviso da tela e cancela o relógio dele
  const remove = useCallback((id) => {
    setToasts((atual) => atual.filter((t) => t.id !== id))
    clearTimeout(timers.current.get(id))
    timers.current.delete(id)
  }, [])

  // Cria um aviso e agenda a remoção automática quando houver prazo
  const show = useCallback(
    (message, type = 'info', duration = 4000) => {
      const id = nextId++
      setToasts((atual) => [...atual, { id, message, type }])
      timers.current.set(
        id,
        setTimeout(() => remove(id), duration)
      )
      return id
    },
    [remove]
  )

  const value = {
    show,
    success: (message) => show(message, 'success'),
    error: (message) => show(message, 'error'),
    warning: (message) => show(message, 'warning'),
    info: (message) => show(message, 'info'),
    remove,
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={remove} />
    </ToastContext.Provider>
  )
}

// Entrega os atalhos para mostrar avisos na tela
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast deve ser usado dentro de um ToastProvider')
  return context
}
