import { createContext, useCallback, useRef, useState } from 'react'
import ToastContainer from '../components/ui/Toast'

export const ToastContext = createContext(null)

let nextId = 1

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())

  const remove = useCallback((id) => {
    setToasts((atual) => atual.filter((t) => t.id !== id))
    clearTimeout(timers.current.get(id))
    timers.current.delete(id)
  }, [])

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
