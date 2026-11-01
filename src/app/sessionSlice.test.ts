import { describe, expect, it } from 'vitest'
import { isSessionExpired, loadStoredSession, SESSION_STORAGE_KEY } from '@/app/sessionSlice'

const now = new Date('2026-11-01T12:00:00Z')

describe('isSessionExpired', () => {
  it('is false before expiresAt', () => {
    expect(isSessionExpired('2026-11-01T12:00:01Z', now)).toBe(false)
  })

  it('is true at and after expiresAt', () => {
    expect(isSessionExpired('2026-11-01T12:00:00Z', now)).toBe(true)
    expect(isSessionExpired('2026-11-01T11:59:59Z', now)).toBe(true)
  })

  it('treats an unreadable time as expired', () => {
    expect(isSessionExpired('not a date', now)).toBe(true)
  })
})

describe('loadStoredSession', () => {
  it('is null when nothing is stored', () => {
    expect(loadStoredSession(now)).toBeNull()
  })

  it('is null for unreadable JSON, and clears it', () => {
    sessionStorage.setItem(SESSION_STORAGE_KEY, '{not json')
    expect(loadStoredSession(now)).toBeNull()
    expect(sessionStorage.getItem(SESSION_STORAGE_KEY)).toBeNull()
  })
})
