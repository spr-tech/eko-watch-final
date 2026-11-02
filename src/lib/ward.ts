// Which ward a signed-in screen shows (docs/decisions.md 2026-11-02, "Ward office and
// operators get their ward from the data"). The user's own wardId always wins. Without
// one: a resident has to choose a street first; an operator uses the ward of their
// assigned streets; the ward office uses the one ward from GET /wards, or the ward named
// in the address when there are several.
import type { Role } from '@/types/ekowatch'

export type WardPick =
  | { kind: 'ready'; wardId: string }
  | { kind: 'choose' }
  | { kind: 'none'; reason: 'no-street' | 'not-assigned' | 'no-ward' }

type PickWardInput = {
  role: Role
  ownWardId: string | null
  // Every ward from GET /wards (the ward office only).
  wardIds: string[]
  // The wardId of each assigned street (operators only).
  assignedWardIds: string[]
  // The ward chosen in the address (?ward=), if any.
  requested: string | null
}

export function pickWard({ role, ownWardId, wardIds, assignedWardIds, requested }: PickWardInput): WardPick {
  if (ownWardId) return { kind: 'ready', wardId: ownWardId }
  if (role === 'RESIDENT') return { kind: 'none', reason: 'no-street' }
  if (role === 'OPERATOR') {
    const [first] = assignedWardIds
    return first ? { kind: 'ready', wardId: first } : { kind: 'none', reason: 'not-assigned' }
  }
  if (wardIds.length === 0) return { kind: 'none', reason: 'no-ward' }
  if (wardIds.length === 1) return { kind: 'ready', wardId: wardIds[0] }
  return requested && wardIds.includes(requested) ? { kind: 'ready', wardId: requested } : { kind: 'choose' }
}
