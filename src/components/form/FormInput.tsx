// A text-style input (text, email, number) wired to Formik, on the shared FormField and
// Input. Entered values stay in Formik after a failed save.
import { useField } from 'formik'
import { fieldClass, inputClass, type FormFieldBaseProps } from '@/components/form/types'
import { useFieldError } from '@/components/form/useFieldError'
import { FormField } from '@/components/ui/form-field'
import { Input, type InputProps } from '@/components/ui/input'
import { cn } from '@/lib/cn'

export type FormInputProps = FormFieldBaseProps & Omit<InputProps, 'name' | 'id' | 'required' | 'value'>

export function FormInput({ name, label, hint, required, className, ...inputProps }: FormInputProps) {
  const [field] = useField<string>(name)
  const error = useFieldError(name)
  return (
    <FormField label={label} hint={hint} error={error} required={required} className={fieldClass}>
      {(control) => (
        <Input
          {...inputProps}
          {...field}
          value={field.value ?? ''}
          data-field={name}
          className={cn(inputClass, className)}
          {...control}
        />
      )}
    </FormField>
  )
}
