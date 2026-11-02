// Signing in (build plan section 8, operationId createSession). The only request sent
// without a token; api.ts leaves the Authorization header off for it.
import { api } from '@/services/api'
import type { CreateSessionRequest, SessionView } from '@/types/ekowatch'

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    createSession: build.mutation<SessionView, CreateSessionRequest>({
      query: (body) => ({ url: '/auth/sessions', method: 'POST', body }),
    }),
  }),
})

export const { useCreateSessionMutation } = authApi
