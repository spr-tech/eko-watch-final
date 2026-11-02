// /reports/:reportId (ReportDetail.dc.html): what was reported, where and when, the photo,
// and how many neighbours have confirmed it. Reports are community evidence: no reporter
// is ever named. A missing report and a failed load are told apart (docs/design/README.md
// correction 4).
import { useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { buttonStyles } from '@/components/common/buttonStyles'
import { ErrorState } from '@/components/common/ErrorState'
import { ChevronLeftIcon, PhotoIcon } from '@/components/common/Icons'
import { LoadingState } from '@/components/common/LoadingState'
import { ReportTypeIcon } from '@/components/common/ReportTypeIcon'
import { StatusBadge } from '@/components/common/StatusBadge'
import { IconTile, StateCard } from '@/components/common/StateCard'
import { pageTitleClass } from '@/components/common/PageHeader'
import { ROUTES } from '@/constants/routes'
import { REPORT_TYPE_LABELS } from '@/constants/status'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useNow } from '@/hooks/useNow'
import { formatAge, formatCollectionDate, formatFloodCountdown, formatWhen } from '@/lib/format'
import { confirmationWord } from '@/lib/reports'
import { describeError, toErrorInput } from '@/services/errors'
import { useGetReportQuery } from '@/services/reportApi'
import type { ReportView, Role } from '@/types/ekowatch'

function BackLink() {
  return (
    <Link to={ROUTES.reports} className="inline-flex min-h-9 items-center gap-1.5 font-extrabold">
      <ChevronLeftIcon />
      Back to reports
    </Link>
  )
}

function Photo({ url }: { url: string | null }) {
  const [failed, setFailed] = useState(false)
  if (url && !failed) {
    return (
      <img
        src={url}
        alt="Photo sent with this report"
        onError={() => setFailed(true)}
        className="h-full max-h-80 min-h-37.5 w-full rounded-card border border-border bg-surface object-cover"
      />
    )
  }
  return (
    <div className="flex min-h-37.5 flex-col items-center justify-center gap-2 rounded-card border border-border bg-[repeating-linear-gradient(135deg,#EEF2F6_0_14px,#E6EBF1_14px_28px)] px-4 text-center text-text-muted">
      <PhotoIcon />
      <span className="font-bold">{url ? "This report's photo couldn't be loaded." : 'No photo with this report'}</span>
    </div>
  )
}

// What a flood or missed-pickup report adds: how current the flood is, or which collection.
function ReportFacts({ report, now }: { report: ReportView; now: Date }) {
  if (report.floodStatus === 'CURRENT' && report.expiresAt) {
    return (
      <p className="flex flex-wrap items-center gap-2.5 font-bold">
        <StatusBadge status="CURRENT" />
        <span>{formatFloodCountdown(report.expiresAt, now)} unless someone confirms it again.</span>
      </p>
    )
  }
  if (report.floodStatus) {
    return (
      <p className="flex flex-wrap items-center gap-2.5 font-bold">
        <StatusBadge status={report.floodStatus} />
        <span>No recent confirmations. This doesn't mean the road is clear.</span>
      </p>
    )
  }
  if (report.collectionDate) {
    return <p className="font-bold">Collection day missed: {formatCollectionDate(report.collectionDate)}</p>
  }
  return null
}

const HELPER: Record<Role, string> = {
  RESIDENT: 'Each person can confirm a report once. Two neighbours confirming at the same moment both count.',
  OPERATOR: 'Operators see confirmations but do not confirm reports.',
  AUTHORITY: 'The ward office sees confirmations but does not confirm reports.',
}

type ReportDetailViewProps = {
  reportId: string
  role: Role
  // The resident's Confirm control, under the count (step 4 of the core loop).
  confirm?: (report: ReportView) => ReactNode
}

export function ReportDetailView({ reportId, role, confirm }: ReportDetailViewProps) {
  const now = useNow()
  const { data: report, error, isLoading, isFetching, refetch } = useGetReportQuery(reportId)
  useDocumentTitle(report ? REPORT_TYPE_LABELS[report.reportType] : 'Report')

  if (isLoading) {
    return (
      <>
        <BackLink />
        <div className="mt-2">
          <LoadingState label="Loading report" rows={2} />
        </div>
      </>
    )
  }

  if (error || !report) {
    const input = toErrorInput(error)
    // A malformed ID in the address (400) can't be a report either.
    if (input.status === 404 || input.status === 400) {
      return (
        <>
          <BackLink />
          <StateCard role="alert" className="mt-2">
            <IconTile tone="neutral">
              <PhotoIcon size={24} />
            </IconTile>
            <h1 className="text-lg font-extrabold">This report doesn't exist.</h1>
            <p className="max-w-[34em] text-text-muted">Check the link, or go back to the list of reports.</p>
            <Link to={ROUTES.reports} className={`${buttonStyles.line} mt-1.5`}>
              Back to reports
            </Link>
          </StateCard>
        </>
      )
    }
    const message = describeError(input)
    return (
      <>
        <BackLink />
        <div className="mt-2">
          <ErrorState
            headingLevel="h2"
            title="We couldn't load this report."
            description={message.kind === 'network' ? message.detail : `${message.title} ${message.detail}`}
            onRetry={() => void refetch()}
            retrying={isFetching}
          />
        </div>
      </>
    )
  }

  const count = report.confirmationCount
  return (
    <>
      <BackLink />
      <div className="mt-1.5 mb-4.5 flex flex-wrap items-center gap-3.5">
        <ReportTypeIcon reportType={report.reportType} size="lg" />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h1 className={pageTitleClass}>{REPORT_TYPE_LABELS[report.reportType]}</h1>
          <p className="font-bold text-text-muted wrap-anywhere">
            {report.streetName}, reported by a resident{' '}
            <time dateTime={report.createdAt}>{formatWhen(report.createdAt, now)}</time>
          </p>
        </div>
      </div>
      <div className="flex flex-wrap-reverse items-end gap-4.5">
        <div className="flex min-w-0 flex-[999_1_460px] flex-col gap-3.5">
          <ReportFacts report={report} now={now} />
          <section className="flex flex-col gap-1.5 rounded-card border border-border bg-bg px-5 py-4">
            <h2 className="text-sm font-extrabold text-text-muted">What the resident said</h2>
            <p className="text-[17px] leading-relaxed font-semibold wrap-anywhere">
              {report.note ?? 'No note with this report.'}
            </p>
          </section>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3.5">
            <Photo url={report.photoUrl} />
            <section className="flex flex-col gap-3 rounded-card border border-border bg-bg px-5 py-4">
              <h2 className="text-sm font-extrabold text-text-muted">Activity</h2>
              <dl className="flex flex-col gap-3">
                <div className="flex justify-between gap-3">
                  <dt className="text-text-muted">Latest confirmation</dt>
                  <dd className="font-extrabold">
                    {count > 0 ? (
                      <time dateTime={report.lastEvidenceAt}>{formatAge(report.lastEvidenceAt, now)}</time>
                    ) : (
                      'None yet'
                    )}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-text-muted">Reported</dt>
                  <dd className="font-extrabold">
                    <time dateTime={report.createdAt}>{formatAge(report.createdAt, now)}</time>
                  </dd>
                </div>
              </dl>
            </section>
          </div>
        </div>
        <aside
          aria-label="Confirmations"
          className="on-dark flex min-w-0 flex-[1_1_300px] flex-col gap-3.5 rounded-[18px] bg-text px-5.5 py-5 text-white"
        >
          <span className="font-extrabold text-on-navy-muted">Confirmed by neighbours</span>
          <p aria-live="polite" className="flex items-baseline gap-2.5">
            <span className="text-[52px] leading-none font-extrabold tracking-[-1.5px]">{count}</span>
            <span className="text-base font-bold text-on-navy-muted">{confirmationWord(count)}</span>
          </p>
          {count > 0 ? (
            <span aria-hidden="true" className="flex flex-wrap gap-1.25">
              {Array.from({ length: Math.min(count, 30) }, (_, i) => (
                <span key={i} className="size-2.75 rounded-full bg-action" />
              ))}
            </span>
          ) : (
            <span className="text-[#DCE3EA]">
              {role === 'RESIDENT'
                ? 'No one has confirmed this yet. If you can see it too, be the first.'
                : 'No one has confirmed this yet.'}
            </span>
          )}
          {role === 'RESIDENT' && confirm?.(report)}
          <p className="text-sm text-on-navy-muted">{HELPER[role]}</p>
        </aside>
      </div>
    </>
  )
}
