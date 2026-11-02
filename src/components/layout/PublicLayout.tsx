// The frame for the signed-out pages (/ and /login). Each page sets its own width, since
// the landing and sign-in pages run edge to edge, and places the demo notice itself under
// its right-hand content (docs/decisions.md, 2026-11-02).
import { Outlet } from 'react-router'

export function PublicLayout() {
  return (
    <main className="flex min-h-dvh flex-col">
      <Outlet />
    </main>
  )
}
