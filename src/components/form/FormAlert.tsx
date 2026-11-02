// A message about the whole form, shown under its heading and announced as an alert
// (SignIn.dc.html): "error" for a refusal such as wrong credentials, "offline" when the
// service can't be reached.
import type { ReactNode } from 'react'
import { AlertCircleIcon, WifiOffIcon } from '@/components/common/Icons'
import { cn } from '@/lib/cn'

type FormAlertProps = { tone: 'error' | 'offline'; children: ReactNode }

export function FormAlert({ tone, children }: FormAlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-2 rounded-md px-3 py-2.5 leading-snug font-bold',
        tone === 'error' ? 'bg-danger-light text-danger' : 'bg-warning-light text-warning-dark',
      )}
    >
      {tone === 'error' ? <AlertCircleIcon size={18} /> : <WifiOffIcon size={18} />}
      <span>{children}</span>
    </div>
  )
}
