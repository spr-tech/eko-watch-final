// Desktop top bar: the ward on the left; the account and Sign out on the right.
import { selectCurrentUser } from '@/app/sessionSlice'
import { demoRoleLabel, initials } from '@/components/layout/account'
import { useAppSelector } from '@/hooks/useAppStore'
import { useWard } from '@/hooks/useWard'
import { useSignOut } from '@/hooks/useSignOut'
import type { Role } from '@/types/ekowatch'

export function TopBar({ role }: { role: Role }) {
  const user = useAppSelector(selectCurrentUser)
  const signOut = useSignOut()
  const ward = useWard()
  const wardName = ward.status === 'picked' ? ward.wardName : null
  return (
    <header className="hidden min-h-14 items-center justify-between gap-4 border-b border-border bg-bg px-8 md:flex">
      {/* The ward name from GET /wards; empty until it loads, never a guess
          (docs/design/README.md, correction 1). */}
      <p className="min-w-0 truncate font-extrabold text-text">{wardName}</p>
      <div className="flex items-center gap-3">
        {user && (
          <span
            aria-hidden="true"
            className="flex size-9 items-center justify-center rounded-full bg-text text-[13px] font-extrabold text-white"
          >
            {initials(user.displayName)}
          </span>
        )}
        <div className="leading-tight">
          {user && <p className="font-extrabold text-text">{user.displayName}</p>}
          <p className="text-[13px] font-semibold text-text-muted">{demoRoleLabel(role)}</p>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="min-h-10 rounded-md border border-border-input bg-bg px-4 font-extrabold text-text hover:bg-surface-hover"
        >
          Sign out
        </button>
      </div>
    </header>
  )
}
