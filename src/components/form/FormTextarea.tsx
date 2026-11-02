// A multi-line text field wired to Formik, on the shared FormField and Textarea, with the
// shared character count when maxLength is set.
import { useField } from 'formik'
import { fieldClass, type FormFieldBaseProps } from '@/components/form/types'
import { useFieldError } from '@/components/form/useFieldError'
import { FormField } from '@/components/ui/form-field'
import { Textarea, type TextareaProps } from '@/components/ui/textarea'
import { cn } from '@/lib/cn'

type FormTextareaProps = FormFieldBaseProps & Omit<TextareaProps, 'name' | 'id' | 'required' | 'value'>

export function FormTextarea({ name, label, hint, required, className, ...textareaProps }: FormTextareaProps) {
  const [field] = useField<string>(name)
  const error = useFieldError(name)
  return (
    <FormField label={label} hint={hint} error={error} required={required} className={fieldClass}>
      {(control) => (
        <Textarea
          {...textareaProps}
          {...field}
          value={field.value ?? ''}
          data-field={name}
          className={cn('text-base', className)}
          {...control}
        />
      )}
    </FormField>
  )
}
