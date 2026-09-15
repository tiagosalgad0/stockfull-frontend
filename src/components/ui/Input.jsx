// Campo de texto padrão, já ligado ao seu rótulo para facilitar o preenchimento
import { useId } from 'react'
import FormField from './FormField'
import './Field.css'

// Mostra um campo de texto padrão
export default function Input({ label, error, hint, id, ...rest }) {
  const generatedId = useId()
  const fieldId = id || generatedId

  return (
    <FormField label={label} htmlFor={fieldId} error={error} hint={hint}>
      <input id={fieldId} className="field__control" {...rest} />
    </FormField>
  )
}
