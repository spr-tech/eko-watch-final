// Wards and their streets (build plan section 8, operationIds listWards and listStreets).
import { api } from '@/services/api'
import type { StreetView, Uuid, WardView } from '@/types/ekowatch'

export const wardApi = api.injectEndpoints({
  endpoints: (build) => ({
    listWards: build.query<WardView[], void>({
      query: () => '/wards',
    }),
    listStreets: build.query<StreetView[], Uuid>({
      query: (wardId) => `/wards/${encodeURIComponent(wardId)}/streets`,
    }),
  }),
})

export const { useListWardsQuery, useListStreetsQuery } = wardApi
