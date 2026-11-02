// The one RTK Query API for the app. Each domain file (authApi.ts, reportApi.ts and so
// on) adds its endpoints with api.injectEndpoints, keyed by the OpenAPI operationId.
// Never create a second createApi.
import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { sessionExpired } from '@/app/sessionSlice'
import { env } from '@/config/env'
import type { SessionView } from '@/types/ekowatch'

// The part of the store this file reads. Typed here rather than importing RootState,
// which would make store.ts and api.ts import each other.
type StateWithSession = { session: { session: SessionView | null } }

// The free-tier backend can take up to a minute to wake, so wait longer than that, but
// never forever: a request still unanswered after this fails as TIMEOUT_ERROR.
const REQUEST_TIMEOUT_MS = 90_000

const rawBaseQuery = fetchBaseQuery({
  baseUrl: env.apiBaseUrl,
  timeout: REQUEST_TIMEOUT_MS,
  prepareHeaders: (headers, { getState, endpoint }) => {
    // A fresh ID per request lets one user's journey be followed in the service logs.
    headers.set('X-Request-ID', crypto.randomUUID())
    // Every request except signing in carries the token.
    const token = (getState() as StateWithSession).session.session?.accessToken
    if (token && endpoint !== 'createSession') headers.set('Authorization', `Bearer ${token}`)
    return headers
  },
})

// A 401 on a signed-in request means the service no longer accepts the token: end the
// session so RequireSession says "Your session has ended". A 401 from createSession is
// just wrong details, handled by the sign-in form.
const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, apiContext, extra) => {
  const result = await rawBaseQuery(args, apiContext, extra)
  const signedIn = (apiContext.getState() as StateWithSession).session.session !== null
  if (result.error?.status === 401 && apiContext.endpoint !== 'createSession' && signedIn) {
    apiContext.dispatch(sessionExpired())
  }
  return result
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Report', 'Hazards', 'Dashboard', 'Schedule', 'CurrentUser'],
  endpoints: () => ({}),
})
