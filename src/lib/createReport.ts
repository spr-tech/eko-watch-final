// Turning the Report a problem form into a CreateReportRequest, and the choices the form
// offers. Kept pure for tests.
import type { CreateReportRequest, ReportType } from '@/types/ekowatch'

export type CreateReportFormValues = {
  reportType: ReportType | ''
  streetId: string
  note: string
  collectionDate: string
  photo: File | null
}

export const createReportInitialValues = (streetId: string | null): CreateReportFormValues => ({
  reportType: '',
  streetId: streetId ?? '',
  note: '',
  collectionDate: '',
  photo: null,
})

// The request body: the note trimmed, collectionDate only for a missed pickup, photoId
// only when a photo was uploaded. Call only with values that passed the schema.
export function buildCreateReportRequest(
  values: Omit<CreateReportFormValues, 'photo'> & { reportType: ReportType },
  photoId: string | null,
): CreateReportRequest {
  const body: CreateReportRequest = { reportType: values.reportType, streetId: values.streetId, note: values.note.trim() }
  if (values.reportType === 'MISSED_PICKUP') body.collectionDate = values.collectionDate
  if (photoId) body.photoId = photoId
  return body
}

// The collection days a missed pickup can be reported for: scheduled days up to today
// (Lagos), newest first. Dates are YYYY-MM-DD, so they compare as strings.
export function pastCollectionDays(dates: string[], today: string): string[] {
  return [...new Set(dates.filter((date) => date <= today))].sort().reverse()
}

// How far back the collection-day list goes (the schedule query allows 31 days).
export const COLLECTION_DAYS_BACK = 30

// Server field names that differ from the form's: the photo field is uploaded first.
export function toFormField(field: string): string {
  return field === 'photoId' ? 'photo' : field
}
