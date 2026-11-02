// The signed-in session (token, expiry and user). Kept in sessionStorage so a refresh
// stays signed in and closing the tab signs out, and mirrored in this slice for the app
// (CLAUDE.md "Session", docs/decisions.md 2026-11-01). Storage can be blocked, so every
// access is guarded. Never put the token in localStorage, a cookie, the URL or a log.
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { ROLES, type SessionView } from '@/types/ekowatch'

export const SESSION_STORAGE_KEY = 'ekowatch.session'

// ended: the last session ran out or was refused, as opposed to never signed in or
// signed out on purpose.
export type SessionState = { session: SessionView | null; ended: boolean }

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
// The session saved in this tab, read on start-up. A session that has expired since is
// cleared and reported as ended, so the app can say "Your session has ended" instead of
// silently showing sign-in.
export function loadStoredSession(now: Date): SessionState {
  const signedOut: SessionState = { session: null, ended: false }
  let raw: string | null
  try {
    raw = sessionStorage.getItem(SESSION_STORAGE_KEY)
  } catch {
    return signedOut
  }
  if (!raw) return signedOut
  let value: unknown = null
  try {
    value = JSON.parse(raw)
  } catch {
    // Unreadable: treat as signed out.
  }
  if (isStoredSession(value)) {
    if (!isSessionExpired(value.expiresAt, now)) return { session: value, ended: false }
    clearStoredSession()
    return { session: null, ended: true }
  }
  clearStoredSession()
  return signedOut
}

const initialState: SessionState = { session: null, ended: false }

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    sessionStarted(state, action: PayloadAction<SessionView>) {
      state.session = action.payload
      state.ended = false
    },
    // The user signed out on purpose.
    sessionEnded(state) {
      state.session = null
      state.ended = false
    },
    // The session ran out (expiresAt passed) or the service refused it (401): the user
    // is told and asked to sign in again.
    sessionExpired(state) {
      state.session = null
      state.ended = true
    },
  },
  selectors: {
    selectSession: (state) => state.session,
    selectSessionEnded: (state) => state.ended,
    selectAccessToken: (state) => state.session?.accessToken ?? null,
    selectCurrentUser: (state) => state.session?.user ?? null,
  },
})

export const { sessionStarted, sessionEnded, sessionExpired } = sessionSlice.actions
export const { selectSession, selectSessionEnded, selectAccessToken, selectCurrentUser } =
  sessionSlice.selectors
