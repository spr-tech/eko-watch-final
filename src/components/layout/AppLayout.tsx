// The signed-in frame for every route except / and /login.
// Desktop: blue sidebar, white top bar, and the demo notice below the page content in
// the main column. Phone: blue top bar, the demo notice, then the bottom tab bar, so the
// notice is never hidden behind it. The switch is CSS only (md:).
import { Outlet } from 'react-router'
import { DemoBanner } from '@/components/layout/DemoBanner'
import { PhoneTopBar } from '@/components/layout/PhoneTopBar'
import { Sidebar } from '@/components/layout/Sidebar'
import { SkipLink } from '@/components/layout/SkipLink'
import { TabBar } from '@/components/layout/TabBar'
import { TopBar } from '@/components/layout/TopBar'
import { useRole } from '@/hooks/useRole'

const MAIN_ID = 'main-content'

// Rendered by RequireSession only when there is a session, so there is a role.
export function AppLayout() {
  const role = useRole()
  if (!role) return null
  return (
    <div className="flex min-h-dvh flex-col">
      <SkipLink targetId={MAIN_ID} />
      <div className="flex flex-1">
        <Sidebar role={role} />
        <div className="flex min-w-0 flex-1 flex-col">
          <PhoneTopBar role={role} />
          <TopBar role={role} />
          <main
            id={MAIN_ID}
            tabIndex={-1}
            className="mx-auto w-full max-w-295 flex-1 px-4 pt-4 pb-6 focus:outline-none md:px-8 md:pt-6 md:pb-10 short:md:pt-5"
          >
            <Outlet />
          </main>
          <DemoBanner />
          <TabBar role={role} />
        </div>
      </div>
    </div>
  )
}
