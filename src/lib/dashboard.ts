// The ward dashboard's date range and worked-out figures (Authority.dc.html), kept pure
// for tests.
import { shiftDate } from '@/lib/format'

// "Last 30 days": today and the 29 days before it, in Lagos. The service allows at most
// 31 days from fromDate to toDate.
export const DASHBOARD_DAYS = 30

export function dashboardRange(today: string): { fromDate: string; toDate: string } {
  return { fromDate: shiftDate(today, -(DASHBOARD_DAYS - 1)), toDate: today }
}

// Missed divided by scheduled, as a whole percentage; a dash when nothing was scheduled.
export function missedRate(missed: number, scheduled: number): string {
  if (scheduled <= 0) return '–'
  return `${Math.round((missed / scheduled) * 100)}%`
}

// Nothing to show at all: no missed or disputed pickups, no blocked-drain or current
// flood reports, and no operator activity.
export function isDashboardEmpty(counts: number[], operatorCount: number): boolean {
  return operatorCount === 0 && counts.every((n) => n === 0)
}
