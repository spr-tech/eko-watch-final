// Dates, ages and countdowns, always in Lagos time (Africa/Lagos), never the device's
// timezone, so everyone sees the same day. Every function takes "now" as a parameter so
// results don't depend on the real clock; screens get it from useNow.
// Instants come from the server as ISO 8601 UTC strings; collection dates are
// YYYY-MM-DD calendar dates that are already in Lagos time.

const TIME_ZONE = 'Africa/Lagos'
const MINUTE_MS = 60 * 1000
const HOUR_MS = 60 * MINUTE_MS
const DAY_MS = 24 * HOUR_MS

// en-CA gives YYYY-MM-DD, which compares and parses cleanly.
const lagosDay = new Intl.DateTimeFormat('en-CA', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

// A calendar date has no time or zone, so it is formatted as UTC to stay on that day.
const longDate = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'UTC',
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

const dayMonth = new Intl.DateTimeFormat('en-GB', {
  timeZone: TIME_ZONE,
  day: 'numeric',
  month: 'long',
})

function part(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes): string {
  return parts.find((p) => p.type === type)?.value ?? ''
}

// The Lagos calendar date of an instant, as YYYY-MM-DD.
export function lagosDate(instant: Date): string {
  return lagosDay.format(instant)
}

// Whole Lagos calendar days from a to b (b later gives a positive number).
function lagosDaysBetween(a: Date, b: Date): number {
  return Math.round((Date.parse(lagosDate(b)) - Date.parse(lagosDate(a))) / DAY_MS)
}

// "Wednesday 28 October", for a collectionDate (YYYY-MM-DD).
export function formatCollectionDate(collectionDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(collectionDate)
  if (!match) throw new Error(`Not a YYYY-MM-DD date: ${collectionDate}`)
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])))
  const parts = longDate.formatToParts(date)
  return `${part(parts, 'weekday')} ${part(parts, 'day')} ${part(parts, 'month')}`
}

// How long ago a server timestamp was: "just now", "12 min ago", "3 h ago" (earlier the
// same Lagos day), "yesterday", then "28 October". A time slightly in the future (clock
// difference with the server) counts as "just now".
export function formatAge(instant: string, now: Date): string {
  const then = new Date(instant)
  if (Number.isNaN(then.getTime())) throw new Error(`Not an ISO 8601 instant: ${instant}`)
  const elapsed = now.getTime() - then.getTime()
  if (elapsed < MINUTE_MS) return 'just now'
  if (elapsed < HOUR_MS) return `${Math.floor(elapsed / MINUTE_MS)} min ago`
  const days = lagosDaysBetween(then, now)
  if (days === 0) return `${Math.floor(elapsed / HOUR_MS)} h ago`
  if (days === 1) return 'yesterday'
  const parts = dayMonth.formatToParts(then)
  return `${part(parts, 'day')} ${part(parts, 'month')}`
}

// A flood report's countdown from its expiresAt: "Expires in 3 h 40 min",
// "Expires in 40 min", then "Expired".
export function formatFloodCountdown(expiresAt: string, now: Date): string {
  const expires = new Date(expiresAt)
  if (Number.isNaN(expires.getTime())) throw new Error(`Not an ISO 8601 instant: ${expiresAt}`)
  const remaining = expires.getTime() - now.getTime()
  if (remaining <= 0) return 'Expired'
  // Round up, so the last minute reads "Expires in 1 min", never "0 min".
  const minutes = Math.ceil(remaining / MINUTE_MS)
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours === 0) return `Expires in ${rest} min`
  return rest === 0 ? `Expires in ${hours} h` : `Expires in ${hours} h ${rest} min`
}

// A report's evidence age, from the server's lastEvidenceAt. Reports are community
// evidence, so no reporter is named: "Community report · last confirmed 2 h ago".
export function formatEvidenceAge(lastEvidenceAt: string, now: Date): string {
  return `Community report · last confirmed ${formatAge(lastEvidenceAt, now)}`
}
