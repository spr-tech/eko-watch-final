// Shared EkoWatch types. Names and values match docs/build.pdf section 4 and CLAUDE.md
// exactly. View types are added slice by slice from openapi.json.

export const ROLES = ['RESIDENT', 'OPERATOR', 'AUTHORITY'] as const
export const REPORT_TYPES = ['MISSED_PICKUP', 'ILLEGAL_DUMPING', 'BLOCKED_DRAIN', 'FLOODED_ROAD'] as const
export const FLOOD_STATUSES = ['CURRENT', 'EXPIRED'] as const
export const COLLECTION_STATUSES = ['SCHEDULED', 'DONE', 'MISSED', 'DISPUTED'] as const

export type Role = 'RESIDENT' | 'OPERATOR' | 'AUTHORITY';
export type ReportType = 'MISSED_PICKUP' | 'ILLEGAL_DUMPING' | 'BLOCKED_DRAIN' | 'FLOODED_ROAD';
export type FloodStatus = 'CURRENT' | 'EXPIRED';
export type CollectionStatus = 'SCHEDULED' | 'DONE' | 'MISSED' | 'DISPUTED';

// TODO(contract): check against openapi.json in slice 1.
export type CurrentUserView = {
  userId: string
  email: string
  displayName: string
  role: Role
  wardId: string | null
  streetId: string | null
}

// The POST /auth/sessions response.
// TODO(contract): check against openapi.json in slice 1.
export type SessionView = {
  accessToken: string
  tokenType: 'Bearer'
  expiresAt: string
  user: CurrentUserView
}
