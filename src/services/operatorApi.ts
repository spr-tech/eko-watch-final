// An operator's assigned streets (operationId listMyAssignedStreets). With fromDate and
// toDate the backend returns only the assigned streets scheduled in that range; without
// them, every assigned street (docs/decisions.md, contract differences).
import { api } from '@/services/api'
import type { LocalDate, StreetView } from '@/types/ekowatch'

export type ListMyAssignedStreetsArgs = { fromDate?: LocalDate; toDate?: LocalDate }

export const operatorApi = api.injectEndpoints({
  endpoints: (build) => ({
    listMyAssignedStreets: build.query<StreetView[], ListMyAssignedStreetsArgs>({
      query: (params) => ({ url: '/operators/me/streets', params }),
    }),
  }),
})

export const { useListMyAssignedStreetsQuery } = operatorApi
