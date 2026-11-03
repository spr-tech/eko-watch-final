// The report list's filters and wording (Reports.dc.html), kept pure for tests.
// GET /reports takes one reportType at a time, so the design's "Waste" chip (missed
// pickups and dumping together) is two chips here (docs/decisions.md 2026-11-02).
import type { ListReportsArgs, ReportSort } from '@/services/reportApi'
import type { ReportType } from '@/types/ekowatch'

export type ReportFilter = 'ALL' | ReportType

export const REPORT_FILTERS: { value: ReportFilter; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'FLOODED_ROAD', label: 'Flooding' },
  { value: 'BLOCKED_DRAIN', label: 'Drains' },
  { value: 'MISSED_PICKUP', label: 'Missed pickups' },
  { value: 'ILLEGAL_DUMPING', label: 'Dumping' },
]

export const REPORTS_PAGE_SIZE = 20

// Sorted on the server. Newest first is the default; the address says ?sort=confirmed
// for the other order.
export const REPORT_SORTS: { value: ReportSort; param: string | null; label: string; subtitle: string }[] = [
  { value: 'NEWEST', param: null, label: 'Newest first', subtitle: "Newest first. Reporters' names are never shown." },
  {
    value: 'CONFIRMATIONS',
    param: 'confirmed',
    label: 'Most confirmed',
    subtitle: "Most-confirmed first. Reporters' names are never shown.",
  },
]

export function parseReportSort(value: string | null): ReportSort {
  return value === 'confirmed' ? 'CONFIRMATIONS' : 'NEWEST'
}

// Reads a filter from the address, falling back to All for anything unknown.
export function parseReportFilter(value: string | null): ReportFilter {
  return REPORT_FILTERS.some((f) => f.value === value) ? (value as ReportFilter) : 'ALL'
}

// Reads a zero-based page number from the address ("2" → 1, as the address counts from 1).
export function parsePage(value: string | null): number {
  const n = Number(value)
  return Number.isInteger(n) && n >= 1 ? n - 1 : 0
}

// The GET /reports parameters. "Current floods only" always means flooded roads, and
// floodStatus is only ever sent with reportType=FLOODED_ROAD.
export function reportListArgs(
  wardId: string,
  filter: ReportFilter,
  currentFloodsOnly: boolean,
  sort: ReportSort,
  page: number,
): ListReportsArgs {
  const args: ListReportsArgs = { wardId, sort, page, size: REPORTS_PAGE_SIZE }
  if (currentFloodsOnly) return { ...args, reportType: 'FLOODED_ROAD', floodStatus: 'CURRENT' }
  return filter === 'ALL' ? args : { ...args, reportType: filter }
}

export function confirmationWord(count: number): string {
  return count === 1 ? 'confirmation' : 'confirmations'
}
