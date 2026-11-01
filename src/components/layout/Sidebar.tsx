// Desktop sidebar: logo, the resident's "Report a problem" action, and the role's menu.
// Hidden on phones, where the top bar and tab bar take over.
import { Link, useLocation } from 'react-router'
import logoOnDark from '@/assets/ekowatch-logo-horizontal-on-dark.svg'
import { NavIcon } from '@/components/layout/NavIcons'
import { isNavActive, NAV } from '@/components/layout/navItems'
import { ROUTES } from '@/constants/routes'
import type { Role } from '@/types/ekowatch'

export function Sidebar({ role }: { role: Role }) {
  const { action, items } = NAV[role]
  const { pathname } = useLocation()
  return (
    <aside className="on-dark hidden w-58 flex-none flex-col gap-4.5 bg-sidebar px-3.5 py-4.5 text-on-sidebar md:flex">
      <Link to={ROUTES.home} aria-label="EkoWatch home" className="self-start rounded-sm px-1">
        <img src={logoOnDark} alt="" className="h-8 w-auto" />
      </Link>
      {action && (
        <Link
          to={action.to}
          className="flex min-h-11.5 w-full items-center justify-center gap-2 rounded-md bg-action px-5 text-base font-extrabold text-text hover:bg-action-hover"
        >
          <NavIcon name={action.icon} />
          {action.label}
        </Link>
      )}
      <nav aria-label="Main">
        <ul className="flex flex-col gap-1">
          {items.map((item) => {
            const isActive = isNavActive(pathname, item.to)
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  aria-current={isActive ? 'page' : undefined}
                  className={
                    isActive
                      ? 'flex min-h-11 items-center gap-3 rounded-md bg-surface px-3 font-extrabold text-text'
                      : 'flex min-h-11 items-center gap-3 rounded-md px-3 font-bold text-on-sidebar hover:bg-white/14'
                  }
                >
                  <NavIcon name={item.icon} />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
