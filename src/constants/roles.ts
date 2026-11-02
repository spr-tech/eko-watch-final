// Who can open what. The menu for each role (sidebar and phone tab bar) and the roles
// allowed on each route (route guards and canOpen) both come from here, so they can't
// disagree. Hiding a page is convenience only: the service decides who may do what.
import { matchPath } from 'react-router'
import type { NavIconName } from '@/components/layout/NavIcons'
import { ROUTES } from '@/constants/routes'
import type { Role } from '@/types/ekowatch'

export type NavItem = { label: string; to: string; icon: NavIconName }

type RoleNav = {
  // Where the role lands, and what the no-access view sends them back to.
  home: NavItem
  // The green "Report a problem" action, residents only. On the phone it is the third
  // tab, labelled tabLabel.
  action?: NavItem & { tabLabel: string }
  items: NavItem[]
}

const reports: NavItem = { label: 'Reports', to: ROUTES.reports, icon: 'reports' }
const hazards: NavItem = { label: 'Hazards', to: ROUTES.hazards, icon: 'hazards' }
const myStreet: NavItem = { label: 'My street', to: ROUTES.collections, icon: 'street' }
const todaysStreets: NavItem = { label: "Today's streets", to: ROUTES.operatorCollections, icon: 'streets' }
const dashboard: NavItem = { label: 'Dashboard', to: ROUTES.authorityDashboard, icon: 'dashboard' }

// Menus in the design's order. Operators also get Reports, read-only
// (docs/design/README.md correction 6, docs/decisions.md).
export const ROLE_NAV: Record<Role, RoleNav> = {
  RESIDENT: {
    home: reports,
    action: { label: 'Report a problem', tabLabel: 'Report', to: ROUTES.newReport, icon: 'plus' },
    items: [reports, hazards, myStreet],
  },
  OPERATOR: { home: todaysStreets, items: [todaysStreets, reports, hazards] },
  AUTHORITY: { home: dashboard, items: [dashboard, reports, hazards] },
}

const ALL_ROLES: Role[] = ['RESIDENT', 'OPERATOR', 'AUTHORITY']

// The roles that may open each signed-in route (CLAUDE.md "Routes and pages").
// /collections is open to AUTHORITY but not in their menu, as in the design.
export const ROUTE_ROLES: Record<string, Role[]> = {
  [ROUTES.setup]: ['RESIDENT'],
  [ROUTES.collections]: ['RESIDENT', 'AUTHORITY'],
  [ROUTES.reports]: ALL_ROLES,
  [ROUTES.newReport]: ['RESIDENT'],
  [ROUTES.reportDetailPattern]: ALL_ROLES,
  [ROUTES.hazards]: ALL_ROLES,
  [ROUTES.operatorCollections]: ['OPERATOR'],
  [ROUTES.authorityDashboard]: ['AUTHORITY'],
}

// Whether a role may open a browser path. Paths outside the signed-in table (/, /login,
// unknown paths) are not role pages, so this returns false for them.
export function canOpen(role: Role, pathname: string): boolean {
  // /reports/new must not match /reports/:reportId, so exact paths are checked first.
  const exact = ROUTE_ROLES[pathname]
  if (exact) return exact.includes(role)
  const pattern = Object.keys(ROUTE_ROLES).find((path) => path.includes(':') && matchPath(path, pathname))
  return pattern ? ROUTE_ROLES[pattern].includes(role) : false
}

export function homePathFor(role: Role): string {
  return ROLE_NAV[role].home.to
}

// A menu item is current on its own page and the pages under it (Reports on
// /reports/:reportId), except "Report a problem" (/reports/new), which marks nothing.
export function isNavActive(pathname: string, to: string): boolean {
  if (pathname === ROUTES.newReport) return to === ROUTES.newReport
  return pathname === to || pathname.startsWith(`${to}/`)
}
