import { useParams } from 'react-router'
import { useRole } from '@/hooks/useRole'
import { ConfirmControl } from '@/sections/report-detail/ConfirmControl'
import { ReportDetailView } from '@/sections/report-detail/ReportDetailView'

export function ReportDetailPage() {
  const { reportId = '' } = useParams()
  const role = useRole()
  if (!role) return null
  return (
    <ReportDetailView
      key={reportId}
      reportId={reportId}
      role={role}
      confirm={(report) => <ConfirmControl key={report.reportId} report={report} />}
    />
  )
}
