// The demonstration notice the brief requires on every page (brief p.3), as a small
// note placed by the page itself. The public pages put it under their right-hand content
// (docs/decisions.md, 2026-11-02); signed-in pages show it as a footer (DemoBanner).
// The short wording replaces the long one on phones.
// Contrast: muted text on the page background 6.6:1; light text on the blue hero 5.8:1.
import { cn } from '@/lib/cn'

export function DemoNoticeText() {
  return (
    <>
      <span className="hidden md:inline">
        Demonstration data (simulated) · people and activity are fictional; place names are real
      </span>
      <span className="md:hidden">Demo data (simulated) · fictional people, real places</span>
    </>
  )
}

export function DemoNotice({ onDark = false, className }: { onDark?: boolean; className?: string }) {
  return (
    <p role="note" className={cn('text-center text-[13px]', onDark ? 'text-on-navy' : 'text-text-muted', className)}>
      <DemoNoticeText />
    </p>
  )
}
