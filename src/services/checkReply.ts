// Checks the enum values in a reply before a screen uses them. An unknown value from the
// server is an error to report, never something to map or guess at (CLAUDE.md "Enums").
import { FLOOD_STATUSES, REPORT_TYPES, type ReportView } from '@/types/ekowatch'

// Thrown from transformResponse. RTK Query keeps its name, so errors.ts can tell this
// apart from a failed request and say so in words.
export class UnexpectedReplyError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UnexpectedReplyError'
  }
}

// Throws unless value is one of the allowed values (or null, when null is allowed).
export function checkEnum(field: string, value: unknown, allowed: readonly string[], nullable = false): void {
  if (nullable && value === null) return
  if (typeof value !== 'string' || !allowed.includes(value)) {
    throw new UnexpectedReplyError(`Unknown ${field} from EkoWatch: ${String(value)}`)
  }
}

export function checkReport(report: ReportView): ReportView {
  checkEnum('reportType', report.reportType, REPORT_TYPES)
  checkEnum('floodStatus', report.floodStatus, [...FLOOD_STATUSES], true)
  checkEnum('locationPrecision', report.locationPrecision, ['STREET'])
  return report
}
