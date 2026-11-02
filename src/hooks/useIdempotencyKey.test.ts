import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useIdempotencyKey } from '@/hooks/useIdempotencyKey'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

describe('useIdempotencyKey', () => {
  it('gives a UUID', () => {
    const { result } = renderHook(() => useIdempotencyKey())
    expect(result.current.getKey()).toMatch(UUID)
  })

  it('keeps the same key for every retry of the same report, across re-renders', () => {
    const { result, rerender } = renderHook(() => useIdempotencyKey())
    const first = result.current.getKey()
    expect(result.current.getKey()).toBe(first)
    rerender()
    expect(result.current.getKey()).toBe(first)
  })

  it('makes a new key only when a new report is started', () => {
    const { result } = renderHook(() => useIdempotencyKey())
    const first = result.current.getKey()
    result.current.startNewReport()
    const second = result.current.getKey()
    expect(second).toMatch(UUID)
    expect(second).not.toBe(first)
    expect(result.current.getKey()).toBe(second)
  })

  it('gives each form its own key', () => {
    const a = renderHook(() => useIdempotencyKey())
    const b = renderHook(() => useIdempotencyKey())
    expect(a.result.current.getKey()).not.toBe(b.result.current.getKey())
  })
})
