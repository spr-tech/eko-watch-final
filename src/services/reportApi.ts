// Reports (build plan section 8). Endpoint keys are the OpenAPI operationIds.
import { api } from '@/services/api'
import { confirmOptimistically, isCertainRefusal } from '@/lib/confirm'
import { checkReport } from '@/services/checkReply'
import { toErrorInput } from '@/services/errors'
import type { CreateReportRequest, FloodStatus, Page, ReportType, ReportView, Uuid } from '@/types/ekowatch'

export type ReportSort = 'CONFIRMATIONS' | 'NEWEST'

// GET /reports. wardId is required; floodStatus is only sent with reportType=FLOODED_ROAD.
export type ListReportsArgs = {
  wardId: Uuid
  streetId?: Uuid
  reportType?: ReportType
  floodStatus?: FloodStatus
  sort?: ReportSort
  page?: number
  size?: number
}

// One Idempotency-Key per report the user means to send, reused on every retry of it.
export type CreateReportArgs = { body: CreateReportRequest; idempotencyKey: string }

export const reportApi = api.injectEndpoints({
  endpoints: (build) => ({
    listReports: build.query<Page<ReportView>, ListReportsArgs>({
      query: (params) => ({ url: '/reports', params }),
      transformResponse: (page: Page<ReportView>) => ({ ...page, items: page.items.map(checkReport) }),
      providesTags: (result) => [
        { type: 'Report', id: 'LIST' },
        ...(result?.items.map((report) => ({ type: 'Report' as const, id: report.reportId })) ?? []),
      ],
    }),
    getReport: build.query<ReportView, Uuid>({
      query: (reportId) => `/reports/${encodeURIComponent(reportId)}`,
      transformResponse: checkReport,
      providesTags: (_result, _error, reportId) => [{ type: 'Report', id: reportId }],
    }),
    // The one optimistic update. While in flight the cached report counts the confirmation
    // (once per person). An explicit refusal undoes it; a lost reply leaves it in place for
    // the screen to say "can't tell yet" and read the report again, which replaces it with
    // the server's version. On success the server's ReportView replaces it.
    confirmReport: build.mutation<ReportView, Uuid>({
      query: (reportId) => ({ url: `/reports/${encodeURIComponent(reportId)}/confirmations/me`, method: 'PUT' }),
      transformResponse: checkReport,
      async onQueryStarted(reportId, { dispatch, queryFulfilled }) {
        const patch = dispatch(reportApi.util.updateQueryData('getReport', reportId, (draft) => confirmOptimistically(draft)))
        try {
          const { data } = await queryFulfilled
          dispatch(reportApi.util.upsertQueryData('getReport', reportId, data))
        } catch (failure) {
          const { error } = failure as { error?: Parameters<typeof toErrorInput>[0] }
          if (isCertainRefusal(toErrorInput(error).status)) patch.undo()
        }
      },
      invalidatesTags: (result) =>
        result
          ? [
              { type: 'Report', id: 'LIST' },
              { type: 'Hazards', id: 'LIST' },
              { type: 'Dashboard', id: 'LIST' },
            ]
          : [],
    }),
    createReport: build.mutation<ReportView, CreateReportArgs>({
      query: ({ body, idempotencyKey }) => ({
        url: '/reports',
        method: 'POST',
        body,
        headers: { 'Idempotency-Key': idempotencyKey },
      }),
      transformResponse: checkReport,
      // Even after a failure: a lost reply may still have created the report.
      invalidatesTags: [
        { type: 'Report', id: 'LIST' },
        { type: 'Hazards', id: 'LIST' },
        { type: 'Dashboard', id: 'LIST' },
      ],
    }),
  }),
})

export const { useListReportsQuery, useGetReportQuery, useCreateReportMutation, useConfirmReportMutation } = reportApi
