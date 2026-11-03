// The signed-in frame for every route except / and /login.
// Desktop: blue sidebar, white top bar, and the demo notice below the page content in
// the main column. Phone: blue top bar, the demo notice, then the bottom tab bar, so the
// notice is never hidden behind it. The switch is CSS only (md:).
// The frame is exactly one screen tall (100dvh) and never scrolls itself: the sidebar,
// the top bars and the tab bar stay put, and only the content column between them
// scrolls, with its own scrollbar.
import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router'
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
  const { pathname } = useLocation()
  const scrollRef = useRef<HTMLDivElement>(null)

  // The window no longer scrolls, so the browser can't reset it: start each new page at
  // the top of the content column.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, left: 0 })
  }, [pathname])

  if (!role) return null
  return (
    <div className="flex h-dvh overflow-hidden">
      <SkipLink targetId={MAIN_ID} />
      <Sidebar role={role} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <PhoneTopBar role={role} />
        <TopBar role={role} />
        <div ref={scrollRef} className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <main
            id={MAIN_ID}
            tabIndex={-1}
            className="mx-auto w-full max-w-295 flex-1 px-4 pt-4 pb-6 focus:outline-none md:px-8 md:pt-6 md:pb-10 short:md:pt-5"
          >
            <Outlet />
          </main>
          <DemoBanner />
        </div>
        <TabBar role={role} />
      </div>
    </div>
  )
}
