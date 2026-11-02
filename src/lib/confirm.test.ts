import { describe, expect, it } from 'vitest'
import { canConfirm, confirmOptimistically, isCertainRefusal } from '@/lib/confirm'

describe('confirmOptimistically', () => {
  it('adds one confirmation the first time', () => {
    expect(confirmOptimistically({ confirmationCount: 2, confirmedByMe: false, floodStatus: null })).toEqual({
      confirmationCount: 3,
      confirmedByMe: true,
      floodStatus: null,
    })
  })

  it('never counts the same person twice, as when re-confirming an expired flood', () => {
    const report = { confirmationCount: 2, confirmedByMe: true, floodStatus: 'EXPIRED' }
    expect(confirmOptimistically(report)).toBe(report)
  })
})

describe('canConfirm', () => {
  it('allows one confirmation, and again for an expired flood', () => {
    expect(canConfirm({ confirmationCount: 0, confirmedByMe: false, floodStatus: null })).toBe(true)
    expect(canConfirm({ confirmationCount: 1, confirmedByMe: true, floodStatus: null })).toBe(false)
    expect(canConfirm({ confirmationCount: 1, confirmedByMe: true, floodStatus: 'CURRENT' })).toBe(false)
    expect(canConfirm({ confirmationCount: 1, confirmedByMe: true, floodStatus: 'EXPIRED' })).toBe(true)
  })
})

describe('isCertainRefusal', () => {
  it('undoes only on an explicit refusal, never on a lost reply', () => {
    expect(isCertainRefusal(409)).toBe(true)
    expect(isCertainRefusal(403)).toBe(true)
    expect(isCertainRefusal(404)).toBe(true)
    expect(isCertainRefusal('FETCH_ERROR')).toBe(false)
    expect(isCertainRefusal('TIMEOUT_ERROR')).toBe(false)
    expect(isCertainRefusal(502)).toBe(false)
  })
})
