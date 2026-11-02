import { describe, expect, it } from 'vitest'
import { countDone, joinTodaysStreets } from '@/lib/todaysStreets'

describe('joinTodaysStreets', () => {
  it("keeps only assigned streets with a schedule today, in the operator's order", () => {
    const joined = joinTodaysStreets(
      [{ streetId: 'a' }, { streetId: 'b' }, { streetId: 'c' }],
      [{ streetId: 'c' }, { streetId: 'x' }, { streetId: 'a' }],
    )
    expect(joined.map((row) => row.street.streetId)).toEqual(['a', 'c'])
    expect(joined[1].schedule).toEqual({ streetId: 'c' })
  })

  it('is empty when nothing assigned is scheduled', () => {
    expect(joinTodaysStreets([{ streetId: 'a' }], [])).toEqual([])
  })
})

describe('countDone', () => {
  it('counts recorded completions, including disputed ones', () => {
    expect(countDone(['SCHEDULED', 'DONE', 'DISPUTED', 'MISSED'])).toBe(2)
    expect(countDone([])).toBe(0)
  })
})
