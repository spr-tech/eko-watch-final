// "Your session has ended" (the session-ended board on Reports.dc.html, which applies to
// every signed-in screen). Shown when the session ran out or the service refused it.
// The design draws it as a dialog over the page; here the session is already gone, so it
// is the whole page, with the same card and wording. "Sign in again" comes back here.
import { Link } from 'react-router'
import { buttonStyles } from '@/components/common/buttonStyles'
import { LockIcon } from '@/components/common/Icons'
import { IconTile } from '@/components/common/StateCard'
import { ROUTES } from '@/constants/routes'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export function SessionEndedView({ next }: { next: string }) {
  useDocumentTitle('Your session has ended')
  return (
    <div className="flex flex-1 items-center justify-center bg-text/60 p-4">
      <div
        role="alert"
        aria-labelledby="session-ended-title"
        className="flex w-full max-w-105 flex-col items-start gap-3 rounded-[18px] bg-bg p-6 shadow-[0_30px_60px_rgba(4,14,26,0.35)]"
      >
        <IconTile tone="primary" size="sm">
          <LockIcon size={22} />
        </IconTile>
        <h1 id="session-ended-title" className="text-[21px] font-extrabold">
          Your session has ended
        </h1>
        <p className="text-text-muted">For your security you've been signed out. Sign in again to carry on.</p>
        <Link to={`${ROUTES.login}?next=${encodeURIComponent(next)}`} className={`${buttonStyles.green} mt-1 w-full`}>
          Sign in again
        </Link>
      </div>
    </div>
  )
}
