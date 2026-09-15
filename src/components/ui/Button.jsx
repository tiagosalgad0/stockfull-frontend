// Botão padrão, com variações visuais e indicador enquanto uma ação está em andamento
import Spinner from './Spinner'
import './Button.css'

// Mostra um botão já pronto para as ações do sistema
export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  ...rest
}) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} ${fullWidth ? 'btn--full' : ''}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading && <Spinner size="sm" />}
      <span>{children}</span>
    </button>
  )
}
