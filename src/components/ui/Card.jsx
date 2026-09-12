// Caixa visual neutra para agrupar informações relacionadas.
import './Card.css'

// Agrupa um conteúdo em uma caixa visual simples.
export default function Card({ children, className = '', padded = true, ...rest }) {
  return (
    <div className={`card ${padded ? 'card--padded' : ''} ${className}`} {...rest}>
      {children}
    </div>
  )
}
