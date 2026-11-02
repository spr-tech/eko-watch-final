// The landing page below the hero (Main.dc.html): how it works, the four report types,
// why waste and floods go together, the three roles, the built-in rules and the
// sign-in call to action. The photos are for the capstone demo only, with sources and
// credits pending, so their "[PHOTO CREDIT]" captions are left out (docs/decisions.md).
// The "Sample activity" ticker, which lists made-up records, is left out too. The
// design's scroll-triggered reveals are not built yet. Both photos are below the fold,
// so they load lazily.
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { CheckIcon } from '@/components/common/Icons'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/cn'

const h2Class = 'text-[clamp(1.75rem,3vw,2.5rem)] leading-tight font-extrabold tracking-[-0.5px]'
const leadClass = 'mt-3 max-w-[36em] text-lg text-text-muted'

const STEPS = [
  ['A resident reports', 'A blocked drain on their street, with a photo where they can and a short note.'],
  ['A neighbour confirms', 'Each person can confirm a report once. Reports with more confirmations rank higher.'],
  ['The ward office sees it', 'On its dashboard, next to missed pickups and roads that are flooded now.'],
  ['The operator records pickups', 'After collecting, they mark the street done. Once per street, per day.'],
  [
    'No record means missed',
    'If a collection day passes with nothing recorded, the street shows as missed. Nobody has to report it.',
  ],
] as const

function TypeIcon({ children }: { children: ReactNode }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  )
}

const REPORT_TYPES = [
  {
    title: 'Missed pickup',
    text: 'Collection day came and went and nobody came. EkoWatch also flags it on its own when no pickup was recorded.',
    tone: 'bg-danger-light text-danger',
    icon: <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" />,
  },
  {
    title: 'Illegal dumping',
    text: 'Refuse left on a corner, a verge or an empty plot.',
    tone: 'bg-warning-light text-warning',
    icon: <path d="M7 9c0-2 2-3 5-3s5 1 5 3l2 10H5L7 9ZM10 6l2-3 2 3" />,
  },
  {
    title: 'Blocked drain',
    text: 'A drain choked with refuse or silt, ideally reported before the rain turns it into a flood.',
    tone: 'bg-primary-light text-primary',
    icon: <path d="M4 5h16v14H4zM8 5v14M12 5v14M16 5v14" />,
  },
  {
    title: 'Flooded road',
    text: 'Shows as current for 6 hours, then expires unless a neighbour confirms it again.',
    tone: 'bg-primary-light text-primary',
    icon: <path d="M3 15c2 0 2-1.5 4.5-1.5S10 15 12 15s2-1.5 4.5-1.5S19 15 21 15M3 19c2 0 2-1.5 4.5-1.5S10 19 12 19s2-1.5 4.5-1.5S19 19 21 19M12 3l3.5 5.5a4 4 0 1 1-7 0Z" />,
  },
]

const ROLES = [
  ['Residents', 'Report problems, confirm what neighbours report, and check the collection days for their street.'],
  ['Waste operators', 'See only the streets assigned to them, and mark each one done after collection.'],
  ['The ward office', 'Sees missed pickups by operator, blocked drains and current floods across the whole ward.'],
] as const

const RULES = [
  'Your name never appears on a report.',
  "Location data is removed from photos before they're stored.",
  'Only the ward office sees how each operator is performing.',
  'Every list tells you how old its newest report is.',
]

function Section({ id, className, children }: { id?: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={cn('mx-auto w-full max-w-270 scroll-mt-20 px-6', className)}>
      {children}
    </section>
  )
}

export function LandingSections() {
  return (
    <>
      <Section id="how" className="pt-20 pb-6">
        <h2 className={h2Class}>How it works</h2>
        <p className={leadClass}>From one resident's report to a street the whole ward can see is missed.</p>
        <ol className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(176px,1fr))] gap-7">
          {STEPS.map(([title, text], index) => (
            <li key={title} className="flex flex-col gap-2.5">
              <span
                aria-hidden="true"
                className="flex size-10 items-center justify-center rounded-full bg-text text-lg font-extrabold text-white"
              >
                {index + 1}
              </span>
              <h3 className="text-[19px] font-extrabold">{title}</h3>
              <p className="text-base text-text-muted">{text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section className="pt-16">
        <h2 className={h2Class}>Four things you can report</h2>
        <p className={leadClass}>Pick the one that matches what you see. A photo helps, but a short note is enough.</p>
        <ul className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-4">
          {REPORT_TYPES.map((type) => (
            <li key={type.title} className="flex flex-col gap-3 rounded-card border border-border bg-bg p-5.5">
              <span aria-hidden="true" className={cn('flex size-12 items-center justify-center rounded-xl', type.tone)}>
                <TypeIcon>{type.icon}</TypeIcon>
              </span>
              <h3 className="text-[19px] font-extrabold">{type.title}</h3>
              <p className="text-base text-text-muted">{type.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="pt-20">
        <div className="flex flex-wrap items-center gap-10">
          <div className="flex flex-[1_1_380px] flex-col gap-4.5">
            <p className="text-[clamp(1.9rem,3.6vw,3rem)] leading-tight font-extrabold tracking-[-0.5px]">
              Refuse that isn't collected ends up in drains.{' '}
              <strong className="text-primary">Blocked drains flood roads.</strong>
            </p>
            <p className="max-w-[30em] text-lg text-text-muted">
              That's why EkoWatch keeps both on one record for each street, so the ward can see one problem leading to
              the next.
            </p>
          </div>
          <div className="max-w-158.5 flex-[1_1_420px] overflow-hidden rounded-[20px] bg-border">
            <img
              src="/drain-clearing-crew-2.webp"
              alt="Officials and sanitation workers in high-visibility vests and masks shovelling a heap of refuse from a street."
              width={1024}
              height={683}
              loading="lazy"
              decoding="async"
              className="block h-auto w-full contrast-[0.86] saturate-[0.82] brightness-[1.04]"
            />
          </div>
        </div>
      </Section>

      <Section className="pt-20">
        <h2 className={h2Class}>Three roles, three views</h2>
        <p className={leadClass}>Your role comes with your account. Nobody picks one on screen.</p>
        <ul className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-7">
          {ROLES.map(([title, text]) => (
            <li key={title} className="flex flex-col gap-2">
              <h3 className="text-[22px] font-extrabold">{title}</h3>
              <p className="text-base text-text-muted">{text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="pt-20">
        <div className="rounded-[20px] bg-text p-[clamp(28px,4vw,48px)] text-white">
          <h2 className={h2Class}>Rules built into EkoWatch</h2>
          <ul className="mt-6 grid gap-3.5 sm:grid-cols-2">
            {RULES.map((rule) => (
              <li key={rule} className="flex items-start gap-3 text-[17px] font-semibold text-on-navy">
                <span className="mt-0.5 text-action">
                  <CheckIcon size={22} />
                </span>
                {rule}
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-col gap-2 border-t border-navy-divider pt-5 text-base text-on-navy-muted">
            <p>
              EkoWatch is a community record for one ward. It doesn't forecast floods, send out crews or replace any
              agency.
            </p>
            <p>
              A web page can't prove a photo was taken on the spot rather than picked from a gallery, so every photo is
              stamped with the time it reached us.
            </p>
          </div>
        </div>
      </Section>

      <Section className="pt-16 pb-20">
        <div className="flex flex-wrap items-stretch overflow-hidden rounded-3xl border-2 border-text bg-bg">
          <div className="relative min-h-70 flex-[1_1_380px] bg-border">
            <img
              src="/flooded-market-street-3.webp"
              alt="A flooded street. A yellow tricycle drives through the water as people walk along the edge past a parked container lorry."
              width={1280}
              height={836}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover object-[50%_60%] contrast-[0.92] saturate-[0.9]"
            />
          </div>
          <div className="flex flex-[1_1_380px] flex-col items-start justify-center gap-3.5 p-[clamp(24px,4vw,44px)]">
            <h2 className="text-[clamp(1.5rem,2.6vw,2.1rem)] leading-tight font-extrabold tracking-[-0.5px]">
              Try it with a demo account
            </h2>
            <p className="max-w-[30em] text-[17px] text-text-muted">
              Sign in as a resident, an operator or the ward office. Every person and report in the demo is fictional;
              the place names are real.
            </p>
            <Link
              to={ROUTES.login}
              className="mt-1.5 inline-flex min-h-13 items-center rounded-xl bg-action px-7 text-lg font-extrabold text-text hover:bg-action-hover"
            >
              Sign in
            </Link>
          </div>
        </div>
      </Section>
    </>
  )
}
