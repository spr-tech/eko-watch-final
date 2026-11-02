import { describe, expect, it } from 'vitest'
import { buildCreateReportRequest, createReportInitialValues, pastCollectionDays, toFormField } from '@/lib/createReport'

const base = { streetId: 's1', note: '  Water across the road.  ', collectionDate: '' }

describe('buildCreateReportRequest', () => {
  it('trims the note and sends no optional fields that were not given', () => {
    expect(buildCreateReportRequest({ ...base, reportType: 'BLOCKED_DRAIN' }, null)).toEqual({
      reportType: 'BLOCKED_DRAIN',
      streetId: 's1',
      note: 'Water across the road.',
    })
  })

  it('sends collectionDate only for a missed pickup', () => {
    expect(buildCreateReportRequest({ ...base, reportType: 'MISSED_PICKUP', collectionDate: '2026-10-30' }, null)).toMatchObject({
      collectionDate: '2026-10-30',
    })
    expect(
      buildCreateReportRequest({ ...base, reportType: 'FLOODED_ROAD', collectionDate: '2026-10-30' }, null),
    ).not.toHaveProperty('collectionDate')
  })

  it('carries the uploaded photoId', () => {
    expect(buildCreateReportRequest({ ...base, reportType: 'ILLEGAL_DUMPING' }, 'p1')).toMatchObject({ photoId: 'p1' })
  })
})

describe('createReportInitialValues', () => {
  it("starts on the resident's own street when they have one", () => {
    expect(createReportInitialValues('s9').streetId).toBe('s9')
    expect(createReportInitialValues(null).streetId).toBe('')
  })
})

describe('pastCollectionDays', () => {
  it('keeps days up to today, newest first, once each', () => {
    expect(pastCollectionDays(['2026-10-30', '2026-11-03', '2026-11-02', '2026-10-30'], '2026-11-02')).toEqual([
      '2026-11-02',
      '2026-10-30',
    ])
  })
})

describe('toFormField', () => {
  it('shows a photoId error on the photo field', () => {
    expect(toFormField('photoId')).toBe('photo')
    expect(toFormField('note')).toBe('note')
  })
})
