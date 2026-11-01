// The one RTK Query API for the app. Each domain file (authApi.ts, reportApi.ts and so
// on) adds its endpoints with api.injectEndpoints, keyed by the OpenAPI operationId.
// Never create a second createApi.
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { env } from '@/config/env'
import type { SessionView } from '@/types/ekowatch'

// The part of the store this file reads. Typed here rather than importing RootState,
// which would make store.ts and api.ts import each other.
type StateWithSession = { session: { session: SessionView | null } }

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: env.apiBaseUrl,
    prepareHeaders: (headers, { getState, endpoint }) => {
      // A fresh ID per request lets one user's journey be followed in the service logs.
      headers.set('X-Request-ID', crypto.randomUUID())
      // Every request except signing in carries the token.
      const token = (getState() as StateWithSession).session.session?.accessToken
      if (token && endpoint !== 'createSession') headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Report', 'Hazards', 'Dashboard', 'Schedule', 'CurrentUser'],
  endpoints: () => ({}),
})
