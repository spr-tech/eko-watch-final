// Shared EkoWatch types. Names and values match docs/build.pdf sections 4 and 8 and
// CLAUDE.md exactly. Field names, enums and formats were checked against openapi.json
// (saved from the deployed backend on 2026-11-02) and against real responses.
//
// The OpenAPI document marks no field required or nullable, so nullability here comes
// from the build plan and from what the live backend actually returned. Nullable
// response fields are always present with null: typed `T | null`, never optional.

export const ROLES = ['RESIDENT', 'OPERATOR', 'AUTHORITY'] as const
export const REPORT_TYPES = ['MISSED_PICKUP', 'ILLEGAL_DUMPING', 'BLOCKED_DRAIN', 'FLOODED_ROAD'] as const
export const FLOOD_STATUSES = ['CURRENT', 'EXPIRED'] as const
export const COLLECTION_STATUSES = ['SCHEDULED', 'DONE', 'MISSED', 'DISPUTED'] as const

export type Role = 'RESIDENT' | 'OPERATOR' | 'AUTHORITY';
export type ReportType = 'MISSED_PICKUP' | 'ILLEGAL_DUMPING' | 'BLOCKED_DRAIN' | 'FLOODED_ROAD';
export type FloodStatus = 'CURRENT' | 'EXPIRED';
export type CollectionStatus = 'SCHEDULED' | 'DONE' | 'MISSED' | 'DISPUTED';

// ISO 8601 UTC instant set by the server, e.g. "2026-10-31T10:00:00Z".
export type Instant = string
// Calendar day in Africa/Lagos, "YYYY-MM-DD".
export type LocalDate = string
export type Uuid = string

// A street's map point. Street-level only: never a reporter's own position.
export type Location = { latitude: number; longitude: number }

// One page of a list. `page` is zero-based.
export type Page<T> = {
  items: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

// --- Auth and user ---

export type CreateSessionRequest = { email: string; password: string }

export type CurrentUserView = {
  userId: Uuid
  email: string
  displayName: string
  role: Role
  // null until a resident chooses a street; null for operators and the ward office
  // in the demo seeds.
  wardId: Uuid | null
  streetId: Uuid | null
}

// The POST /auth/sessions response.
export type SessionView = {
  accessToken: string
  tokenType: 'Bearer'
  expiresAt: Instant
  user: CurrentUserView
}

export type UpdatePreferencesRequest = { wardId: Uuid; streetId: Uuid }

// --- Places ---

// The deployed backend says wardName and streetName, not the build plan's name
// (docs/decisions.md, contract differences).
export type WardView = { wardId: Uuid; wardName: string }

export type StreetView = {
  streetId: Uuid
  wardId: Uuid
  streetName: string
  mapLocation: Location | null
}

// --- Photos and reports ---

export type PhotoView = {
  photoId: Uuid
  photoUrl: string
  contentType: string
  sizeBytes: number
  createdAt: Instant
}

export type CreateReportRequest = {
  reportType: ReportType
  streetId: Uuid
  note: string
  // From POST /photos; reused unchanged on a retry.
  photoId?: Uuid
  location?: Location
  // Only for MISSED_PICKUP.
  collectionDate?: LocalDate
}

// Never carries reporter identity or precise coordinates; mapLocation is the street's
// point (locationPrecision is always 'STREET').
export type ReportView = {
  reportId: Uuid
  reportType: ReportType
  wardId: Uuid
  streetId: Uuid
  streetName: string
  // TODO(contract): is note ever null? Required on create, so treated as possibly null here.
  note: string | null
  photoUrl: string | null
  createdAt: Instant
  collectionDate: LocalDate | null
  confirmationCount: number
  confirmedByMe: boolean
  lastEvidenceAt: Instant
  // Only for FLOODED_ROAD; null otherwise.
  floodStatus: FloodStatus | null
  expiresAt: Instant | null
  mapLocation: Location | null
  locationPrecision: 'STREET'
}

// --- Collections ---

export type CollectionScheduleView = {
  scheduleId: Uuid
  wardId: Uuid
  streetId: Uuid
  streetName: string
  collectionDate: LocalDate
  collectionStatus: CollectionStatus
  completedAt: Instant | null
  missedReportCount: number
}

// The PUT /streets/{streetId}/collections/{collectionDate} response.
export type CollectionView = {
  collectionId: Uuid
  streetId: Uuid
  collectionDate: LocalDate
  completedAt: Instant | null
  collectionStatus: CollectionStatus
}

// --- Ward views ---

export type WardHazardsView = {
  wardId: Uuid
  generatedAt: Instant
  newestReportAt: Instant | null
  items: ReportView[]
}

export type OperatorPerformanceView = {
  operatorId: Uuid
  // Fictional demo names.
  operatorName: string
  scheduledPickupCount: number
  completedPickupCount: number
  missedPickupCount: number
  disputedPickupCount: number
}

export type WardDashboardView = {
  wardId: Uuid
  fromDate: LocalDate
  toDate: LocalDate
  generatedAt: Instant
  missedPickupCount: number
  disputedPickupCount: number
  // Blocked-drain reports, not "unresolved drains".
  blockedDrainCount: number
  // Current flood reports, not roads.
  currentFloodCount: number
  newestReportAt: Instant | null
  operatorPerformance: OperatorPerformanceView[]
}
