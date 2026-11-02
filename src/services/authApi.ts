// Signing in (build plan section 8, operationId createSession). The only request sent
// without a token; api.ts leaves the Authorization header off for it.
import { api } from '@/services/api'
import type { CreateSessionRequest, SessionView } from '@/types/ekowatch'

// Sign-in gives up sooner than other requests (api.ts waits 90 s): after 45 s the form
// cancels the request and asks the user to press Sign in again.
export const SIGN_IN_TIMEOUT_MS = 45_000

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    createSession: build.mutation<SessionView, CreateSessionRequest>({
      query: (body) => ({ url: '/auth/sessions', method: 'POST', body }),
    }),
  }),
})

export const { useCreateSessionMutation } = authApi
