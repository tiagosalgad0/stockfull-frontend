import { useId, useState } from 'react'
import FormField from './FormField'
import './Field.css'

export default function PasswordInput({ label, error, hint, id, ...rest }) {
  const generatedId = useId()
  const fieldId = id || generatedId
  const [visible, setVisible] = useState(false)

  return (
    <FormField label={label} htmlFor={fieldId} error={error} hint={hint}>
      <div className="field__control-wrap">
        <input
          id={fieldId}
          type={visible ? 'text' : 'password'}
          className="field__control"
          style={{ paddingRight: 56 }}
          {...rest}
        />
        <button
          type="button"
          className="field__toggle"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
        >
          {visible ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>
    </FormField>
  )
}
