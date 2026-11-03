// /reports (Reports.dc.html): the ward's reports, newest or most-confirmed first, with the
// type chips and "Current floods only". Sort, filters and page live in the address, so Back and a
// refresh keep them. Residents see "You confirmed this" on their confirmed reports; the
// ward office and operators see the list read-only (docs/design/README.md correction 6).
import { Link, useSearchParams } from 'react-router'
import { buttonStyles } from '@/components/common/buttonStyles'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { CheckIcon, PlusIcon } from '@/components/common/Icons'
import { LoadingState } from '@/components/common/LoadingState'
import { ReportTypeIcon } from '@/components/common/ReportTypeIcon'
import { StatusBadge } from '@/components/common/StatusBadge'
import { ROUTES } from '@/constants/routes'
import { REPORT_TYPE_LABELS } from '@/constants/status'
import { useNow } from '@/hooks/useNow'
import { cn } from '@/lib/cn'
import { formatEvidenceAge } from '@/lib/format'
import {
  confirmationWord,
  parsePage,
  parseReportFilter,
  parseReportSort,
  REPORT_FILTERS,
  REPORT_SORTS,
  reportListArgs,
  type ReportFilter,
} from '@/lib/reports'
import { describeError, toErrorInput } from '@/services/errors'
import { useListReportsQuery } from '@/services/reportApi'
import type { ReportView, Role } from '@/types/ekowatch'

const chipBase = 'min-h-10 rounded-full px-4 text-[15px]'

function ReportRow({ report, role, now }: { report: ReportView; role: Role; now: Date }) {
  return (
    <li className="flex flex-wrap items-start gap-3.5 rounded-card border border-border bg-bg px-4.5 py-3.5 transition-[border-color,box-shadow] hover:border-[#9FB3C8] hover:shadow-[0_6px_16px_rgba(11,29,46,0.06)]">
      <ReportTypeIcon reportType={report.reportType} />
      <div className="flex min-w-0 flex-[1_1_280px] flex-col gap-1">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
          <h2 className="text-[17px] font-extrabold">
            <Link to={ROUTES.reportDetail(report.reportId)} className="text-text no-underline hover:underline">
              {REPORT_TYPE_LABELS[report.reportType]}
            </Link>
          </h2>
          {report.floodStatus && <StatusBadge status={report.floodStatus} />}
        </div>
        <p className="text-sm font-bold text-text-muted wrap-anywhere">
          {report.streetName}
          <span aria-hidden="true"> · </span>
          <time dateTime={report.lastEvidenceAt}>{formatEvidenceAge(report.lastEvidenceAt, now)}</time>
        </p>
        {report.note && <p className="mt-0.5 wrap-anywhere">{report.note}</p>}
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-3.5">
        <p className="flex items-baseline gap-1.25">
          <span className="text-[22px] font-extrabold">{report.confirmationCount}</span>
          <span className="text-sm font-bold text-text-muted">{confirmationWord(report.confirmationCount)}</span>
        </p>
        {role === 'RESIDENT' && report.confirmedByMe && (
          <span className="flex min-h-11 items-center gap-1.5 font-extrabold text-success">
            <CheckIcon size={18} />
            You confirmed this
          </span>
        )}
      </div>
    </li>
  )
}

export function ReportListView({ wardId, role }: { wardId: string; role: Role }) {
  const now = useNow()
  const [params, setParams] = useSearchParams()
  const filter = parseReportFilter(params.get('type'))
  const currentOnly = params.get('current') === '1'
  const sort = parseReportSort(params.get('sort'))
  const page = parsePage(params.get('page'))
  const { data, error, isLoading, isFetching, refetch } = useListReportsQuery(
    reportListArgs(wardId, filter, currentOnly, sort, page),
  )

  // Changing a filter goes back to the first page; the ward (if chosen) is kept.
  function update(change: (next: URLSearchParams) => void) {
    const next = new URLSearchParams(params)
    next.delete('page')
    change(next)
    setParams(next)
  }
  function pickFilter(value: ReportFilter) {
    update((next) => {
      if (value === 'ALL') next.delete('type')
      else next.set('type', value)
      if (value !== 'FLOODED_ROAD') next.delete('current')
    })
  }
  function pickSort(param: string | null) {
    update((next) => {
      if (param) next.set('sort', param)
      else next.delete('sort')
    })
  }
  function toggleCurrent() {
    update((next) => {
      if (currentOnly) next.delete('current')
      else {
        next.set('current', '1')
        next.set('type', 'FLOODED_ROAD')
      }
    })
  }
  function pageLink(index: number) {
    const next = new URLSearchParams(params)
    if (index === 0) next.delete('page')
    else next.set('page', String(index + 1))
    const query = next.toString()
    return query ? `?${query}` : ROUTES.reports
  }

  const filtered = filter !== 'ALL' || currentOnly
  let body
  if (isLoading) body = <LoadingState label="Loading reports" />
  else if (error || !data) {
    const message = describeError(toErrorInput(error))
    body = (
      <ErrorState
        title="We couldn't load reports."
        description={message.kind === 'network' ? message.detail : `${message.title} ${message.detail}`}
        onRetry={() => void refetch()}
        retrying={isFetching}
      />
    )
  } else if (data.totalElements === 0 && !filtered) {
    body = (
      <EmptyState
        title="No reports in your ward yet."
        description={
          role === 'RESIDENT'
            ? 'Seen a missed pickup, dumping, a blocked drain or a flooded road? Report it and your neighbours can confirm it.'
            : 'Reports from residents will show here as they come in.'
        }
        action={
          role === 'RESIDENT' && (
            <Link to={ROUTES.newReport} className={buttonStyles.green}>
              <PlusIcon size={18} />
              Report a problem
            </Link>
          )
        }
      />
    )
  } else if (data.items.length === 0) {
    body = (
      <EmptyState
        title="No reports match."
        description={
          currentOnly
            ? 'No current flood reports. That does not mean the roads are clear, only that no one has reported flooding recently.'
            : 'Try another filter, or clear them to see every report in the ward.'
        }
        action={
          <button type="button" onClick={() => pickFilter('ALL')} className={buttonStyles.line}>
            Clear filters
          </button>
        }
      />
    )
  } else {
    body = (
      <>
        <ul aria-busy={isFetching || undefined} className={cn('flex flex-col gap-2.5', isFetching && 'opacity-70')}>
          {data.items.map((report) => (
            <ReportRow key={report.reportId} report={report} role={role} now={now} />
          ))}
        </ul>
        {data.totalPages > 1 && (
          <nav aria-label="Report pages" className="mt-4 flex flex-wrap items-center justify-between gap-3">
            {page > 0 ? (
              <Link to={pageLink(page - 1)} className={buttonStyles.line}>
                Previous
              </Link>
            ) : (
              <span />
            )}
            <p className="font-bold text-text-muted">
              Page {data.page + 1} of {data.totalPages}
            </p>
            {page + 1 < data.totalPages ? (
              <Link to={pageLink(page + 1)} className={buttonStyles.line}>
                Next
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </>
    )
  }

  return (
    <>
      <div role="group" aria-label="Filter reports" className="mb-3.5 flex flex-wrap items-center gap-2">
        {REPORT_FILTERS.map((f) => {
          const on = f.value === filter
          return (
            <button
              key={f.value}
              type="button"
              aria-pressed={on}
              onClick={() => pickFilter(f.value)}
              className={cn(
                chipBase,
                on
                  ? 'border-2 border-text bg-text font-extrabold text-white'
                  : 'border border-border-input bg-bg font-bold text-text hover:bg-surface-hover',
              )}
            >
              {f.label}
            </button>
          )
        })}
        <span aria-hidden="true" className="mx-1 hidden h-6.5 w-px bg-border sm:block" />
        <button
          type="button"
          role="switch"
          aria-checked={currentOnly}
          onClick={toggleCurrent}
          className="inline-flex min-h-10 items-center gap-2.5 px-1 text-[15px] font-bold"
        >
          <span className={cn('relative h-5.5 w-10 rounded-full', currentOnly ? 'bg-primary' : 'bg-[#8A99AB]')}>
            <span
              className={cn(
                'absolute top-0.75 size-4 rounded-full bg-white transition-[left]',
                currentOnly ? 'left-5.25' : 'left-0.75',
              )}
            />
          </span>
          Current floods only
        </button>
        <div role="group" aria-label="Sort reports" className="flex flex-wrap items-center gap-2 sm:ml-auto">
          {REPORT_SORTS.map((s) => {
            const on = s.value === sort
            return (
              <button
                key={s.value}
                type="button"
                aria-pressed={on}
                onClick={() => pickSort(s.param)}
                className={cn(
                  chipBase,
                  on
                    ? 'border-2 border-primary bg-primary-light font-extrabold text-primary'
                    : 'border border-border-input bg-bg font-bold text-text hover:bg-surface-hover',
                )}
              >
                {s.label}
              </button>
            )
          })}
        </div>
      </div>
      {body}
    </>
  )
}
