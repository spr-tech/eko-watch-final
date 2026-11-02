import { describe, expect, it } from 'vitest'
import { canOpen, homePathFor, isNavActive, ROLE_NAV, ROUTE_ROLES } from '@/constants/roles'
import { ROUTES } from '@/constants/routes'
import { ROLES } from '@/types/ekowatch'

describe('menus', () => {
  it('match the agreed items for each role', () => {
    const labels = (role: (typeof ROLES)[number]) => ROLE_NAV[role].items.map((item) => item.label)
    expect(labels('RESIDENT')).toEqual(['Reports', 'Hazards', 'My street'])
    expect(ROLE_NAV.RESIDENT.action?.label).toBe('Report a problem')
    expect(labels('OPERATOR')).toEqual(["Today's streets", 'Reports', 'Hazards'])
    expect(labels('AUTHORITY')).toEqual(['Dashboard', 'Reports', 'Hazards'])
  })

  it('only gives residents the Report a problem action', () => {
    expect(ROLE_NAV.OPERATOR.action).toBeUndefined()
    expect(ROLE_NAV.AUTHORITY.action).toBeUndefined()
  })

  it('never shows a menu item the role cannot open', () => {
    for (const role of ROLES) {
      const { home, action, items } = ROLE_NAV[role]
      for (const item of [home, ...items, ...(action ? [action] : [])]) {
        expect(canOpen(role, item.to), `${role} → ${item.to}`).toBe(true)
      }
    }
  })
})

describe('canOpen', () => {
  it('follows the CLAUDE.md routes table', () => {
    expect(canOpen('RESIDENT', ROUTES.setup)).toBe(true)
    expect(canOpen('OPERATOR', ROUTES.setup)).toBe(false)
    expect(canOpen('AUTHORITY', ROUTES.collections)).toBe(true)
    expect(canOpen('OPERATOR', ROUTES.collections)).toBe(false)
    expect(canOpen('OPERATOR', ROUTES.operatorCollections)).toBe(true)
    expect(canOpen('RESIDENT', ROUTES.authorityDashboard)).toBe(false)
    expect(canOpen('AUTHORITY', ROUTES.authorityDashboard)).toBe(true)
  })

  it('lets every role read reports and hazards, but only residents create', () => {
    for (const role of ROLES) {
      expect(canOpen(role, ROUTES.reports)).toBe(true)
      expect(canOpen(role, ROUTES.reportDetail('3f1c2a9e-0000-4000-8000-000000000000'))).toBe(true)
      expect(canOpen(role, ROUTES.hazards)).toBe(true)
    }
    expect(canOpen('RESIDENT', ROUTES.newReport)).toBe(true)
    expect(canOpen('OPERATOR', ROUTES.newReport)).toBe(false)
    expect(canOpen('AUTHORITY', ROUTES.newReport)).toBe(false)
  })

  it('is false for paths that are not role pages', () => {
    expect(canOpen('RESIDENT', ROUTES.login)).toBe(false)
    expect(canOpen('RESIDENT', '/nowhere')).toBe(false)
  })

  it('covers every route in the table', () => {
    expect(Object.keys(ROUTE_ROLES)).toHaveLength(8)
  })
})

describe('homePathFor', () => {
  it('sends each role to its own first page', () => {
    expect(homePathFor('RESIDENT')).toBe(ROUTES.reports)
    expect(homePathFor('OPERATOR')).toBe(ROUTES.operatorCollections)
    expect(homePathFor('AUTHORITY')).toBe(ROUTES.authorityDashboard)
  })
})

describe('isNavActive', () => {
  it('marks Reports on the list and on a report, but nothing on /reports/new except the action', () => {
    expect(isNavActive('/reports', ROUTES.reports)).toBe(true)
    expect(isNavActive('/reports/abc', ROUTES.reports)).toBe(true)
    expect(isNavActive('/reports/new', ROUTES.reports)).toBe(false)
    expect(isNavActive('/reports/new', ROUTES.newReport)).toBe(true)
    expect(isNavActive('/hazards', ROUTES.reports)).toBe(false)
  })
})
