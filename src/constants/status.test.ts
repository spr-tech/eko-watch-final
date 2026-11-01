import { describe, expect, it } from 'vitest'
import {
  COLLECTION_STATUS_LABELS,
  FLOOD_STATUS_LABELS,
  REPORT_TYPE_LABELS,
  ROLE_LABELS,
} from '@/constants/status'
import { COLLECTION_STATUSES, FLOOD_STATUSES, REPORT_TYPES, ROLES } from '@/types/ekowatch'

describe('status labels', () => {
  it.each([
    ['Role', ROLES, ROLE_LABELS],
    ['ReportType', REPORT_TYPES, REPORT_TYPE_LABELS],
    ['FloodStatus', FLOOD_STATUSES, FLOOD_STATUS_LABELS],
    ['CollectionStatus', COLLECTION_STATUSES, COLLECTION_STATUS_LABELS],
  ] as const)('gives every %s value a label, and no extra values', (_, values, labels) => {
    for (const value of values) {
      expect((labels as Record<string, string>)[value]?.trim()).toBeTruthy()
    }
    expect(Object.keys(labels).sort()).toEqual([...values].sort())
  })

  it('uses the design wording for report types', () => {
    expect(REPORT_TYPE_LABELS.BLOCKED_DRAIN).toBe('Blocked drain')
    expect(REPORT_TYPE_LABELS.FLOODED_ROAD).toBe('Flooded road')
  })
})
