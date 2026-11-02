// Literal form values only; no fabricated API responses.
import { describe, expect, it } from 'vitest'
import type { AnyObjectSchema } from 'yup'
import { createReportSchema, NOTE_MAX_LENGTH, PHOTO_MAX_BYTES } from '@/schema/createReport'
import { signInSchema } from '@/schema/signIn'
import { wardSetupSchema } from '@/schema/wardSetup'

// The error for each field, or {} when the values are valid.
async function errors(schema: AnyObjectSchema, values: Record<string, unknown>) {
  try {
    await schema.validate(values, { abortEarly: false })
    return {}
  } catch (error) {
    const result: Record<string, string> = {}
    for (const inner of (error as { inner: { path: string; message: string }[] }).inner) {
      result[inner.path] ??= inner.message
    }
    return result
  }
}

describe('signInSchema', () => {
  it('requires both fields, with the design wording', async () => {
    expect(await errors(signInSchema, { email: '', password: '' })).toEqual({
      email: 'Enter your email address, like name@example.com',
      password: 'Enter your password',
    })
  })

  it('rejects an email that is not one', async () => {
    expect((await errors(signInSchema, { email: 'ada', password: 'x' })).email).toBe(
      'Enter an email address like name@example.com',
    )
  })

  it('accepts a valid email with spaces around it', async () => {
    expect(await errors(signInSchema, { email: ' ada@example.com ', password: 'x' })).toEqual({})
  })
})

const photo = (type: string, size: number) => new File([new Uint8Array(size)], 'photo', { type })

describe('createReportSchema', () => {
  const valid = { reportType: 'BLOCKED_DRAIN', streetId: 'street-id', note: 'Drain is blocked.' }

  it('accepts a report without a photo or collection date', async () => {
    expect(await errors(createReportSchema, valid)).toEqual({})
  })

  it('requires reportType, streetId and note', async () => {
    const result = await errors(createReportSchema, { note: '' })
    expect(Object.keys(result).sort()).toEqual(['note', 'reportType', 'streetId'])
  })

  it('only accepts the four report types', async () => {
    expect((await errors(createReportSchema, { ...valid, reportType: 'POTHOLE' })).reportType).toBeTruthy()
  })

  it('trims the note and allows 1 to 1000 characters', async () => {
    expect((await errors(createReportSchema, { ...valid, note: '   ' })).note).toBeTruthy()
    expect(await errors(createReportSchema, { ...valid, note: 'x' })).toEqual({})
    expect(await errors(createReportSchema, { ...valid, note: 'x'.repeat(NOTE_MAX_LENGTH) })).toEqual({})
    expect((await errors(createReportSchema, { ...valid, note: 'x'.repeat(NOTE_MAX_LENGTH + 1) })).note).toBeTruthy()
  })

  it('requires a collection date for a missed pickup', async () => {
    const missed = { ...valid, reportType: 'MISSED_PICKUP' }
    expect((await errors(createReportSchema, missed)).collectionDate).toBe('Choose the collection day that was missed')
    expect(await errors(createReportSchema, { ...missed, collectionDate: '2026-10-28' })).toEqual({})
  })

  it('rejects a collection date on any other report type', async () => {
    expect((await errors(createReportSchema, { ...valid, collectionDate: '2026-10-28' })).collectionDate).toBe(
      'Only add a collection date for a missed pickup',
    )
  })

  it('accepts a JPEG or PNG photo up to 5 MiB', async () => {
    expect(await errors(createReportSchema, { ...valid, photo: photo('image/jpeg', 1000) })).toEqual({})
    expect(await errors(createReportSchema, { ...valid, photo: photo('image/png', PHOTO_MAX_BYTES) })).toEqual({})
  })

  it('rejects other photo types and photos over 5 MiB', async () => {
    expect((await errors(createReportSchema, { ...valid, photo: photo('image/gif', 1000) })).photo).toBe(
      'Choose a JPEG or PNG photo',
    )
    expect((await errors(createReportSchema, { ...valid, photo: photo('image/jpeg', PHOTO_MAX_BYTES + 1) })).photo).toBe(
      'Choose a photo under 5 MB',
    )
  })
})

describe('wardSetupSchema', () => {
  it('requires a ward and a street', async () => {
    expect(Object.keys(await errors(wardSetupSchema, {})).sort()).toEqual(['streetId', 'wardId'])
    expect(await errors(wardSetupSchema, { wardId: 'w', streetId: 's' })).toEqual({})
  })
})
