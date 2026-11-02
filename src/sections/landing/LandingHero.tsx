// The landing page's header and hero (Main.dc.html). The header stays fixed to the top
// while the page scrolls, so the logo and Sign in are always in reach.
// Corrections from docs/design/README.md: no ward name in the header (a signed-out
// visitor can't load it), and no "[LOCATION]"/"[PHOTO CREDIT]" caption under the photo.
// The photo is for the capstone demo only; its source and credit are pending
// (docs/decisions.md). The sample report card on it is fixed display copy, labelled
// fictional, and nothing else reads it (docs/decisions.md). The design's "Blocked drain
// reported" chip and Replay button are left out, and the pin sits right of the card, not
// at 36% across, so the card never hides it at the shorter panel heights used here. The
// demo notice sits under the panel.
// The entrance and card animations live in index.css and stop under reduced motion.
import { Link } from 'react-router'
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
            className="ew-in text-[clamp(1.9rem,min(3.8vw,7.5vh),3.6rem)] leading-[1.04] font-extrabold tracking-[-1.5px]"
          >
            Missed pickups and flooded roads, on the record.
          </h1>
          <p className="ew-in ew-in-2 max-w-[32em] text-[clamp(1rem,1.5vw,1.2rem)] leading-relaxed font-semibold text-on-navy">
            EkoWatch gives one Lagos ward a shared picture: which streets were collected, where drains are blocked,
            and which roads are flooded right now. Residents report it, neighbours confirm it, and operators record
            every pickup.
          </p>
          <div className="ew-in ew-in-3 flex flex-wrap gap-3 pt-1">
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

        <div className="ew-in ew-in-2 flex min-w-0 flex-[1.3_1_520px] flex-col gap-2.5">
          <div className="relative h-[clamp(340px,min(33vw,55vh),500px)] overflow-hidden rounded-[28px] bg-text shadow-[0_32px_64px_rgba(4,14,26,0.38)]">
            <img
              src="/flooded-road-traffic-1.webp"
              alt="A road under brown floodwater. A car and yellow tricycles drive through it while traders stand at the edge."
              width={1280}
              height={719}
              fetchPriority="high"
              decoding="async"
              className="ew-kb absolute inset-0 size-full object-cover object-[32%_50%]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-[rgba(11,29,46,0.72)] to-[rgba(11,29,46,0)]"
            />
            <SampleReport />
          </div>
          <DemoNotice onDark />
        </div>
      </section>
    </div>
  )
}

function WaveIcon({ size, lines }: { size: number; lines: string[] }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      {lines.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}

// The design's sample report arriving on the photo: a pin drops, the card slides in, and
// three neighbours confirm it. Fixed display copy, not data.
function SampleReport() {
  return (
    <>
      <span className="ew-tag absolute top-4.5 left-4.5 inline-flex min-h-7.5 items-center rounded-full bg-warning-light px-3 text-[13px] font-extrabold text-warning">
        Sample report (fictional)
      </span>

      <div aria-hidden="true" className="absolute top-[46%] left-[80%] size-0 max-sm:hidden">
        <span className="ew-ring absolute -top-9 -left-9 size-18 rounded-full border-3 border-white" />
        <span className="ew-ring ew-ring-2 absolute -top-9 -left-9 size-18 rounded-full border-3 border-white" />
        <span className="ew-pin absolute -top-15 -left-6 flex flex-col items-center">
          <span className="flex size-12 items-center justify-center rounded-full border-3 border-white bg-primary text-white shadow-[0_8px_18px_rgba(4,14,26,0.4)]">
            <WaveIcon size={24} lines={['M4 10q2-2 4 0t4 0t4 0t4 0', 'M4 15q2-2 4 0t4 0t4 0t4 0']} />
          </span>
          <span className="h-3.5 w-0.75 rounded-xs bg-white" />
        </span>
      </div>

      <div className="ew-card absolute bottom-4.5 left-4.5 flex w-[min(380px,calc(100%-36px))] flex-col gap-3.5 rounded-[18px] bg-bg p-4.5 text-text shadow-[0_20px_44px_rgba(4,14,26,0.35)]">
        <div className="ew-row flex items-center gap-3">
          <span className="flex size-10.5 flex-none items-center justify-center rounded-xl bg-primary-light text-primary">
            <WaveIcon size={22} lines={['M3 9q3-3 6 0t6 0t6 0', 'M3 14q3-3 6 0t6 0t6 0', 'M3 19q3-3 6 0t6 0t6 0']} />
          </span>
          <span className="flex min-w-0 flex-auto flex-col leading-tight">
            <span className="text-lg font-extrabold">Flooded road</span>
            <span className="text-sm font-semibold text-text-muted">Commercial Avenue, reported 20 min ago</span>
          </span>
          <span className="inline-flex min-h-7 flex-none items-center gap-1.5 rounded-full bg-success-light px-2.5 text-[13px] font-extrabold text-success">
            <span aria-hidden="true" className="size-2 rounded-full bg-fresh" />
            Current
          </span>
        </div>
        <div className="ew-row ew-row-2 flex items-center justify-between gap-3 border-t border-skeleton pt-3.5">
          <span className="text-[15px] font-bold text-text-muted">Confirmed by neighbours</span>
          <span className="flex items-center gap-2.5">
            <span aria-hidden="true" className="flex gap-1">
              <span className="ew-dot size-2.5 rounded-full bg-action" />
              <span className="ew-dot ew-dot-2 size-2.5 rounded-full bg-action" />
              <span className="ew-dot ew-dot-3 size-2.5 rounded-full bg-action" />
            </span>
            <span className="relative inline-block h-7 w-[1ch] text-2xl leading-7 font-extrabold">
              <span aria-hidden="true" className="ew-c1 absolute top-0 left-0">1</span>
              <span aria-hidden="true" className="ew-c2 absolute top-0 left-0">2</span>
              <span className="ew-c3 absolute top-0 left-0">3</span>
            </span>
          </span>
        </div>
        <div className="ew-row ew-row-3 flex flex-col gap-2">
          <div className="h-1.5 overflow-hidden rounded-[3px] bg-skeleton">
            <div className="ew-bar h-1.5 w-[94%] rounded-[3px] bg-primary" />
          </div>
          <span className="text-[13px] font-semibold text-text-muted">
            Expires in 5 h 40 min unless someone reconfirms. Reporter's name is never shown.
          </span>
        </div>
      </div>
    </>
  )
}
