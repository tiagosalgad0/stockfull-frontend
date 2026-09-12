import { useId } from 'react'
import FormField from './FormField'
import './Field.css'

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
