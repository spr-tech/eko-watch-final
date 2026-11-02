// The signed-in user's role, from the session; null when signed out.
import { selectCurrentUser } from '@/app/sessionSlice'
import { useAppSelector } from '@/hooks/useAppStore'
import type { Role } from '@/types/ekowatch'

export function useRole(): Role | null {
  return useAppSelector(selectCurrentUser)?.role ?? null
}
