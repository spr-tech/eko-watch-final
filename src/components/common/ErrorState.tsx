// Something failed to load (Reports.dc.html error board). Announced to screen readers as
// an alert. With onRetry it offers "Try again"; the description defaults to the design's.
import { buttonStyles } from '@/components/common/buttonStyles'
import { AlertCircleIcon, RefreshIcon } from '@/components/common/Icons'
import { IconTile, StateCard } from '@/components/common/StateCard'

type ErrorStateProps = {
  title: string
  description?: string
  onRetry?: () => void
  retrying?: boolean
  retryLabel?: string
  headingLevel?: 'h2' | 'h3'
}

export function ErrorState({
  title,
  description = 'Check your connection, then try again.',
  onRetry,
  retrying = false,
  retryLabel = 'Try again',
  headingLevel = 'h2',
}: ErrorStateProps) {
  const Heading = headingLevel
  return (
    <StateCard role="alert">
      <IconTile tone="danger" size="md">
        <AlertCircleIcon size={24} />
      </IconTile>
      <Heading className="text-lg font-extrabold">{title}</Heading>
      <p className="max-w-[34em] text-text-muted">{description}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          disabled={retrying}
          aria-busy={retrying || undefined}
          className={`${buttonStyles.navy} mt-1.5`}
        >
          <RefreshIcon size={18} />
          {retrying ? 'Trying again…' : retryLabel}
        </button>
      )}
    </StateCard>
  )
}
