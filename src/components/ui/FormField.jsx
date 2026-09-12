// Envolve cada campo com seu rótulo, ajuda e eventual recado de erro.
import './Field.css'

// Agrupa o campo, o rótulo e os recados que ajudam no preenchimento.
export default function FormField({ label, htmlFor, error, hint, children }) {
  return (
    <div className={`field ${error ? 'field--error' : ''}`}>
      {label && (
        <label className="field__label" htmlFor={htmlFor}>
          {label}
        </label>
      )}
      {children}
      {error ? (
        <span className="field__error" role="alert">
          {error}
        </span>
      ) : (
        hint && (
          <span className="field__error" style={{ color: 'var(--color-text-secondary)' }}>
            {hint}
          </span>
        )
      )}
    </div>
  )
}
