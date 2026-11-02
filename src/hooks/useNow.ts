// The current time for screens, re-read once a minute so ages ("12 min ago") and flood
// countdowns stay true. Pure formatting functions take this as their "now".
import { useEffect, useState } from 'react'

export function useNow(intervalMs = 60_000): Date {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), intervalMs)
    return () => window.clearInterval(timer)
  }, [intervalMs])
  return now
}
