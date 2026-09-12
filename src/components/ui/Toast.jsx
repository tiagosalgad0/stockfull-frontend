import { createPortal } from 'react-dom'
import './Toast.css'

const ICONS = {
  success: '✓',
  error: '✕',
  warning: '!',
  info: 'i',
}

export default function ToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) return null

  return createPortal(
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.type}`} role="status">
          <span className="toast__icon" aria-hidden="true">
            {ICONS[t.type] || ICONS.info}
          </span>
          <span className="toast__message">{t.message}</span>
          <button className="toast__close" onClick={() => onDismiss(t.id)} aria-label="Fechar aviso">
            ×
          </button>
        </div>
      ))}
    </div>,
    document.body
  )
}
