// /login (SignIn.dc.html): a brand panel beside the sign-in card on desktop; on phones the
// panel becomes a short strip and the card overlaps it. The design's photo is replaced by
// the plain brand colour, with no caption (docs/design/README.md correction 5).
// The demo notice sits directly under the card, in the right column.
import { Link } from 'react-router'
import logoOnDark from '@/assets/ekowatch-logo-horizontal-on-dark.svg'
import { DemoNotice } from '@/components/layout/DemoNotice'
import { ROUTES } from '@/constants/routes'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { SignInForm } from '@/sections/sign-in/SignInForm'

export function SignInPage() {
  useDocumentTitle('Sign in')
  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <div className="on-dark relative h-37.5 shrink-0 bg-sidebar text-white md:h-auto md:min-h-130 md:flex-[1.1_1_0] short:md:min-h-0">
        <Link to={ROUTES.home} aria-label="EkoWatch home" className="absolute top-5 left-6 rounded-sm">
          <img src={logoOnDark} alt="" className="h-8 w-auto" />
        </Link>
        <div className="absolute right-7 bottom-7 left-7 hidden md:block">
          <p className="max-w-[12em] text-[clamp(1.9rem,3vw,2.8rem)] leading-tight font-extrabold tracking-[-0.5px]">
            Know what's happening on your street.
          </p>
          <p className="mt-3 max-w-[28em] text-base font-semibold text-on-navy">
            Missed pickups, blocked drains and flooded roads, reported by neighbours and kept current together.
          </p>
        </div>
      </div>
      <div className="relative -mt-6 flex flex-1 flex-col items-center justify-start gap-3 px-3 pb-6 md:mt-0 md:justify-center md:px-8 md:py-5">
        <SignInForm />
        <DemoNotice className="max-w-110" />
      </div>
    </div>
  )
}
