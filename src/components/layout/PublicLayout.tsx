// The frame for the signed-out pages (/ and /login): the demo banner above the page.
import { Outlet } from 'react-router'
import { DemoBanner } from '@/components/layout/DemoBanner'

export function PublicLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <DemoBanner />
      <main className="mx-auto w-full max-w-295 flex-1 px-4 py-6 md:px-8">
        <Outlet />
      </main>
    </div>
  )
}
