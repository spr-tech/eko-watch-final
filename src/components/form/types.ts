// Props every Formik adapter in this folder takes.
export type FormFieldBaseProps = {
  name: string
  label: string
  hint?: string
  required?: boolean
}

// The shared FormField's label and error, sized as in the design (15px/800 label,
// 14px/700 error). Set from the wrapper because the shared component stays unchanged.
export const fieldClass = '[&>label]:text-[15px] [&>label]:font-extrabold [&_[id$=-error]]:font-bold'

// The shared Input, 46px tall with 16px text as in the design.
export const inputClass = 'h-11.5 text-base'
