// The demonstration notice the brief requires on every page (brief p.3), as a quiet
// footer below the page content (docs/decisions.md, 2026-11-01, notice moved to footer).
// The short wording replaces the long one on phones. Muted text on the page background
// is 6.6:1. A <footer> outside <main>, so screen readers list it as the page's footer.
export function DemoBanner() {
  return (
    <footer className="border-t border-border px-4 py-3 text-center text-[13px] text-text-muted">
      <span className="hidden md:inline">
        Demonstration data (simulated) · people and activity are fictional; place names are real
      </span>
      <span className="md:hidden">Demo data (simulated) · fictional people, real places</span>
    </footer>
  )
}
