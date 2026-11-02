// Route guard for pages only some roles may open (roles from constants/roles.ts). Any
// other role sees the no-access view inside the app frame. Rendered inside
// RequireSession, so there is always a signed-in role here.
import { Outlet } from 'react-router'
import { useRole } from '@/hooks/useRole'
import { NoAccessView } from '@/sections/access/NoAccessView'
import type { Role } from '@/types/ekowatch'

export function RequireRole({ roles }: { roles: Role[] }) {
  const role = useRole()
  if (!role) return null
  return roles.includes(role) ? <Outlet /> : <NoAccessView role={role} />
}
