// The menu for each role, from the design's sidebar and phone tab bar, with operators
// also getting Reports (docs/design/README.md, correction 6).
// TODO(prompt-02): move to constants/roles.ts and use it for the route guards too.
import type { NavIconName } from '@/components/layout/NavIcons'
import { ROUTES } from '@/constants/routes'
import type { Role } from '@/types/ekowatch'

export type NavItem = { label: string; to: string; icon: NavIconName }

type RoleNav = {
  // The green "Report a problem" action, residents only. On the phone it is the
  // third tab, labelled with tabLabel.
  action?: NavItem & { tabLabel: string }
  items: NavItem[]
}

const reports: NavItem = { label: 'Reports', to: ROUTES.reports, icon: 'reports' }
const hazards: NavItem = { label: 'Hazards', to: ROUTES.hazards, icon: 'hazards' }

// A menu item is current on its own page and the pages under it (Reports on
// /reports/:reportId), except "Report a problem" (/reports/new), which marks nothing.
export function isNavActive(pathname: string, to: string): boolean {
  if (pathname === ROUTES.newReport) return to === ROUTES.newReport
  return pathname === to || pathname.startsWith(`${to}/`)
}

export const NAV: Record<Role, RoleNav> = {
  RESIDENT: {
    action: { label: 'Report a problem', tabLabel: 'Report', to: ROUTES.newReport, icon: 'plus' },
    items: [reports, hazards, { label: 'My street', to: ROUTES.collections, icon: 'street' }],
  },
  OPERATOR: {
    items: [{ label: "Today's streets", to: ROUTES.operatorCollections, icon: 'streets' }, reports, hazards],
  },
  AUTHORITY: {
    items: [{ label: 'Dashboard', to: ROUTES.authorityDashboard, icon: 'dashboard' }, reports, hazards],
  },
}
