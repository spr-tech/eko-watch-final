// Browser routes (CLAUDE.md "Routes and pages"). These are not API paths.
export const ROUTES = {
  home: '/',
  login: '/login',
  setup: '/setup',
  collections: '/collections',
  reports: '/reports',
  newReport: '/reports/new',
  reportDetailPattern: '/reports/:reportId',
  reportDetail: (reportId: string) => `/reports/${encodeURIComponent(reportId)}`,
  hazards: '/hazards',
  operatorCollections: '/operator/collections',
  authorityDashboard: '/authority/dashboard',
} as const
