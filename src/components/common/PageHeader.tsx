// The page heading, an optional line under it and an optional primary action beside it,
// visible on load at every target size (CLAUDE.md "Viewport and density").
import type { ReactNode } from 'react'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

type PageHeaderProps = {
  title: string
  subtitle?: ReactNode
  action?: ReactNode
  // The tab title, when it should differ from the heading.
  documentTitle?: string
}

export const pageTitleClass = 'text-[clamp(1.75rem,2.2vw,1.9rem)] leading-[1.15] font-extrabold tracking-[-0.6px]'

export function PageHeader({ title, subtitle, action, documentTitle }: PageHeaderProps) {
  useDocumentTitle(documentTitle ?? title)
  return (
    <div className="mb-4.5 flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
      <div className="min-w-0">
        <h1 className={pageTitleClass}>{title}</h1>
        {subtitle && <div className="mt-1 text-text-muted">{subtitle}</div>}
      </div>
      {action}
    </div>
  )
}
