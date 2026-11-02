// The demonstration notice as a quiet footer below the page content on signed-in pages
// (docs/decisions.md, 2026-11-01, notice moved to footer). Muted text on the page
// background is 6.6:1. A <footer> outside <main>, so screen readers list it as the
// page's footer. The public pages place the same words themselves (DemoNotice).
import { DemoNoticeText } from '@/components/layout/DemoNotice'

export function DemoBanner() {
  return (
    <footer className="border-t border-border px-4 py-3 text-center text-[13px] text-text-muted">
      <DemoNoticeText />
    </footer>
  )
}
