import { useSearchParams } from 'react-router'
import { PageHeader } from '@/components/common/PageHeader'
import { WardGate } from '@/components/common/WardGate'
import { useRole } from '@/hooks/useRole'
import { parseReportSort, REPORT_SORTS } from '@/lib/reports'
import { ReportListView } from '@/sections/reports/ReportListView'

export function ReportListPage() {
  const role = useRole()
  const [params] = useSearchParams()
  const sort = parseReportSort(params.get('sort'))
  const subtitle = REPORT_SORTS.find((s) => s.value === sort)?.subtitle
  return (
    <>
      <PageHeader
        title="Reports in your ward"
        subtitle={subtitle}
        documentTitle="Reports"
      />
      {role && (
        <WardGate loadingLabel="Loading reports">
          {(ward) => <ReportListView wardId={ward.wardId} role={role} />}
        </WardGate>
      )}
    </>
  )
}
