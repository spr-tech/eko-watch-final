// A choice from a list wired to Formik, on the shared FormField and Select. The Select's
// trigger is a button, so data-field is set on it for focus-on-error.
import { useField } from 'formik'
import { fieldClass, inputClass, type FormFieldBaseProps } from '@/components/form/types'
import { useFieldError } from '@/components/form/useFieldError'
import { FormField } from '@/components/ui/form-field'
import { Select, type SelectOption } from '@/components/ui/select'

type FormSelectProps = FormFieldBaseProps & {
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
}

export function FormSelect({ name, label, hint, required, options, placeholder, disabled }: FormSelectProps) {
  const [field, , helpers] = useField<string>(name)
  const error = useFieldError(name)
  return (
    <FormField label={label} hint={hint} error={error} required={required} className={fieldClass}>
      {(control) => (
        <Select
          ref={(trigger) => {
            if (trigger) trigger.dataset.field = name
          }}
          options={options}
          value={field.value || undefined}
          onValueChange={(value) => {
            void helpers.setValue(value ?? '')
            void helpers.setTouched(true, false)
          }}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClass}
          {...control}
        />
      )}
    </FormField>
  )
}
