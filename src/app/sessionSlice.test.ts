import { describe, expect, it } from 'vitest'
import {
  isSessionExpired,
  loadStoredSession,
  SESSION_STORAGE_KEY,
  sessionEnded,
  sessionExpired,
  sessionSlice,
} from '@/app/sessionSlice'

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
  it('is signed out, not ended, when nothing is stored', () => {
    expect(loadStoredSession(now)).toEqual({ session: null, ended: false })
  })

  it('is signed out for unreadable JSON, and clears it', () => {
    sessionStorage.setItem(SESSION_STORAGE_KEY, '{not json')
    expect(loadStoredSession(now)).toEqual({ session: null, ended: false })
    expect(sessionStorage.getItem(SESSION_STORAGE_KEY)).toBeNull()
  })
})

describe('session reducer', () => {
  const reducer = sessionSlice.reducer
  const signedOut = { session: null, ended: false }

  it('marks the session as ended when it expires or is refused', () => {
    expect(reducer(signedOut, sessionExpired())).toEqual({ session: null, ended: true })
  })

  it('does not mark it ended when the user signs out on purpose', () => {
    expect(reducer({ session: null, ended: true }, sessionEnded())).toEqual(signedOut)
  })
})
