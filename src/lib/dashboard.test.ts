import { describe, expect, it } from 'vitest'
import { dashboardRange, isDashboardEmpty, missedRate } from '@/lib/dashboard'

describe('dashboardRange', () => {
  it('covers the last 30 days including today', () => {
    expect(dashboardRange('2026-11-02')).toEqual({ fromDate: '2026-10-04', toDate: '2026-11-02' })
  })
})

describe('missedRate', () => {
  it('is missed over scheduled, rounded', () => {
    expect(missedRate(6, 52)).toBe('12%')
    expect(missedRate(0, 48)).toBe('0%')
    expect(missedRate(46, 51)).toBe('90%')
  })

  it('shows a dash when nothing was scheduled', () => {
    expect(missedRate(0, 0)).toBe('–')
  })
})

describe('isDashboardEmpty', () => {
  it('is empty only with no counts and no operators', () => {
    expect(isDashboardEmpty([0, 0, 0, 0], 0)).toBe(true)
    expect(isDashboardEmpty([0, 1, 0, 0], 0)).toBe(false)
    expect(isDashboardEmpty([0, 0, 0, 0], 1)).toBe(false)
  })
})
