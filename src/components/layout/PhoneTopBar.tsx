// Phone top bar: logo, and an account button that opens a small panel with the name,
// the role and Sign out. The design draws the button but not what it opens.
import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router'
import logoOnDark from '@/assets/ekowatch-logo-horizontal-on-dark.svg'
import { selectCurrentUser } from '@/app/sessionSlice'
import { demoRoleLabel, initials } from '@/components/layout/account'
import { ROUTES } from '@/constants/routes'
import { useAppSelector } from '@/hooks/useAppStore'
import { useSignOut } from '@/hooks/useSignOut'
import type { Role } from '@/types/ekowatch'

export function PhoneTopBar({ role }: { role: Role }) {
  const user = useAppSelector(selectCurrentUser)
  const signOut = useSignOut()
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const roleLabel = demoRoleLabel(role)

  // Escape or a click outside closes the panel. Escape returns focus to the button.
  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    function onPointerDown(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  return (
    <header className="on-dark flex items-center justify-between bg-sidebar px-4 py-2.5 text-on-sidebar md:hidden">
      <Link to={ROUTES.home} aria-label="EkoWatch home" className="rounded-sm">
        <img src={logoOnDark} alt="" className="h-7 w-auto" />
      </Link>
      <div ref={wrapperRef} className="relative">
        <button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={`Account: ${user ? `${user.displayName}, ` : ''}${roleLabel}. ${open ? 'Close' : 'Open'} menu`}
          onClick={() => setOpen((value) => !value)}
          className="flex size-11 items-center justify-center rounded-full border-2 border-white/70 bg-white/12 text-sm font-extrabold"
        >
          {user ? (
            initials(user.displayName)
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21a8 8 0 0 1 16 0" />
            </svg>
          )}
        </button>
        {open && (
          <div
            id={panelId}
            className="absolute top-full right-0 z-20 mt-2 w-60 rounded-card border border-border bg-bg p-4 text-text shadow-lg"
          >
            {user && <p className="font-extrabold">{user.displayName}</p>}
            <p className="text-[13px] font-semibold text-text-muted">{roleLabel}</p>
            <button
              type="button"
              onClick={signOut}
              className="mt-3 min-h-10 w-full rounded-md border border-border-input bg-bg px-4 font-extrabold text-text hover:bg-surface-hover"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
