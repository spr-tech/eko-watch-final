import { useParams } from 'react-router'
import { useRole } from '@/hooks/useRole'
import { ReportDetailView } from '@/sections/report-detail/ReportDetailView'

export function ReportDetailPage() {
  const { reportId = '' } = useParams()
  const role = useRole()
  if (!role) return null
  return <ReportDetailView key={reportId} reportId={reportId} role={role} />
}
