// The signed-in session (token, expiry and user). Kept in sessionStorage so a refresh
// stays signed in and closing the tab signs out, and mirrored in this slice for the app
// (CLAUDE.md "Session", docs/decisions.md 2026-11-01). Storage can be blocked, so every
// access is guarded. Never put the token in localStorage, a cookie, the URL or a log.
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { ROLES, type SessionView } from '@/types/ekowatch'

export const SESSION_STORAGE_KEY = 'ekowatch.session'

type SessionState = { session: SessionView | null }

// True once expiresAt (an ISO 8601 instant from the server) has passed. A value that
// can't be read counts as expired.
export function isSessionExpired(expiresAt: string, now: Date): boolean {
  const expires = Date.parse(expiresAt)
  return Number.isNaN(expires) || expires <= now.getTime()
}

// Only enough checking to reject a stale or tampered value; the server checks the token.
function isStoredSession(value: unknown): value is SessionView {
  if (typeof value !== 'object' || value === null) return false
  const session = value as Partial<SessionView>
  return (
    typeof session.accessToken === 'string' &&
    session.tokenType === 'Bearer' &&
    typeof session.expiresAt === 'string' &&
    typeof session.user === 'object' &&
    session.user !== null &&
    (ROLES as readonly string[]).includes(session.user.role)
  )
}

export function clearStoredSession() {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY)
  } catch {
    // Nothing stored, nothing to clear.
  }
}

export function saveStoredSession(session: SessionView) {
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
  } catch {
    // Signed in for this page only; a refresh will ask again.
  }
}

// The stored session, or null when there is none, it can't be read, or it has expired.
export function loadStoredSession(now: Date): SessionView | null {
  let raw: string | null
  try {
    raw = sessionStorage.getItem(SESSION_STORAGE_KEY)
  } catch {
    return null
  }
  if (!raw) return null
  try {
    const value: unknown = JSON.parse(raw)
    if (isStoredSession(value) && !isSessionExpired(value.expiresAt, now)) return value
  } catch {
    // Unreadable: treat as signed out.
  }
  clearStoredSession()
  return null
}

const initialState: SessionState = { session: null }

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    sessionStarted(state, action: PayloadAction<SessionView>) {
      state.session = action.payload
    },
    sessionEnded(state) {
      state.session = null
    },
  },
  selectors: {
    selectSession: (state) => state.session,
    selectAccessToken: (state) => state.session?.accessToken ?? null,
    selectCurrentUser: (state) => state.session?.user ?? null,
  },
})

export const { sessionStarted, sessionEnded } = sessionSlice.actions
export const { selectSession, selectAccessToken, selectCurrentUser } = sessionSlice.selectors
