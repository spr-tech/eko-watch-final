// "You don't have access to this page" (NoAccess.dc.html), shown inside the app frame
// when a role opens a page that isn't theirs. The design's example (an operator refused
// Reports) no longer applies, since operators can read Reports (docs/decisions.md), so
// the wording is general. Hiding pages is convenience only; the service enforces roles.
import { Link } from 'react-router'
import { buttonStyles } from '@/components/common/buttonStyles'
import { LockIcon } from '@/components/common/Icons'
import { pageTitleClass } from '@/components/common/PageHeader'
import { IconTile, StateCard } from '@/components/common/StateCard'
import { ROLE_NAV } from '@/constants/roles'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import type { Role } from '@/types/ekowatch'

export function NoAccessView({ role }: { role: Role }) {
  useDocumentTitle("You don't have access to this page")
  const home = ROLE_NAV[role].home
  return (
    <StateCard role="alert" className="mx-auto mt-6 max-w-155 gap-3 px-7 py-8">
      <IconTile tone="neutral" size="lg">
        <LockIcon size={26} />
      </IconTile>
      <h1 className={pageTitleClass}>You don't have access to this page</h1>
      <p className="max-w-[34em] leading-relaxed text-text-muted">
        This page isn't part of your account. If you think this is wrong, ask the ward office to check your access.
      </p>
      <Link to={home.to} className={`${buttonStyles.navy} mt-1.5`}>
        Go to {home.label}
      </Link>
    </StateCard>
  )
}
