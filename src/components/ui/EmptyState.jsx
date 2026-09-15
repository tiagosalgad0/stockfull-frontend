// Mensagem amigável mostrada quando ainda não há nada para exibir
import './EmptyState.css'

// Explica de forma amigável quando não há conteúdo para mostrar
export default function EmptyState({ title, description, action }) {
  return (
    <div className="empty-state">
      <p className="empty-state__title">{title}</p>
      {description && <p className="empty-state__description">{description}</p>}
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  )
}
