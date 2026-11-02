// Shows a ward screen once its ward is known (hooks/useWard.ts), with the states for
// while it loads, when it fails, when there is no ward to show, and when the ward office
// has several wards to choose from.
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { buttonStyles } from '@/components/common/buttonStyles'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { LoadingState } from '@/components/common/LoadingState'
import { ROUTES } from '@/constants/routes'
import { useWard, WARD_PARAM } from '@/hooks/useWard'
import { describeError, toErrorInput } from '@/services/errors'

export type ReadyWard = { wardId: string; wardName: string | null }

type WardGateProps = {
  loadingLabel: string
  children: (ward: ReadyWard) => ReactNode
}

const NONE_COPY = {
  'no-street': {
    title: 'Choose your street first.',
    description: 'EkoWatch shows what is happening in your ward once you have chosen your street.',
  },
  'not-assigned': {
    title: 'No streets are assigned to you yet.',
    description: 'Ask the ward office to assign your streets. Until then there is nothing to show here.',
  },
  'no-ward': {
    title: 'No ward is set up yet.',
    description: 'EkoWatch has no ward to show. Ask the EkoWatch team to set one up.',
  },
} as const

export function WardGate({ loadingLabel, children }: WardGateProps) {
  const ward = useWard()
  if (ward.status === 'loading') return <LoadingState label={loadingLabel} />
  if (ward.status === 'error') {
    const message = describeError(toErrorInput(ward.error))
    return <ErrorState title={message.title} description={message.detail} onRetry={ward.retry} />
  }
  if (ward.kind === 'none') {
    const copy = NONE_COPY[ward.reason]
    return (
      <EmptyState
        title={copy.title}
        description={copy.description}
        action={
          ward.reason === 'no-street' && (
            <Link to={ROUTES.setup} className={buttonStyles.green}>
              Choose your street
            </Link>
          )
        }
      />
    )
  }
  if (ward.kind === 'choose') {
    return (
      <EmptyState
        title="Choose a ward."
        description="You can see more than one ward. Choose the one to show."
        action={ward.wards.map((w) => (
          <Link key={w.wardId} to={`?${WARD_PARAM}=${encodeURIComponent(w.wardId)}`} className={buttonStyles.line}>
            {w.wardName}
          </Link>
        ))}
      />
    )
  }
  return children({ wardId: ward.wardId, wardName: ward.wardName })
}
