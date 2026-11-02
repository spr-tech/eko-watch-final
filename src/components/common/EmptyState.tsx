// First use with no data, or nothing matching a filter (Reports.dc.html empty boards).
// The action is optional: a button or link styled with buttonStyles.
import type { ReactNode } from 'react'
import { ListIcon } from '@/components/common/Icons'
import { IconTile, StateCard } from '@/components/common/StateCard'

type EmptyStateProps = {
  title: string
  description: string
  icon?: ReactNode
  action?: ReactNode
  headingLevel?: 'h2' | 'h3'
}

export function EmptyState({ title, description, icon, action, headingLevel = 'h2' }: EmptyStateProps) {
  const Heading = headingLevel
  return (
    <StateCard className="py-9">
      <IconTile tone="primary" size="md">
        {icon ?? <ListIcon size={26} />}
      </IconTile>
      <Heading className="text-lg font-extrabold">{title}</Heading>
      <p className="max-w-[34em] text-text-muted">{description}</p>
      {action && <div className="mt-1.5 flex flex-wrap justify-center gap-2.5">{action}</div>}
    </StateCard>
  )
}
