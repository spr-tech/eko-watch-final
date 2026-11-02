// The ward a signed-in screen shows, and its name from GET /wards (never a guess: null
// until it loads). The rule is pickWard in lib/ward.ts.
import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { useSearchParams } from 'react-router'
import { selectCurrentUser } from '@/app/sessionSlice'
import { useAppSelector } from '@/hooks/useAppStore'
import { pickWard, type WardPick } from '@/lib/ward'
import { useListMyAssignedStreetsQuery } from '@/services/operatorApi'
import { useListWardsQuery } from '@/services/wardApi'
import type { WardView } from '@/types/ekowatch'

// The address parameter naming the ward, when the ward office has several to choose from.
export const WARD_PARAM = 'ward'

export type WardState =
  | { status: 'loading' }
  | { status: 'error'; error: FetchBaseQueryError | SerializedError | undefined; retry: () => void }
  | (WardPick & { status: 'picked'; wards: WardView[]; wardName: string | null })

export function useWard(): WardState {
  const user = useAppSelector(selectCurrentUser)
  const [params] = useSearchParams()
  const ownWardId = user?.wardId ?? null
  const wards = useListWardsQuery(undefined, { skip: !user })
  const needsStreets = user?.role === 'OPERATOR' && !ownWardId
  const streets = useListMyAssignedStreetsQuery({}, { skip: !needsStreets })

  if (!user) return { status: 'loading' }
  // The ward office needs the ward list to pick from; everyone else only for the name.
  const needsWards = user.role === 'AUTHORITY' && !ownWardId
  const source = needsStreets ? streets : needsWards ? wards : null
  if (source?.isError) return { status: 'error', error: source.error, retry: () => void source.refetch() }
  if (source && !source.data) return { status: 'loading' }

  const pick = pickWard({
    role: user.role,
    ownWardId,
    wardIds: wards.data?.map((ward) => ward.wardId) ?? [],
    assignedWardIds: streets.data?.map((street) => street.wardId) ?? [],
    requested: params.get(WARD_PARAM),
  })
  const wardName =
    pick.kind === 'ready' ? (wards.data?.find((ward) => ward.wardId === pick.wardId)?.wardName ?? null) : null
  return { ...pick, status: 'picked', wards: wards.data ?? [], wardName }
}
