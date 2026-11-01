// The frame for the signed-out pages (/ and /login): the page, then the demo notice.
import { Outlet } from 'react-router'
import { DemoBanner } from '@/components/layout/DemoBanner'

export function PublicLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto w-full max-w-295 flex-1 px-4 py-6 md:px-8">
        <Outlet />
      </main>
      <DemoBanner />
    </div>
  )
}
