// One Idempotency-Key (a UUID) per user intent, for createReport (CLAUDE.md "RTK Query
// rules", build plan section 9). The key is made when first asked for and stays the same
// for every retry of that report, including after a lost response, so the server can
// replay instead of creating a second report. Call startNewReport() only when the user
// begins a genuinely new report (after a confirmed success, or "Report another problem").
import { useCallback, useRef } from 'react'

export function useIdempotencyKey() {
  const keyRef = useRef<string | null>(null)

  const getKey = useCallback(() => {
    keyRef.current ??= crypto.randomUUID()
    return keyRef.current
  }, [])

  const startNewReport = useCallback(() => {
    keyRef.current = null
  }, [])

  return { getKey, startNewReport }
}
