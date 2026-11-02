// /login (SignIn.dc.html): a photo panel beside the sign-in card on desktop; on phones the
// panel becomes a short strip and the card overlaps it. The photos are for the capstone
// demo only, with sources and credits pending, so there is no caption (docs/decisions.md).
// The demo notice sits directly under the card, in the right column.
import { useEffect, useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router'
import { selectCurrentUser } from '@/app/sessionSlice'
import logoOnDark from '@/assets/ekowatch-logo-horizontal-on-dark.svg'
import { DemoNotice } from '@/components/layout/DemoNotice'
import { signInDestination } from '@/constants/roles'
import { ROUTES } from '@/constants/routes'
import { useAppSelector } from '@/hooks/useAppStore'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/cn'
import { SignInForm } from '@/sections/sign-in/SignInForm'

// The first photo always shows; the second fades in over it and out again. To swap a
// photo, change its entry here.
const SLIDES = [
  {
    src: '/residents-wading-flood-4-1600.jpg',
    width: 1600,
    height: 1024,
    position: 'object-[55%_60%]',
    alt: 'Two men wade through waist-deep floodwater, pushing a wooden platform with a woman and a small child sitting on it.',
  },
  {
    src: '/residents-wading-flood-5.jpg',
    width: 1890,
    height: 1064,
    position: 'object-[50%_60%]',
    alt: 'A long heap of refuse piled along a road, next to yellow tricycles, a bus and market umbrellas.',
  },
] as const

const SLIDE_MS = 7000

function usePageVisible(): boolean {
  const [visible, setVisible] = useState(() => document.visibilityState === 'visible')
  useEffect(() => {
    const onChange = () => setVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onChange)
    return () => document.removeEventListener('visibilitychange', onChange)
  }, [])
  return visible
}

// Two stacked photos under a dark fade. The second photo is only fetched once the first
// has shown, and fading starts once it has loaded, so the panel never shows a gap. With
// reduced motion only the first photo shows, and the second is never fetched.
function SignInPhotos() {
  const reducedMotion = usePrefersReducedMotion()
  const pageVisible = usePageVisible()
  const [firstLoaded, setFirstLoaded] = useState(false)
  const [secondLoaded, setSecondLoaded] = useState(false)
  const [paused, setPaused] = useState(false)
  const [showSecond, setShowSecond] = useState(false)

  const slideshow = !reducedMotion && secondLoaded
  const running = slideshow && !paused && pageVisible
  const secondShowing = slideshow && showSecond

  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(() => setShowSecond((shown) => !shown), SLIDE_MS)
    return () => window.clearInterval(timer)
  }, [running])

  const [first, second] = SLIDES
  return (
    <>
      <img
        src={first.src}
        alt={first.alt}
        aria-hidden={secondShowing}
        width={first.width}
        height={first.height}
        fetchPriority="high"
        decoding="async"
        onLoad={() => setFirstLoaded(true)}
        className={cn('absolute inset-0 size-full object-cover', first.position)}
      />
      {!reducedMotion && firstLoaded && (
        <img
          src={second.src}
          alt={second.alt}
          aria-hidden={!secondShowing}
          width={second.width}
          height={second.height}
          decoding="async"
          onLoad={() => setSecondLoaded(true)}
          className={cn(
            'absolute inset-0 size-full object-cover transition-opacity duration-1200 ease-in-out',
            second.position,
            secondShowing ? 'opacity-100' : 'opacity-0',
          )}
        />
      )}
      {/* Darker than the design's fade over the lower third, so the white text keeps at
          least 4.5:1 even over the brightest parts of either photo. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_top,rgba(11,29,46,0.88)_0%,rgba(11,29,46,0.72)_35%,rgba(11,29,46,0.1)_65%,rgba(11,29,46,0.35)_100%)]"
      />
      {slideshow && (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? 'Play photo slideshow' : 'Pause photo slideshow'}
          className="absolute top-4 right-4 z-10 flex size-11 items-center justify-center rounded-full border-2 border-white/80 bg-[rgba(11,29,46,0.7)] text-white hover:bg-[rgba(11,29,46,0.9)] md:top-5 md:right-6"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            {paused ? <path d="M8 5v14l11-7z" /> : <path d="M7 5h4v14H7zM13 5h4v14h-4z" />}
          </svg>
        </button>
      )}
    </>
  )
}

export function SignInPage() {
  useDocumentTitle('Sign in')
  const user = useAppSelector(selectCurrentUser)
  const [searchParams] = useSearchParams()
  // Signed in (just now, or already): go to ?next= if the role may open it, else home.
  if (user) return <Navigate to={signInDestination(user.role, searchParams.get('next'))} replace />
  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <div className="on-dark relative h-37.5 shrink-0 overflow-hidden bg-text text-white md:h-auto md:min-h-130 md:flex-[1.1_1_0] short:md:min-h-0">
        <SignInPhotos />
        <Link to={ROUTES.home} aria-label="EkoWatch home" className="absolute top-5 left-6 z-10 rounded-sm">
          <img src={logoOnDark} alt="" className="h-8 w-auto" />
        </Link>
        <div className="absolute right-7 bottom-7 left-7 z-10 hidden md:block">
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
