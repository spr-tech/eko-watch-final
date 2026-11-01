// Every route in the app (React Router data mode), from the CLAUDE.md routes table plus
// the landing page at /. Pages load lazily, so each one is its own download.
import type { RouteObject } from 'react-router'
import { AppLayout } from '@/components/layout/AppLayout'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { ROUTES } from '@/constants/routes'

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
        // TODO(slice-1): RequireSession here, and RequireRole around the pages for one role
        // (setup: RESIDENT; collections: RESIDENT, AUTHORITY; reports/new: RESIDENT;
        // operator/collections: OPERATOR; authority/dashboard: AUTHORITY).
        Component: AppLayout,
        children: [
          {
            path: ROUTES.setup,
            lazy: () => import('@/pages/WardSetupPage').then((m) => ({ Component: m.WardSetupPage })),
          },
          {
            path: ROUTES.collections,
            lazy: () =>
              import('@/pages/CollectionSchedulePage').then((m) => ({ Component: m.CollectionSchedulePage })),
          },
          {
            path: ROUTES.reports,
            lazy: () => import('@/pages/ReportListPage').then((m) => ({ Component: m.ReportListPage })),
          },
          {
            path: ROUTES.newReport,
            lazy: () => import('@/pages/CreateReportPage').then((m) => ({ Component: m.CreateReportPage })),
          },
          {
            path: ROUTES.reportDetailPattern,
            lazy: () => import('@/pages/ReportDetailPage').then((m) => ({ Component: m.ReportDetailPage })),
          },
          {
            path: ROUTES.hazards,
            lazy: () => import('@/pages/HazardsPage').then((m) => ({ Component: m.HazardsPage })),
          },
          {
            path: ROUTES.operatorCollections,
            lazy: () =>
              import('@/pages/OperatorCollectionsPage').then((m) => ({ Component: m.OperatorCollectionsPage })),
          },
          {
            path: ROUTES.authorityDashboard,
            lazy: () =>
              import('@/pages/AuthorityDashboardPage').then((m) => ({ Component: m.AuthorityDashboardPage })),
          },
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
