// /authority/dashboard (Authority.dc.html): the ward's last 30 days at a glance. Labels
// follow the build plan: "Blocked-drain reports", and "Current flood reports" counts
// reports, not roads. Disputed pickups are shown apart from missed ones. The two short
// lists come from GET /reports, so they are live like the Reports page.
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { AlertCircleIcon, LockIcon } from '@/components/common/Icons'
import { LoadingState } from '@/components/common/LoadingState'
import { ReportTypeIcon } from '@/components/common/ReportTypeIcon'
import { StatusBadge } from '@/components/common/StatusBadge'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/cn'
import { useNow } from '@/hooks/useNow'
import { dashboardRange, DASHBOARD_DAYS, isDashboardEmpty, missedRate } from '@/lib/dashboard'
import { formatAge, formatLagosTime, formatWhen, lagosDate } from '@/lib/format'
import { confirmationWord } from '@/lib/reports'
import { useGetWardDashboardQuery } from '@/services/authorityApi'
import { describeError, toErrorInput } from '@/services/errors'
import { useListReportsQuery } from '@/services/reportApi'
import type { ReportView } from '@/types/ekowatch'

const PERIOD = `last ${DASHBOARD_DAYS} days`

function computedAt(generatedAt: string, today: string): string {
  const day = lagosDate(new Date(generatedAt)) === today ? 'today' : `on ${formatAge(generatedAt, new Date())}`
  return `Computed ${day} at ${formatLagosTime(generatedAt)}`
}

type CountCardProps = { label: string; value: number; period?: string; computed: string; icon: ReactNode }

function CountCard({ label, value, period, computed, icon }: CountCardProps) {
  return (
    <div className="flex flex-col gap-1.5 rounded-card border border-border bg-bg px-4 py-3.5">
      <span className="flex items-center justify-between gap-2">
        <h2 className="text-[15px] font-extrabold">{label}</h2>
        {icon}
      </span>
      <p className="flex items-baseline gap-2">
        <span className="text-[40px] leading-none font-extrabold tracking-[-1px]">{value}</span>
        {period && <span className="text-sm font-bold text-text-muted">{period}</span>}
      </p>
      <p className="text-[13px] text-text-muted">{computed}</p>
    </div>
  )
}

// A small tile for a count card that isn't one report type: disputed pickups.
function WarningTile() {
  return (
    <span aria-hidden="true" className={cn('flex size-8 shrink-0 items-center justify-center rounded-[9px]', 'bg-warning-light text-warning')}>
      <AlertCircleIcon size={18} />
    </span>
  )
}

type ReportLinksProps = {
  title: string
  id: string
  reports: ReportView[] | undefined
  failed: boolean
  empty: string
  now: Date
}

function ReportLinks({ title, id, reports, failed, empty, now }: ReportLinksProps) {
  let body: ReactNode
  if (failed) body = <p className="text-text-muted">We couldn't load these reports. They are also on the Reports page.</p>
  else if (!reports) body = <LoadingState label={`Loading ${title.toLowerCase()}`} rows={2} />
  else if (reports.length === 0) body = <p className="text-text-muted">{empty}</p>
  else
    body = (
      <ul className="flex flex-col gap-1.5">
        {reports.map((report) => (
          <li key={report.reportId}>
            <Link
              to={ROUTES.reportDetail(report.reportId)}
              className="flex items-center gap-2.5 rounded-md border border-skeleton px-3 py-2.5 text-text no-underline hover:border-[#9FB3C8]"
            >
              <ReportTypeIcon reportType={report.reportType} size="xs" />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="font-extrabold wrap-anywhere">{report.streetName}</span>
                <span className="text-sm text-text-muted">
                  {report.confirmationCount} {confirmationWord(report.confirmationCount)},{' '}
                  {report.floodStatus
                    ? `last confirmed ${formatWhen(report.lastEvidenceAt, now)}`
                    : `reported ${formatWhen(report.createdAt, now)}`}
                </span>
              </span>
              {report.floodStatus && <StatusBadge status={report.floodStatus} />}
            </Link>
          </li>
        ))}
      </ul>
    )
  return (
    <section aria-labelledby={id} className="flex flex-col gap-2.5 rounded-card border border-border bg-bg px-4 py-3.5">
      <h2 id={id} className="text-[17px] font-extrabold">
        {title}
      </h2>
      {body}
    </section>
  )
}

export function WardDashboardView({ wardId }: { wardId: string }) {
  const now = useNow()
  const today = lagosDate(now)
  const range = dashboardRange(today)
  const { data, error, isLoading, isFetching, refetch } = useGetWardDashboardQuery({ wardId, ...range })
  const drains = useListReportsQuery({ wardId, reportType: 'BLOCKED_DRAIN', sort: 'CONFIRMATIONS', size: 3 })
  const floods = useListReportsQuery({ wardId, reportType: 'FLOODED_ROAD', floodStatus: 'CURRENT', sort: 'CONFIRMATIONS', size: 5 })

  if (isLoading) return <LoadingState label="Loading the dashboard" rows={4} />
  if (error || !data) {
    const message = describeError(toErrorInput(error))
    return (
      <ErrorState
        title="We couldn't load the dashboard."
        description={message.kind === 'network' ? message.detail : `${message.title} ${message.detail}`}
        onRetry={() => void refetch()}
        retrying={isFetching}
      />
    )
  }

  const computed = computedAt(data.generatedAt, today)
  const counts = [data.missedPickupCount, data.disputedPickupCount, data.blockedDrainCount, data.currentFloodCount]
  if (isDashboardEmpty(counts, data.operatorPerformance.length)) {
    return (
      <EmptyState
        title="No missed pickups or reports in this ward."
        description="Figures appear here as soon as pickups are missed or residents report a problem."
      />
    )
  }

  return (
    <>
      <div className="mb-4 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
        <CountCard label="Missed pickups" value={data.missedPickupCount} period={PERIOD} computed={computed} icon={<ReportTypeIcon reportType="MISSED_PICKUP" size="xs" />} />
        <CountCard label="Disputed pickups" value={data.disputedPickupCount} period={PERIOD} computed={computed} icon={<WarningTile />} />
        <CountCard label="Blocked-drain reports" value={data.blockedDrainCount} computed={computed} icon={<ReportTypeIcon reportType="BLOCKED_DRAIN" size="xs" />} />
        <CountCard label="Current flood reports" value={data.currentFloodCount} computed={computed} icon={<ReportTypeIcon reportType="FLOODED_ROAD" size="xs" />} />
      </div>

      <section aria-labelledby="operators" className="mb-4 overflow-hidden rounded-card border border-border bg-bg">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1.5 px-4 pt-3.5 pb-2.5">
          <h2 id="operators" className="text-[17px] font-extrabold">
            Pickups by operator, {PERIOD}
          </h2>
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-text-muted">
            <LockIcon size={16} />
            Only the ward office sees this
          </span>
        </div>
        {data.operatorPerformance.length === 0 ? (
          <p className="px-4 pb-3.5 text-text-muted">No pickups were scheduled in this period.</p>
        ) : (
          <div className="overflow-x-auto" tabIndex={0} aria-label="Pickups by operator (scrolls sideways on small screens)">
            <table className="w-full min-w-160 border-collapse">
              <thead>
                <tr className="bg-surface">
                  <th scope="col" className="px-4 py-2 text-left text-sm font-extrabold text-text-muted">
                    Operator
                  </th>
                  {['Scheduled', 'Done', 'Missed', 'Disputed'].map((heading) => (
                    <th key={heading} scope="col" className="px-4 py-2 text-right text-sm font-extrabold text-text-muted">
                      {heading}
                    </th>
                  ))}
                  <th scope="col" className="px-4 py-2 text-right text-sm font-extrabold text-text-muted">
                    Missed rate<span aria-hidden="true">*</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.operatorPerformance.map((operator) => (
                  <tr key={operator.operatorId} className="border-t border-skeleton">
                    <th scope="row" className="px-4 py-2.5 text-left font-extrabold">
                      {operator.operatorName}
                    </th>
                    <td className="px-4 py-2.5 text-right">{operator.scheduledPickupCount}</td>
                    <td className="px-4 py-2.5 text-right">{operator.completedPickupCount}</td>
                    <td className="px-4 py-2.5 text-right font-extrabold text-danger">{operator.missedPickupCount}</td>
                    <td className="px-4 py-2.5 text-right font-extrabold text-warning">{operator.disputedPickupCount}</td>
                    <td className="px-4 py-2.5 text-right font-extrabold">
                      {missedRate(operator.missedPickupCount, operator.scheduledPickupCount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="px-4 pt-2.5 pb-3.5 text-sm text-text-muted">
          * Missed rate is worked out from the table: missed divided by scheduled. {computed}. Operator names are
          fictional.
        </p>
      </section>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-3.5">
        <ReportLinks
          title="Most-confirmed blocked-drain reports"
          id="drains"
          reports={drains.data?.items}
          failed={drains.isError}
          empty="No blocked-drain reports."
          now={now}
        />
        <ReportLinks
          title="Current flood reports"
          id="floods"
          reports={floods.data?.items}
          failed={floods.isError}
          empty="No current flood reports. That doesn't mean the roads are clear, only that no one has reported flooding recently."
          now={now}
        />
      </div>
    </>
  )
}
