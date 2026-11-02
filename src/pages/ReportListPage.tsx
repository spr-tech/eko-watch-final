import { PageHeader } from '@/components/common/PageHeader'
import { WardGate } from '@/components/common/WardGate'
import { useRole } from '@/hooks/useRole'
import { ReportListView } from '@/sections/reports/ReportListView'

export function ReportListPage() {
  const role = useRole()
  return (
    <>
      <PageHeader
        title="Reports in your ward"
        subtitle="Most-confirmed first. Reporters' names are never shown."
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
