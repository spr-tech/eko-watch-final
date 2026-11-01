// Desktop top bar: the ward on the left; the account and Sign out on the right.
import { selectCurrentUser } from '@/app/sessionSlice'
import { demoRoleLabel, initials } from '@/components/layout/account'
import { useAppSelector } from '@/hooks/useAppStore'
import { useSignOut } from '@/hooks/useSignOut'
import type { Role } from '@/types/ekowatch'

export function TopBar({ role }: { role: Role }) {
  const user = useAppSelector(selectCurrentUser)
  const signOut = useSignOut()
  return (
    <header className="hidden min-h-14 items-center justify-between gap-4 border-b border-border bg-bg px-8 md:flex">
      {/* TODO(slice-1): the ward name (WardView.wardName for the user's wardId, from
          listWards). Empty until then, never a guess (docs/design/README.md, correction 1). */}
      <div />
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
