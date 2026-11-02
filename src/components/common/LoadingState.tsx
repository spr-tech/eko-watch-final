// Loading (Reports.dc.html loading board): skeleton rows, with the label read out to
// screen readers. The backend sleeps on its free tier and the first request can take up
// to a minute, so after a few seconds it says so in words instead of spinning forever.
import { useEffect, useState } from 'react'

// How long before the "waking up" note appears.
export const WAKING_UP_AFTER_MS = 5000

type LoadingStateProps = {
  // What is loading, e.g. "Loading reports". Read out, not shown.
  label: string
  rows?: number
}

export function LoadingState({ label, rows = 5 }: LoadingStateProps) {
  const [slow, setSlow] = useState(false)
  useEffect(() => {
    const timer = window.setTimeout(() => setSlow(true), WAKING_UP_AFTER_MS)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div aria-busy="true">
      <p role="status" className={slow ? 'mb-3 font-bold text-text-muted' : 'sr-only'}>
        {slow ? `${label}. EkoWatch may be waking up, which can take up to a minute.` : label}
      </p>
      <ul aria-hidden="true" className="flex flex-col gap-2.5">
        {Array.from({ length: rows }, (_, i) => (
          <li key={i} className="flex items-center gap-3.5 rounded-card border border-border bg-bg px-4.5 py-4">
            <div className="skeleton size-11 shrink-0 rounded-xl" />
            <div className="flex flex-1 flex-col gap-2">
              <div className="skeleton h-3.5 w-2/5" />
              <div className="skeleton h-3 w-[70%]" />
            </div>
            <div className="skeleton hidden h-10 w-22.5 rounded-md sm:block" />
          </li>
        ))}
      </ul>
    </div>
  )
}
