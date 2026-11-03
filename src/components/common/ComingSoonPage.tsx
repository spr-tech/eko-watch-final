// What a signed-in route shows until its screen is built: the page heading, "Coming soon",
// one line on what the page will do, and a way back to the role's home page.
import { Link } from 'react-router'
import { buttonStyles } from '@/components/common/buttonStyles'
import { PageHeader } from '@/components/common/PageHeader'
import { StateCard } from '@/components/common/StateCard'
import { homePathFor } from '@/constants/roles'
import { ROUTES } from '@/constants/routes'
import { useRole } from '@/hooks/useRole'

export function ComingSoonPage({ title, description }: { title: string; description: string }) {
  const role = useRole()
  return (
    <>
      <PageHeader title={title} />
      <StateCard>
        <h2 className="text-xl font-extrabold">Coming soon</h2>
        <p className="max-w-md text-text-muted">{description}</p>
        <Link to={role ? homePathFor(role) : ROUTES.home} className={`${buttonStyles.navy} mt-2`}>
          Back to home
        </Link>
      </StateCard>
    </>
  )
}
