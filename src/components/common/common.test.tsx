// The shared state components: wording, text alongside colour, and announcements.
// Literal values only; no fabricated API responses.
import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { LoadingState, WAKING_UP_AFTER_MS } from '@/components/common/LoadingState'
import { StatusBadge } from '@/components/common/StatusBadge'
import { formatEvidenceAge } from '@/lib/format'

afterEach(() => {
  vi.useRealTimers()
})

describe('StatusBadge', () => {
  it.each([
    ['CURRENT', 'Current'],
    ['EXPIRED', 'Expired'],
    ['SCHEDULED', 'Scheduled'],
    ['DONE', 'Done'],
    ['MISSED', 'Missed'],
    ['DISPUTED', 'Disputed'],
  ] as const)('shows %s as the word "%s", not colour alone', (status, label) => {
    render(<StatusBadge status={status} />)
    expect(screen.getByText(label)).toBeInTheDocument()
  })
})

describe('formatEvidenceAge', () => {
  it('names no one and uses the server timestamp', () => {
    expect(formatEvidenceAge('2026-10-28T12:00:00Z', new Date('2026-10-28T14:00:00Z'))).toBe(
      'Community report · last confirmed 2 h ago',
    )
  })
})

describe('LoadingState', () => {
  it('announces what is loading', () => {
    render(<LoadingState label="Loading reports" />)
    expect(screen.getByRole('status')).toHaveTextContent('Loading reports')
  })

  it('says the service may be waking up when loading is slow, instead of spinning forever', () => {
    vi.useFakeTimers()
    render(<LoadingState label="Loading reports" />)
    act(() => {
      vi.advanceTimersByTime(WAKING_UP_AFTER_MS)
    })
    expect(screen.getByRole('status')).toHaveTextContent('EkoWatch may be waking up')
  })
})

describe('ErrorState', () => {
  it('is announced as an alert with the default advice', () => {
    render(<ErrorState title="We couldn't load reports." />)
    expect(screen.getByRole('alert')).toHaveTextContent("We couldn't load reports.")
    expect(screen.getByRole('alert')).toHaveTextContent('Check your connection, then try again.')
  })

  it('offers Try again only when it can retry', () => {
    const { rerender } = render(<ErrorState title="Failed" />)
    expect(screen.queryByRole('button')).toBeNull()
    rerender(<ErrorState title="Failed" onRetry={() => {}} />)
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
  })
})

describe('EmptyState', () => {
  it('shows a heading and description', () => {
    render(<EmptyState title="No reports in your ward yet." description="Report it and your neighbours can confirm it." />)
    expect(screen.getByRole('heading', { name: 'No reports in your ward yet.' })).toBeInTheDocument()
  })
})
