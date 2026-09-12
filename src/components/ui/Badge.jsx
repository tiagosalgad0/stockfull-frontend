// Pequena etiqueta colorida usada para destacar um estado ou categoria.
import './Badge.css'

// Exibe uma pequena etiqueta com a cor do estado.
export default function Badge({ tone = 'neutral', children }) {
  return (
    <span className={`badge badge--${tone}`}>
      <span className="badge__dot" aria-hidden="true" />
      {children}
    </span>
  )
}
