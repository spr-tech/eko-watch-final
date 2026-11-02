// The operator's "Today's streets" (Operator.dc.html): their assigned streets that have a
// collection scheduled today, joined with that day's schedule. GET /operators/me/streets
// carries no collection status, so the status comes from GET /collection-schedules.
// Kept pure for tests.

// Keeps the schedule entries for streets the operator is assigned, in the operator's
// street order, and drops any assigned street with no schedule that day.
export function joinTodaysStreets<S extends { streetId: string }, C extends { streetId: string }>(
  assigned: S[],
  schedules: C[],
): { street: S; schedule: C }[] {
  const byStreet = new Map(schedules.map((schedule) => [schedule.streetId, schedule]))
  return assigned.flatMap((street) => {
    const schedule = byStreet.get(street.streetId)
    return schedule ? [{ street, schedule }] : []
  })
}

// "3 of 5 streets done": a street counts as done once a completion is recorded
// (DONE, or DISPUTED, where a resident reported it missed afterwards).
export function countDone(statuses: string[]): number {
  return statuses.filter((status) => status === 'DONE' || status === 'DISPUTED').length
}
