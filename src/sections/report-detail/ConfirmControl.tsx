// The resident's "Confirm it's still there" on a report (ReportDetail.dc.html, in the
// dark panel). The count updates at once (reportApi.confirmReport); this shows the
// button, "Confirming", "You confirmed this", and words for each way it can fail:
// your own report (409), refused (403, 404), or no reply, where the outcome is unknown
// until "Check again" reads the report from the service.
import { useState, type ReactNode } from 'react'
import { AlertCircleIcon, CheckIcon, RefreshIcon } from '@/components/common/Icons'
import { useToast } from '@/components/ui/toast'
import { canConfirm, isCertainRefusal } from '@/lib/confirm'
import { describeError, toErrorInput } from '@/services/errors'
import { useConfirmReportMutation, useGetReportQuery } from '@/services/reportApi'
import type { ReportView } from '@/types/ekowatch'

type Problem = { kind: 'unknown' } | { kind: 'refused'; title: string; detail: string } | null

const bigButton =
  'flex min-h-12.5 items-center justify-center gap-2 rounded-xl bg-action text-base font-extrabold text-text hover:bg-action-hover disabled:cursor-not-allowed disabled:opacity-60'

function DarkAlert({ children }: { children: ReactNode }) {
  return (
    <div role="alert" className="flex gap-2 rounded-xl border border-[#3A5674] bg-primary-hover p-3.5 leading-snug">
      <span className="mt-px shrink-0 text-focus-on-dark">
        <AlertCircleIcon size={18} />
      </span>
      <span>{children}</span>
    </div>
  )
}

export function ConfirmControl({ report }: { report: ReportView }) {
  const { toast } = useToast()
  const [confirmReport, { isLoading: confirming }] = useConfirmReportMutation()
  const { refetch, isFetching } = useGetReportQuery(report.reportId)
  const [problem, setProblem] = useState<Problem>(null)

  async function confirm() {
    setProblem(null)
    try {
      await confirmReport(report.reportId).unwrap()
      toast({ title: 'Thanks, your confirmation counts', variant: 'success' })
    } catch (error) {
      const input = toErrorInput(error as Parameters<typeof toErrorInput>[0])
      if (!isCertainRefusal(input.status)) {
        setProblem({ kind: 'unknown' })
        return
      }
      if (input.code === 'SELF_CONFIRMATION_NOT_ALLOWED') {
        setProblem({
          kind: 'refused',
          title: "You can't confirm your own report.",
          detail: 'Your neighbours can confirm it if they see it too.',
        })
        return
      }
      const message = describeError(input)
      setProblem({ kind: 'refused', title: message.title, detail: message.detail })
    }
  }

  async function checkAgain() {
    const { data } = await refetch()
    if (data?.confirmedByMe) {
      setProblem(null)
      toast({ title: 'Your confirmation was saved', variant: 'success' })
    } else if (data) {
      // Not saved: the button comes back so it can be sent again.
      setProblem(null)
    }
  }

  if (problem?.kind === 'unknown') {
    return (
      <div role="alert" className="flex flex-col gap-2.5 rounded-xl border border-[#3A5674] bg-primary-hover p-3.5">
        <span className="flex gap-2 leading-snug">
          <span className="mt-px shrink-0 text-focus-on-dark">
            <AlertCircleIcon size={18} />
          </span>
          <span>
            <strong>We can't tell yet if your confirmation was saved.</strong> The connection dropped before EkoWatch
            replied.
          </span>
        </span>
        <button type="button" onClick={() => void checkAgain()} disabled={isFetching} className={bigButton}>
          <RefreshIcon size={18} />
          {isFetching ? 'Checking…' : 'Check again'}
        </button>
      </div>
    )
  }

  if (problem?.kind === 'refused') {
    return (
      <DarkAlert>
        <strong>{problem.title}</strong> {problem.detail}
      </DarkAlert>
    )
  }

  if (confirming) {
    return (
      <button type="button" disabled className={bigButton}>
        Confirming…
      </button>
    )
  }

  if (canConfirm(report)) {
    return (
      <button type="button" onClick={() => void confirm()} className={bigButton}>
        {report.confirmedByMe ? 'Confirm it again' : "Confirm it's still there"}
      </button>
    )
  }

  return (
    <span className="flex min-h-12.5 items-center justify-center gap-2 rounded-xl border-2 border-action font-extrabold text-[#9FF0C6]">
      <CheckIcon size={20} />
      You confirmed this
    </span>
  )
}
