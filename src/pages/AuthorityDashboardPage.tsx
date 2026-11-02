import { PageHeader } from '@/components/common/PageHeader'
import { WardGate } from '@/components/common/WardGate'
import { useWard } from '@/hooks/useWard'
import { WardDashboardView } from '@/sections/dashboard/WardDashboardView'

export function AuthorityDashboardPage() {
  const ward = useWard()
  // The ward name from GET /wards; nothing until it loads, never a guess.
  const wardName = ward.status === 'picked' ? ward.wardName : null
  return (
    <>
      <PageHeader title="Ward dashboard" subtitle={wardName ?? undefined} />
      <WardGate loadingLabel="Loading the dashboard">{(w) => <WardDashboardView wardId={w.wardId} />}</WardGate>
    </>
  )
}
