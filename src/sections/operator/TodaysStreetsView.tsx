// /operator/collections (Operator.dc.html): the operator's streets with a collection
// today, how many are done, and "Mark done" for the rest. Today is the Lagos date. The
// PUT is safe to repeat: the service answers 200 when the street was already marked.
import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { buttonStyles } from '@/components/common/buttonStyles'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { AlertCircleIcon, CheckIcon } from '@/components/common/Icons'
import { LoadingState } from '@/components/common/LoadingState'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { NavIcon } from '@/components/layout/NavIcons'
import { ConfirmDialog } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/toast'
import { ROUTES } from '@/constants/routes'
import { useNow } from '@/hooks/useNow'
import { cn } from '@/lib/cn'
import { formatCollectionDate, formatLagosTime, lagosDate } from '@/lib/format'
import { countDone, joinTodaysStreets } from '@/lib/todaysStreets'
import { useListCollectionSchedulesQuery, useRecordCollectionMutation } from '@/services/collectionApi'
import { describeError, toErrorInput } from '@/services/errors'
import { useListMyAssignedStreetsQuery } from '@/services/operatorApi'
import type { CollectionScheduleView, StreetView } from '@/types/ekowatch'

// Enough for every street in a ward on one day.
const SCHEDULE_PAGE_SIZE = 100

// The dialog opens without a trigger element, so focus is put back by hand: on the
// row's Mark done button after Cancel, or on the street name once the button is gone.
const markButtonId = (streetId: string) => `mark-${streetId}`
const streetNameId = (streetId: string) => `street-${streetId}`

// After the dialog's own close has run, which would otherwise leave focus on the page.
function focusLater(id: string) {
  window.setTimeout(() => document.getElementById(id)?.focus(), 50)
}

function rowText(schedule: CollectionScheduleView, alreadyMarked: boolean): string {
  const at = schedule.completedAt ? formatLagosTime(schedule.completedAt) : null
  if (schedule.collectionStatus === 'DONE' && at) {
    return alreadyMarked ? `Already marked done today at ${at}. Refreshed.` : `Marked done at ${at}`
  }
  if (schedule.collectionStatus === 'DISPUTED') {
    return `Marked done${at ? ` at ${at}` : ''}, but residents reported the pickup as missed.`
  }
  if (schedule.collectionStatus === 'MISSED') return 'Residents reported this pickup as missed.'
  return 'Collection due today'
}

type Row = { street: StreetView; schedule: CollectionScheduleView }

function StreetRow({ row, alreadyMarked, onMark }: { row: Row; alreadyMarked: boolean; onMark: (row: Row) => void }) {
  const { street, schedule } = row
  const status = schedule.collectionStatus
  const done = status === 'DONE' || status === 'DISPUTED'
  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-2.5 rounded-card border border-border bg-bg px-4 py-3">
      <span
        aria-hidden="true"
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-md',
          done ? 'bg-success-light text-success' : 'bg-primary-light text-primary',
        )}
      >
        {done ? <CheckIcon size={20} /> : <NavIcon name="streets" />}
      </span>
      <span className="flex min-w-0 flex-[1_1_200px] flex-col gap-0.5">
        <span id={streetNameId(street.streetId)} tabIndex={-1} className="text-[17px] font-extrabold wrap-anywhere">
          {street.streetName}
        </span>
        <span className={cn('text-sm', alreadyMarked ? 'font-extrabold text-warning' : 'text-text-muted')}>
          {rowText(schedule, alreadyMarked)}
        </span>
        {status === 'DISPUTED' && (
          <Link to={`${ROUTES.reports}?type=MISSED_PICKUP`} className="text-sm font-extrabold">
            See missed-pickup reports
            {schedule.missedReportCount > 0 && ` (${schedule.missedReportCount})`}
          </Link>
        )}
      </span>
      <span className="flex items-center gap-3">
        <StatusBadge status={status} />
        {!done && (
          <button id={markButtonId(street.streetId)} type="button" onClick={() => onMark(row)} className={buttonStyles.navy}>
            Mark done<span className="sr-only">: {street.streetName}</span>
          </button>
        )}
      </span>
    </li>
  )
}

export function TodaysStreetsView() {
  const now = useNow()
  const today = lagosDate(now)
  const { toast } = useToast()
  const streets = useListMyAssignedStreetsQuery({ fromDate: today, toDate: today })
  // Every assigned street is in the operator's ward.
  const wardId = streets.data?.[0]?.wardId
  const schedules = useListCollectionSchedulesQuery(
    { wardId: wardId ?? '', fromDate: today, toDate: today, size: SCHEDULE_PAGE_SIZE },
    { skip: !wardId },
  )
  const [recordCollection, { isLoading: marking }] = useRecordCollectionMutation()
  const [asking, setAsking] = useState<Row | null>(null)
  // Set once a street is marked, so closing the dialog focuses its name, not the button.
  const markedRef = useRef(false)
  const [alreadyMarked, setAlreadyMarked] = useState<Set<string>>(() => new Set())
  const [problem, setProblem] = useState<{ title: string; detail: string } | null>(null)

  async function markDone(row: Row) {
    setProblem(null)
    try {
      const { alreadyRecorded } = await recordCollection({ streetId: row.street.streetId, collectionDate: today }).unwrap()
      markedRef.current = true
      if (alreadyRecorded) {
        setAlreadyMarked((set) => new Set(set).add(row.street.streetId))
        toast({ title: 'This street was already marked done today.', variant: 'info' })
      } else {
        toast({ title: `${row.street.streetName} marked as collected`, variant: 'success' })
      }
    } catch (error) {
      const input = toErrorInput(error as Parameters<typeof toErrorInput>[0])
      const message = describeError({ ...input, operation: 'recordCollection' })
      // No reply: it may have been saved. The list is re-read, and marking again is safe.
      if (message.kind === 'network') {
        setProblem({
          title: "We can't tell yet if that was saved.",
          detail: 'The connection dropped before EkoWatch replied. Check the list, then mark it again if needed: marking twice is safe.',
        })
        void schedules.refetch()
      } else {
        setProblem({ title: message.title, detail: message.detail })
      }
    }
  }

  const rows = streets.data && schedules.data ? joinTodaysStreets(streets.data, schedules.data.items) : null
  const done = rows ? countDone(rows.map((row) => row.schedule.collectionStatus)) : 0

  let body
  const failed = streets.isError ? streets : schedules.isError ? schedules : null
  if (failed) {
    const message = describeError(toErrorInput(failed.error))
    body = (
      <ErrorState
        title="We couldn't load today's streets."
        description={
          message.kind === 'network'
            ? 'Check your connection, then try again. Nothing you marked earlier is lost.'
            : `${message.title} ${message.detail}`
        }
        onRetry={() => void failed.refetch()}
        retrying={failed.isFetching}
      />
    )
  } else if (streets.data && streets.data.length === 0) {
    body = (
      <EmptyState
        title="No streets assigned to you today."
        description="If you expected some, check with the ward office. Assigned streets appear here on their collection day."
      />
    )
  } else if (!rows) {
    body = <LoadingState label="Loading your streets" rows={4} />
  } else if (rows.length === 0) {
    body = (
      <EmptyState
        title="No streets assigned to you today."
        description="If you expected some, check with the ward office. Assigned streets appear here on their collection day."
      />
    )
  } else {
    body = (
      <>
        <ul aria-busy={schedules.isFetching || undefined} className="flex flex-col gap-2">
          {rows.map((row) => (
            <StreetRow
              key={row.street.streetId}
              row={row}
              alreadyMarked={alreadyMarked.has(row.street.streetId)}
              onMark={setAsking}
            />
          ))}
        </ul>
        <p className="mt-3 text-sm text-text-muted">Each street can be marked once a day. Only streets assigned to you are shown.</p>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Today's streets"
        subtitle={formatCollectionDate(today)}
        action={
          rows &&
          rows.length > 0 && (
            <div className="flex flex-[0_1_300px] flex-col gap-1.5">
              <span aria-live="polite" className="font-extrabold">
                {done} of {rows.length} streets done
              </span>
              <span aria-hidden="true" className="h-2.5 overflow-hidden rounded-[5px] bg-[#DCE3EA]">
                <span
                  className="block h-2.5 rounded-[5px] bg-fresh transition-[width] duration-400"
                  style={{ width: `${Math.round((done / rows.length) * 100)}%` }}
                />
              </span>
            </div>
          )
        }
      />
      {problem && (
        <div role="alert" className="mb-3.5 flex items-start gap-2.5 rounded-xl bg-danger-light px-3.5 py-3 text-danger">
          <AlertCircleIcon size={20} />
          <span>
            <strong>{problem.title}</strong> {problem.detail}
          </span>
        </div>
      )}
      {body}
      <ConfirmDialog
        open={asking !== null}
        onOpenChange={(open) => {
          if (open || !asking) return
          const { streetId } = asking.street
          focusLater(markedRef.current ? streetNameId(streetId) : markButtonId(streetId))
          markedRef.current = false
          setAsking(null)
        }}
        title={asking ? `Mark ${asking.street.streetName} as collected today?` : ''}
        description="Residents will see it as done. You can't undo this today."
        confirmLabel="Mark as collected"
        loading={marking}
        onConfirm={() => (asking ? markDone(asking) : undefined)}
      />
    </>
  )
}
