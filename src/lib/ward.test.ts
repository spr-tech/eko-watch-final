import { describe, expect, it } from 'vitest'
import { pickWard } from '@/lib/ward'

const none = { wardIds: [], assignedWardIds: [], requested: null }

describe('pickWard', () => {
  it("uses the user's own ward whatever the role", () => {
    expect(pickWard({ ...none, role: 'AUTHORITY', ownWardId: 'w1', wardIds: ['w2'] })).toEqual({
      kind: 'ready',
      wardId: 'w1',
    })
  })

  it('asks a resident with no ward to choose a street', () => {
    expect(pickWard({ ...none, role: 'RESIDENT', ownWardId: null })).toEqual({ kind: 'none', reason: 'no-street' })
  })

  it("gives an operator the ward of their assigned streets, or none when they have none", () => {
    expect(pickWard({ ...none, role: 'OPERATOR', ownWardId: null, assignedWardIds: ['w3', 'w3'] })).toEqual({
      kind: 'ready',
      wardId: 'w3',
    })
    expect(pickWard({ ...none, role: 'OPERATOR', ownWardId: null })).toEqual({ kind: 'none', reason: 'not-assigned' })
  })

  it('gives the ward office the only ward, or asks it to choose between several', () => {
    expect(pickWard({ ...none, role: 'AUTHORITY', ownWardId: null, wardIds: ['w1'] })).toEqual({
      kind: 'ready',
      wardId: 'w1',
    })
    expect(pickWard({ ...none, role: 'AUTHORITY', ownWardId: null, wardIds: ['w1', 'w2'] })).toEqual({ kind: 'choose' })
    expect(pickWard({ role: 'AUTHORITY', ownWardId: null, wardIds: ['w1', 'w2'], assignedWardIds: [], requested: 'w2' })).toEqual({
      kind: 'ready',
      wardId: 'w2',
    })
    expect(pickWard({ ...none, role: 'AUTHORITY', ownWardId: null })).toEqual({ kind: 'none', reason: 'no-ward' })
  })

  it('ignores a requested ward that is not in the list', () => {
    expect(pickWard({ role: 'AUTHORITY', ownWardId: null, wardIds: ['w1', 'w2'], assignedWardIds: [], requested: 'w9' })).toEqual({
      kind: 'choose',
    })
  })
})
