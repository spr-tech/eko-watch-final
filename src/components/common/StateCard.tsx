// The white card and icon tile shared by the empty, error, no-access and session-ended
// views (Reports, NoAccess and the other design boards).
import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type IconTone = 'primary' | 'danger' | 'neutral'

const toneClasses: Record<IconTone, string> = {
  primary: 'bg-primary-light text-primary',
  danger: 'bg-danger-light text-danger',
  neutral: 'bg-neutral-light text-text',
}

export function IconTile({ tone, size = 'md', children }: { tone: IconTone; size?: 'sm' | 'md' | 'lg'; children: ReactNode }) {
  const sizeClass = { sm: 'size-11.5 rounded-xl', md: 'size-12', lg: 'size-13.5' }[size]
  return (
    <span
      aria-hidden="true"
      className={cn('flex shrink-0 items-center justify-center rounded-card', sizeClass, toneClasses[tone])}
    >
      {children}
    </span>
  )
}

export function StateCard({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-2.5 rounded-card border border-border bg-bg px-6 py-8 text-center',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
