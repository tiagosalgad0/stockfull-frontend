import { useId } from 'react'
import FormField from './FormField'
import './Field.css'

export default function Input({ label, error, hint, id, ...rest }) {
  const generatedId = useId()
  const fieldId = id || generatedId

  return (
    <FormField label={label} htmlFor={fieldId} error={error} hint={hint}>
      <input id={fieldId} className="field__control" {...rest} />
    </FormField>
  )
}
