// The rules for confirming a report (CLAUDE.md "Optimistic action: confirmation"), kept
// pure for tests.

type Confirmable = { confirmationCount: number; confirmedByMe: boolean; floodStatus: string | null }

// A resident can confirm once; an expired flood can be confirmed again to refresh the
// evidence (the service doesn't count it twice).
export function canConfirm(report: Confirmable): boolean {
  return !report.confirmedByMe || report.floodStatus === 'EXPIRED'
}

// The optimistic change while the request is in flight: counted once per person.
export function confirmOptimistically<T extends Confirmable>(report: T): T {
  if (report.confirmedByMe) return report
  return { ...report, confirmedByMe: true, confirmationCount: report.confirmationCount + 1 }
}

// Refusals that are certain: the change is undone. Anything else (no reply, a server
// error) leaves the outcome unknown until the report is read again.
export function isCertainRefusal(status: number | string): boolean {
  return status === 400 || status === 403 || status === 404 || status === 409
}
