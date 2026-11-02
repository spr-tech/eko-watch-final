// The test run uses TZ=America/New_York (vite.config.ts), so any formatting that uses
// the machine's timezone instead of Lagos gives the wrong day here and fails.
import { describe, expect, it } from 'vitest'
import {
  formatAge,
  formatCollectionDate,
  formatEvidenceAge,
  formatFloodCountdown,
  formatLagosTime,
  formatWhen,
  lagosDate,
  shiftDate,
} from '@/lib/format'

describe('lagosDate', () => {
  it('uses the Lagos calendar day, not the machine timezone', () => {
    // 23:30 UTC is already 00:30 the next day in Lagos (UTC+1), but still the same day in New York.
    expect(lagosDate(new Date('2026-10-27T23:30:00Z'))).toBe('2026-10-28')
  })
})

describe('formatCollectionDate', () => {
  it('formats a collection date as weekday, day and month', () => {
    expect(formatCollectionDate('2026-10-28')).toBe('Wednesday 28 October')
  })

  it('does not shift the day in a timezone behind UTC', () => {
    expect(formatCollectionDate('2026-11-01')).toBe('Sunday 1 November')
  })

  it('rejects anything that is not YYYY-MM-DD', () => {
    expect(() => formatCollectionDate('28/10/2026')).toThrow()
  })
})

describe('formatAge', () => {
  const now = new Date('2026-10-28T14:00:00Z') // 15:00 in Lagos

  it('says "just now" under a minute, and for a time slightly in the future', () => {
    expect(formatAge('2026-10-28T13:59:30Z', now)).toBe('just now')
    expect(formatAge('2026-10-28T14:00:20Z', now)).toBe('just now')
  })

  it('counts minutes under an hour', () => {
    expect(formatAge('2026-10-28T13:48:00Z', now)).toBe('12 min ago')
    expect(formatAge('2026-10-28T13:00:01Z', now)).toBe('59 min ago')
  })

  it('counts hours earlier the same Lagos day', () => {
    expect(formatAge('2026-10-28T11:00:00Z', now)).toBe('3 h ago')
  })

  it('says "yesterday" for the previous Lagos day', () => {
    expect(formatAge('2026-10-27T10:00:00Z', now)).toBe('yesterday')
    // 23:30 UTC on the 27th is 00:30 on the 28th in Lagos: today, not yesterday.
    expect(formatAge('2026-10-27T23:30:00Z', now)).toBe('14 h ago')
  })

  it('gives the date for anything older', () => {
    expect(formatAge('2026-10-20T10:00:00Z', now)).toBe('20 October')
  })
})

describe('formatFloodCountdown', () => {
  const now = new Date('2026-10-28T14:00:00Z')

  it('counts hours and minutes down to expiry', () => {
    expect(formatFloodCountdown('2026-10-28T17:40:00Z', now)).toBe('Expires in 3 h 40 min')
    expect(formatFloodCountdown('2026-10-28T16:00:00Z', now)).toBe('Expires in 2 h')
    expect(formatFloodCountdown('2026-10-28T14:40:00Z', now)).toBe('Expires in 40 min')
  })

  it('never shows 0 min before expiry', () => {
    expect(formatFloodCountdown('2026-10-28T14:00:10Z', now)).toBe('Expires in 1 min')
  })

  it('says "Expired" at and after expiresAt', () => {
    expect(formatFloodCountdown('2026-10-28T14:00:00Z', now)).toBe('Expired')
    expect(formatFloodCountdown('2026-10-28T09:00:00Z', now)).toBe('Expired')
  })
})

describe('formatWhen', () => {
  const now = new Date('2026-10-31T12:00:00Z')

  it('reads well inside a sentence', () => {
    expect(formatWhen('2026-10-31T09:00:00Z', now)).toBe('3 h ago')
    expect(formatWhen('2026-10-30T09:00:00Z', now)).toBe('yesterday')
    expect(formatWhen('2026-10-28T09:00:00Z', now)).toBe('on 28 October')
  })

  it('is what the evidence age uses', () => {
    expect(formatEvidenceAge('2026-10-28T09:00:00Z', now)).toBe('Community report · last confirmed on 28 October')
  })
})

describe('formatLagosTime', () => {
  it('gives the time of day in Lagos (UTC+1), not the device timezone', () => {
    expect(formatLagosTime('2026-11-02T08:58:00Z')).toBe('09:58')
    expect(formatLagosTime('2026-11-02T23:30:00Z')).toBe('00:30')
  })
})

describe('shiftDate', () => {
  it('moves across months and years', () => {
    expect(shiftDate('2026-11-02', -30)).toBe('2026-10-03')
    expect(shiftDate('2026-12-31', 1)).toBe('2027-01-01')
    expect(shiftDate('2026-11-02', 0)).toBe('2026-11-02')
  })

  it('rejects anything that is not a calendar date', () => {
    expect(() => shiftDate('2 November', 1)).toThrow()
  })
})
