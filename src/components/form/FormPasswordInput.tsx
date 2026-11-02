// A password field wired to Formik, with a Show password button at the end of the field.
// The button's name stays "Show password"; aria-pressed says whether it is showing.
import { useState } from 'react'
import { useField } from 'formik'
import { EyeIcon, EyeOffIcon } from '@/components/common/Icons'
import { fieldClass, inputClass, type FormFieldBaseProps } from '@/components/form/types'
import { useFieldError } from '@/components/form/useFieldError'
import { FormField } from '@/components/ui/form-field'
import { Input, type InputProps } from '@/components/ui/input'
import { cn } from '@/lib/cn'

type FormPasswordInputProps = FormFieldBaseProps & Omit<InputProps, 'name' | 'id' | 'required' | 'value' | 'type'>

export function FormPasswordInput({ name, label, hint, required, className, ...inputProps }: FormPasswordInputProps) {
  const [field] = useField<string>(name)
  const error = useFieldError(name)
  const [shown, setShown] = useState(false)

  return (
    <FormField label={label} hint={hint} error={error} required={required} className={fieldClass}>
      {(control) => (
        <div className="relative">
          <Input
            {...inputProps}
            {...field}
            type={shown ? 'text' : 'password'}
            value={field.value ?? ''}
            data-field={name}
            className={cn(inputClass, 'pr-12', className)}
            {...control}
          />
          <button
            type="button"
            aria-label="Show password"
            aria-pressed={shown}
            onClick={() => setShown((current) => !current)}
            className="absolute top-1/2 right-1 flex size-10 -translate-y-1/2 items-center justify-center rounded-md text-text-muted hover:text-text"
          >
            {shown ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      )}
    </FormField>
  )
}
