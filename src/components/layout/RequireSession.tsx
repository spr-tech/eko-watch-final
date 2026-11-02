// Route guard for every signed-in page. Without a session:
// - if the last session ran out or was refused, it says "Your session has ended";
// - otherwise it goes to /login, with the page they wanted in ?next=.
// With a session it renders the app frame, and ends the session once expiresAt passes
// (checked once a minute), clearing sessionStorage too.
import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router'
import { isSessionExpired, selectSession, selectSessionEnded, sessionExpired } from '@/app/sessionSlice'
import { AppLayout } from '@/components/layout/AppLayout'
import { DemoBanner } from '@/components/layout/DemoBanner'
import { ROUTES } from '@/constants/routes'
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore'
import { useNow } from '@/hooks/useNow'
import { SessionEndedView } from '@/sections/access/SessionEndedView'

export function RequireSession() {
  const session = useAppSelector(selectSession)
  const ended = useAppSelector(selectSessionEnded)
  const location = useLocation()
  const now = useNow()
  const dispatch = useAppDispatch()
  const expired = session !== null && isSessionExpired(session.expiresAt, now)

  useEffect(() => {
    if (expired) dispatch(sessionExpired())
  }, [expired, dispatch])

  const next = `${location.pathname}${location.search}`
  if (!session || expired) {
    if (ended || expired) {
      return (
        <div className="flex min-h-dvh flex-col">
          <SessionEndedView next={next} />
          <DemoBanner />
        </div>
      )
    }
    return <Navigate to={`${ROUTES.login}?next=${encodeURIComponent(next)}`} replace />
  }
  return <AppLayout />
}
