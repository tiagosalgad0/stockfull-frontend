// Espaço animado que antecipa o formato do conteúdo enquanto ele chega
import './Skeleton.css'

// Reserva um espaço enquanto a informação ainda está chegando.
export default function Skeleton({ width = '100%', height = 14, style, className = '' }) {
  return (
    <span
      className={`skeleton ${className}`}
      style={{ width, height, ...style }}
      aria-hidden="true"
    />
  )
}
