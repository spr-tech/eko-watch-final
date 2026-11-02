// Create-report form, matching CreateReportRequest (build plan section 8): reportType,
// streetId and note required; collectionDate only for a missed pickup; photo optional,
// checked before upload by type and size (the server checks again: 413 and 415).
import * as Yup from 'yup'
import { REPORT_TYPES, type ReportType } from '@/types/ekowatch'

export const NOTE_MAX_LENGTH = 1000
export const PHOTO_MAX_BYTES = 5 * 1024 * 1024 // 5 MiB
export const PHOTO_TYPES = ['image/jpeg', 'image/png'] as const

export const createReportSchema = Yup.object({
  reportType: Yup.mixed<ReportType>()
    .oneOf([...REPORT_TYPES], 'Choose what you are reporting')
    .required('Choose what you are reporting'),
  streetId: Yup.string().required('Choose the street'),
  note: Yup.string()
    .trim()
    .required('Add a short note about what you saw')
    .max(NOTE_MAX_LENGTH, `Keep the note to ${NOTE_MAX_LENGTH} characters or fewer`),
  collectionDate: Yup.string().when('reportType', {
    is: 'MISSED_PICKUP',
    then: (schema) =>
      schema
        .required('Choose the collection day that was missed')
        .matches(/^\d{4}-\d{2}-\d{2}$/, 'Choose the collection day that was missed'),
    otherwise: (schema) =>
      schema.test('absent', 'Only add a collection date for a missed pickup', (value) => !value),
  }),
  photo: Yup.mixed<File>()
    .nullable()
    .test('type', 'Choose a JPEG or PNG photo', (file) => !file || (PHOTO_TYPES as readonly string[]).includes(file.type))
    .test('size', 'Choose a photo under 5 MB', (file) => !file || file.size <= PHOTO_MAX_BYTES),
})

export type CreateReportValues = Yup.InferType<typeof createReportSchema>
