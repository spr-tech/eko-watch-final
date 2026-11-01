// The signed-in frame for every route except / and /login.
// Desktop: banner, blue sidebar and white top bar. Phone: banner, blue top bar and a
// bottom tab bar. The switch is CSS only (md:), so nothing waits on JavaScript.
import { Outlet } from 'react-router'
import { DemoBanner } from '@/components/layout/DemoBanner'
import { PhoneTopBar } from '@/components/layout/PhoneTopBar'
import { Sidebar } from '@/components/layout/Sidebar'
import { SkipLink } from '@/components/layout/SkipLink'
import { TabBar } from '@/components/layout/TabBar'
import { TopBar } from '@/components/layout/TopBar'
import { useRole } from '@/hooks/useRole'

const MAIN_ID = 'main-content'

export function AppLayout() {
  const role = useRole()
  return (
    <div className="flex min-h-dvh flex-col">
      <SkipLink targetId={MAIN_ID} />
      <DemoBanner />
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
          <TabBar role={role} />
        </div>
      </div>
    </div>
  )
}
