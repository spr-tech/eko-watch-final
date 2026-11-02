// Every route in the app (React Router data mode), from the CLAUDE.md routes table plus
// the landing page at /. Pages load lazily, so each one is its own download.
// Signed-in pages sit behind RequireSession; pages only some roles may open sit behind
// RequireRole, with the roles taken from constants/roles.ts (the same table canOpen uses).
import type { RouteObject } from 'react-router'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { RequireRole } from '@/components/layout/RequireRole'
import { RequireSession } from '@/components/layout/RequireSession'
import { ROUTE_ROLES } from '@/constants/roles'
import { ROUTES } from '@/constants/routes'

type LazyPage = RouteObject['lazy']

// A signed-in page, wrapped in RequireRole unless every role may open it.
function rolePage(path: string, lazy: LazyPage): RouteObject {
  const roles = ROUTE_ROLES[path]
  const page: RouteObject = { path, lazy }
  if (roles.length === 3) return page
  return { element: <RequireRole roles={roles} />, children: [page] }
}

export const routes: RouteObject[] = [
  {
    // Shown while the first page's code downloads.
    hydrateFallbackElement: <div className="min-h-dvh bg-surface" />,
    children: [
      {
        Component: PublicLayout,
        children: [
          {
            index: true,
            lazy: () => import('@/pages/LandingPage').then((m) => ({ Component: m.LandingPage })),
          },
          {
            path: ROUTES.login,
            lazy: () => import('@/pages/LoginPage').then((m) => ({ Component: m.LoginPage })),
          },
        ],
      },
      {
        Component: RequireSession,
        children: [
          rolePage(ROUTES.setup, () =>
            import('@/pages/WardSetupPage').then((m) => ({ Component: m.WardSetupPage })),
          ),
          rolePage(ROUTES.collections, () =>
            import('@/pages/CollectionSchedulePage').then((m) => ({ Component: m.CollectionSchedulePage })),
          ),
          rolePage(ROUTES.reports, () =>
            import('@/pages/ReportListPage').then((m) => ({ Component: m.ReportListPage })),
          ),
          rolePage(ROUTES.newReport, () =>
            import('@/pages/CreateReportPage').then((m) => ({ Component: m.CreateReportPage })),
          ),
          rolePage(ROUTES.reportDetailPattern, () =>
            import('@/pages/ReportDetailPage').then((m) => ({ Component: m.ReportDetailPage })),
          ),
          rolePage(ROUTES.hazards, () => import('@/pages/HazardsPage').then((m) => ({ Component: m.HazardsPage }))),
          rolePage(ROUTES.operatorCollections, () =>
            import('@/pages/OperatorCollectionsPage').then((m) => ({ Component: m.OperatorCollectionsPage })),
          ),
          rolePage(ROUTES.authorityDashboard, () =>
            import('@/pages/AuthorityDashboardPage').then((m) => ({ Component: m.AuthorityDashboardPage })),
          ),
        ],
      },
      {
        Component: PublicLayout,
        children: [
          {
            path: '*',
            lazy: () => import('@/pages/NotFoundPage').then((m) => ({ Component: m.NotFoundPage })),
          },
        ],
      },
    ],
  },
]
