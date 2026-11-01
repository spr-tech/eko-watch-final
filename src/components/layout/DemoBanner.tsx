// The demonstration notice the brief requires on every page (brief p.3), full width at
// the very top as in the design. The short wording replaces the long one on phones.
export function DemoBanner() {
  return (
    <p className="bg-warning-light px-4 py-1 text-center text-sm/snug font-bold text-warning">
      <span className="hidden md:inline">
        Demonstration data (simulated) · people and activity are fictional; place names are real
      </span>
      <span className="md:hidden">Demo data (simulated) · fictional people, real places</span>
    </p>
  )
}
