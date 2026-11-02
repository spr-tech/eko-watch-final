// The landing page's header and hero (Main.dc.html). The header stays fixed to the top
// while the page scrolls, so the logo and Sign in are always in reach.
// Corrections from docs/design/README.md: no ward name in the header (a signed-out
// visitor can't load it), and no photo or "[LOCATION]"/"[PHOTO CREDIT]" caption, only a
// plain panel. The design's animated sample report card is left out: it is a made-up
// record. The demo notice sits under the panel, in the right column.
import { Link } from 'react-router'
import iconOnDark from '@/assets/ekowatch-icon.svg'
import logoOnDark from '@/assets/ekowatch-logo-horizontal-on-dark.svg'
import { DemoNotice } from '@/components/layout/DemoNotice'
import { ROUTES } from '@/constants/routes'

export function LandingHeader() {
  return (
    <header className="on-dark sticky top-0 z-20 bg-sidebar text-white shadow-[0_1px_0_rgba(255,255,255,0.12)]">
      <div className="mx-auto flex w-full max-w-310 items-center justify-between gap-4 px-6 py-3">
        <Link to={ROUTES.home} aria-label="EkoWatch home" className="rounded-sm">
          <img src={logoOnDark} alt="" className="h-9 w-auto" />
        </Link>
        <Link
          to={ROUTES.login}
          className="inline-flex min-h-11 items-center rounded-md border-2 border-white px-4.5 text-base font-extrabold hover:bg-white/14"
        >
          Sign in
        </Link>
      </div>
    </header>
  )
}

export function LandingHero() {
  return (
    <div className="on-dark bg-sidebar text-white">
      <section
        aria-labelledby="landing-heading"
        className="mx-auto flex max-w-310 flex-wrap items-center gap-x-14 gap-y-8 px-6 pt-5 pb-11 short:pb-8"
      >
        <div className="flex flex-[1_1_420px] flex-col gap-6 short:gap-4">
          <h1
            id="landing-heading"
            className="text-[clamp(1.9rem,min(3.8vw,7.5vh),3.6rem)] leading-[1.04] font-extrabold tracking-[-1.5px]"
          >
            Missed pickups and flooded roads, on the record.
          </h1>
          <p className="max-w-[32em] text-[clamp(1rem,1.5vw,1.2rem)] leading-relaxed font-semibold text-on-navy">
            EkoWatch gives one Lagos ward a shared picture: which streets were collected, where drains are blocked,
            and which roads are flooded right now. Residents report it, neighbours confirm it, and operators record
            every pickup.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              to={ROUTES.login}
              className="inline-flex min-h-13 items-center rounded-xl bg-action px-6.5 text-lg font-extrabold text-text hover:bg-action-hover"
            >
              Sign in
            </Link>
            <a
              href="#how"
              className="inline-flex min-h-13 items-center rounded-xl border-2 border-white/75 px-5.5 text-lg font-extrabold hover:bg-white/14"
            >
              How it works
            </a>
          </div>
        </div>

        <div className="flex flex-[1.3_1_520px] flex-col gap-2.5">
          <div
            aria-hidden="true"
            className="flex h-[clamp(200px,min(33vw,55vh),500px)] items-center justify-center rounded-[28px] bg-text shadow-[0_32px_64px_rgba(4,14,26,0.38)]"
          >
            <img src={iconOnDark} alt="" className="h-3/5 max-h-40 w-auto" />
          </div>
          <DemoNotice onDark />
        </div>
      </section>
    </div>
  )
}
