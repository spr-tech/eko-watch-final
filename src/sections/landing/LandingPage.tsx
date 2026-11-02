// The public landing page at / (Main.dc.html): a header fixed to the top, the hero, the
// sections below it and the page footer. The page scrolls; the header stays in view.
import logoOnLight from '@/assets/ekowatch-logo-horizontal-on-light.svg'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { LandingHeader, LandingHero } from '@/sections/landing/LandingHero'
import { LandingSections } from '@/sections/landing/LandingSections'

export function LandingPage() {
  useDocumentTitle('Missed pickups and flooded roads, on the record')
  return (
    <>
      <LandingHeader />
      <LandingHero />
      <LandingSections />
      <div className="border-t border-border bg-bg">
        <div className="mx-auto flex max-w-270 flex-wrap items-center gap-x-4 gap-y-2 px-6 py-6">
          <img src={logoOnLight} alt="EkoWatch" className="h-8 w-auto" />
          {/* "one Lagos ward", never a hard-coded ward name (docs/design/README.md correction 1). */}
          <p className="text-text-muted">A TeSA Africa Cohort 6 capstone project by Team 1, for one Lagos ward.</p>
        </div>
      </div>
    </>
  )
}
