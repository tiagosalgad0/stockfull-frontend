// Lista de opções padronizada, com rótulo e mensagem de ajuda.
import { useId } from 'react'
import FormField from './FormField'
import './Field.css'

// Mostra uma lista de opções já acompanhada de rótulo.
export default function Select({ label, error, hint, id, options, placeholder, ...rest }) {
  const generatedId = useId()
  const fieldId = id || generatedId

  return (
    <FormField label={label} htmlFor={fieldId} error={error} hint={hint}>
      <select id={fieldId} className="field__control" {...rest}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FormField>
  )
}
