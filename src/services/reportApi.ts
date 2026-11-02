// Reports (build plan section 8). Endpoint keys are the OpenAPI operationIds.
import { api } from '@/services/api'
import { checkReport } from '@/services/checkReply'
import type { FloodStatus, Page, ReportType, ReportView, Uuid } from '@/types/ekowatch'

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
  }),
})

export const { useListReportsQuery, useGetReportQuery } = reportApi
