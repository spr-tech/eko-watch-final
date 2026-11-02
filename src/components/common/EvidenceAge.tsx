// How fresh a report's evidence is, from the server's lastEvidenceAt, never a time made
// in the browser: "Community report · last confirmed 2 h ago".
import { useNow } from '@/hooks/useNow'
import { formatEvidenceAge } from '@/lib/format'

export function EvidenceAge({ lastEvidenceAt, className }: { lastEvidenceAt: string; className?: string }) {
  const now = useNow()
  return (
    <p className={className ?? 'text-sm font-bold text-text-muted'}>
      <time dateTime={lastEvidenceAt}>{formatEvidenceAge(lastEvidenceAt, now)}</time>
    </p>
  )
}
