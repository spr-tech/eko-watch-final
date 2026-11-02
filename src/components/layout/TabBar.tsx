// Phone tab bar, stuck to the bottom of the screen. The resident's Report tab is always
// green; the current tab is dark.
import { Link, useLocation } from 'react-router'
import { NavIcon } from '@/components/layout/NavIcons'
import { isNavActive, ROLE_NAV, type NavItem } from '@/constants/roles'
import type { Role } from '@/types/ekowatch'

const base = 'flex flex-1 basis-0 flex-col items-center gap-0.5 rounded-xl py-1.75 text-[13px]'

export function TabBar({ role }: { role: Role }) {
  const { action, items } = ROLE_NAV[role]
  const { pathname } = useLocation()
  // The resident's Report tab sits third, after Reports and Hazards.
  const tabs: (NavItem & { isAction?: boolean })[] = action
    ? [...items.slice(0, 2), { ...action, label: action.tabLabel, isAction: true }, ...items.slice(2)]
    : items

  return (
    <nav aria-label="Main" className="sticky bottom-0 z-10 flex gap-1.5 border-t border-border bg-bg px-2.5 pt-1.5 pb-2.5 md:hidden">
      {tabs.map((tab) => {
        const isActive = isNavActive(pathname, tab.to)
        return (
          <Link
            key={tab.to}
            to={tab.to}
            aria-current={isActive ? 'page' : undefined}
            className={
              tab.isAction
                ? `${base} bg-action font-extrabold text-text`
                : isActive
                  ? `${base} bg-text font-extrabold text-white`
                  : `${base} font-bold text-text`
            }
          >
            <NavIcon name={tab.icon} />
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
