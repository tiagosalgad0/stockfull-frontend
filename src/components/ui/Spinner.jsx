// Indicador circular para mostrar que uma ação ainda está sendo concluída.
import './Spinner.css'

// Mostra que uma tarefa ainda está sendo realizada.
export default function Spinner({ size = 'md' }) {
  return <span className={`spinner spinner--${size}`} role="status" aria-label="Carregando" />
}
