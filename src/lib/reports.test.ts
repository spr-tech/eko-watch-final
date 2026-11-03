import { describe, expect, it } from 'vitest'
import { confirmationWord, parsePage, parseReportFilter, parseReportSort, reportListArgs } from '@/lib/reports'
import { checkEnum, UnexpectedReplyError } from '@/services/checkReply'
import { REPORT_TYPES } from '@/types/ekowatch'

describe('parseReportSort', () => {
  it('is newest first unless the address asks for most confirmed', () => {
    expect(parseReportSort(null)).toBe('NEWEST')
    expect(parseReportSort('confirmed')).toBe('CONFIRMATIONS')
    expect(parseReportSort('CONFIRMATIONS')).toBe('NEWEST')
  })
})

describe('reportListArgs', () => {
  it('asks for the whole ward in the chosen order, 20 at a time', () => {
    expect(reportListArgs('w1', 'ALL', false, 'NEWEST', 0)).toEqual({ wardId: 'w1', sort: 'NEWEST', page: 0, size: 20 })
    expect(reportListArgs('w1', 'ALL', false, 'CONFIRMATIONS', 0)).toMatchObject({ sort: 'CONFIRMATIONS' })
  })

  it('sends one report type for a chip', () => {
    expect(reportListArgs('w1', 'BLOCKED_DRAIN', false, 'NEWEST', 2)).toMatchObject({ reportType: 'BLOCKED_DRAIN', page: 2 })
    expect(reportListArgs('w1', 'BLOCKED_DRAIN', false, 'NEWEST', 0)).not.toHaveProperty('floodStatus')
  })

  it('only sends floodStatus together with reportType=FLOODED_ROAD', () => {
    expect(reportListArgs('w1', 'ALL', true, 'NEWEST', 0)).toMatchObject({ reportType: 'FLOODED_ROAD', floodStatus: 'CURRENT' })
    expect(reportListArgs('w1', 'MISSED_PICKUP', true, 'NEWEST', 0)).toMatchObject({ reportType: 'FLOODED_ROAD', floodStatus: 'CURRENT' })
  })
})

describe('reading the address', () => {
  it('falls back to All for an unknown filter', () => {
    expect(parseReportFilter('FLOODED_ROAD')).toBe('FLOODED_ROAD')
    expect(parseReportFilter('CATEGORY')).toBe('ALL')
    expect(parseReportFilter(null)).toBe('ALL')
  })

  it('counts pages from 1 in the address and from 0 for the service', () => {
    expect(parsePage('2')).toBe(1)
    expect(parsePage(null)).toBe(0)
    expect(parsePage('0')).toBe(0)
    expect(parsePage('-3')).toBe(0)
    expect(parsePage('1.5')).toBe(0)
  })
})

describe('confirmationWord', () => {
  it('is singular only for one', () => {
    expect(confirmationWord(0)).toBe('confirmations')
    expect(confirmationWord(1)).toBe('confirmation')
    expect(confirmationWord(6)).toBe('confirmations')
  })
})

describe('checkEnum', () => {
  it('accepts known values and null where allowed', () => {
    expect(() => checkEnum('reportType', 'FLOODED_ROAD', REPORT_TYPES)).not.toThrow()
    expect(() => checkEnum('floodStatus', null, ['CURRENT', 'EXPIRED'], true)).not.toThrow()
  })

  it('reports an unknown value instead of guessing', () => {
    expect(() => checkEnum('reportType', 'POTHOLE', REPORT_TYPES)).toThrow(UnexpectedReplyError)
    expect(() => checkEnum('floodStatus', null, ['CURRENT', 'EXPIRED'])).toThrow(UnexpectedReplyError)
  })
})
