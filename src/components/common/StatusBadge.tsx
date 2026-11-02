// A flood or collection status as a pill: always the word, plus a dot and colour, never
// colour alone (Reports and MyStreet boards). Describes the current state, so it is not
// announced; pages announce changes in their own live regions.
import { COLLECTION_STATUS_LABELS, FLOOD_STATUS_LABELS } from '@/constants/status'
import { cn } from '@/lib/cn'
import type { CollectionStatus, FloodStatus } from '@/types/ekowatch'

export type BadgeStatus = FloodStatus | CollectionStatus

const STYLES: Record<BadgeStatus, string> = {
  CURRENT: 'bg-success-light text-success',
  EXPIRED: 'bg-neutral-light text-text-muted',
  SCHEDULED: 'bg-primary-light text-primary',
  DONE: 'bg-success-light text-success',
  MISSED: 'bg-danger-light text-danger',
  DISPUTED: 'bg-warning-light text-warning',
}

const LABELS: Record<BadgeStatus, string> = { ...FLOOD_STATUS_LABELS, ...COLLECTION_STATUS_LABELS }

export function StatusBadge({ status, className }: { status: BadgeStatus; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex min-h-6.5 items-center gap-1.5 rounded-full px-2.5 text-[13px] font-extrabold whitespace-nowrap',
        STYLES[status],
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.75 rounded-full bg-current" />
      {LABELS[status]}
    </span>
  )
}
