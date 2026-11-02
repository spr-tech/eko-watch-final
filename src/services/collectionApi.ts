// Collection schedules and recording a collection (build plan section 8).
import { api } from '@/services/api'
import { checkEnum } from '@/services/checkReply'
import { COLLECTION_STATUSES, type CollectionScheduleView, type CollectionView, type LocalDate, type Page, type Uuid } from '@/types/ekowatch'

// GET /collection-schedules. The deployed backend requires wardId as well as fromDate and
// toDate (inclusive, at most 31 days apart).
export type ListCollectionSchedulesArgs = {
  wardId: Uuid
  fromDate: LocalDate
  toDate: LocalDate
  streetId?: Uuid
  page?: number
  size?: number
}

export type RecordCollectionArgs = { streetId: Uuid; collectionDate: LocalDate }

// The PUT answers 201 when it records the collection and 200 when it was already
// recorded; the screen says which.
export type RecordCollectionResult = { collection: CollectionView; alreadyRecorded: boolean }

export const collectionApi = api.injectEndpoints({
  endpoints: (build) => ({
    listCollectionSchedules: build.query<Page<CollectionScheduleView>, ListCollectionSchedulesArgs>({
      query: (params) => ({ url: '/collection-schedules', params }),
      transformResponse: (page: Page<CollectionScheduleView>) => {
        page.items.forEach((item) => checkEnum('collectionStatus', item.collectionStatus, COLLECTION_STATUSES))
        return page
      },
      providesTags: [{ type: 'Schedule', id: 'LIST' }],
    }),
    recordCollection: build.mutation<RecordCollectionResult, RecordCollectionArgs>({
      // Empty body (CLAUDE.md "RTK Query rules").
      query: ({ streetId, collectionDate }) => ({
        url: `/streets/${encodeURIComponent(streetId)}/collections/${encodeURIComponent(collectionDate)}`,
        method: 'PUT',
      }),
      transformResponse: (collection: CollectionView, meta) => {
        checkEnum('collectionStatus', collection.collectionStatus, COLLECTION_STATUSES)
        return { collection, alreadyRecorded: meta?.response?.status === 200 }
      },
      invalidatesTags: [{ type: 'Schedule', id: 'LIST' }, { type: 'Dashboard', id: 'LIST' }],
    }),
  }),
})

export const { useListCollectionSchedulesQuery, useRecordCollectionMutation } = collectionApi
