import { Link } from 'react-router'
import { selectCurrentUser } from '@/app/sessionSlice'
import { ChevronLeftIcon } from '@/components/common/Icons'
import { PageHeader } from '@/components/common/PageHeader'
import { WardGate } from '@/components/common/WardGate'
import { ROUTES } from '@/constants/routes'
import { useAppSelector } from '@/hooks/useAppStore'
import { CreateReportForm } from '@/sections/create-report/CreateReportForm'

export function CreateReportPage() {
  const user = useAppSelector(selectCurrentUser)
  return (
    <>
      <Link to={ROUTES.reports} className="inline-flex min-h-9 items-center gap-1.5 font-extrabold">
        <ChevronLeftIcon />
        Back to reports
      </Link>
      <PageHeader title="Report a problem" subtitle="Your name is never shown with a report." />
      <WardGate loadingLabel="Loading the street list">
        {(ward) => <CreateReportForm wardId={ward.wardId} ownStreetId={user?.streetId ?? null} />}
      </WardGate>
    </>
  )
}
