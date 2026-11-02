// The ward office's dashboard (operationId getWardDashboard).
import { api } from '@/services/api'
import type { LocalDate, Uuid, WardDashboardView } from '@/types/ekowatch'

// fromDate and toDate are required, inclusive, at most 31 days apart.
export type GetWardDashboardArgs = { wardId: Uuid; fromDate: LocalDate; toDate: LocalDate }

export const authorityApi = api.injectEndpoints({
  endpoints: (build) => ({
    getWardDashboard: build.query<WardDashboardView, GetWardDashboardArgs>({
      query: ({ wardId, ...params }) => ({ url: `/wards/${encodeURIComponent(wardId)}/dashboard`, params }),
      providesTags: [{ type: 'Dashboard', id: 'LIST' }],
    }),
  }),
})

export const { useGetWardDashboardQuery } = authorityApi
