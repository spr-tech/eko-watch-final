// The signed-in user's role.
import type { Role } from '@/types/ekowatch'

// TEMPORARY: the role the layout shows until sign-in exists. Switch it by hand
// ('RESIDENT', 'OPERATOR' or 'AUTHORITY') to see each role's menu.
export const DEV_ROLE: Role = 'RESIDENT'

// TODO(slice-1): read session.user.role from the session slice instead.
export function useRole(): Role {
  return DEV_ROLE
}
