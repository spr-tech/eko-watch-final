// On-screen label for every enum value, with the wording from the design files.
// Statuses are always shown as text as well as colour.
import type { CollectionStatus, FloodStatus, ReportType, Role } from '@/types/ekowatch'

export const ROLE_LABELS: Record<Role, string> = {
  RESIDENT: 'Resident',
  OPERATOR: 'Operator',
  AUTHORITY: 'Authority',
}

export const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  MISSED_PICKUP: 'Missed pickup',
  ILLEGAL_DUMPING: 'Illegal dumping',
  BLOCKED_DRAIN: 'Blocked drain',
  FLOODED_ROAD: 'Flooded road',
}

export const FLOOD_STATUS_LABELS: Record<FloodStatus, string> = {
  CURRENT: 'Current',
  EXPIRED: 'Expired',
}

export const COLLECTION_STATUS_LABELS: Record<CollectionStatus, string> = {
  SCHEDULED: 'Scheduled',
  DONE: 'Done',
  MISSED: 'Missed',
  DISPUTED: 'Disputed',
}
