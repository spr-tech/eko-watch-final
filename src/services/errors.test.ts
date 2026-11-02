// Literal statuses and codes only; no fabricated API responses.
import { describe, expect, it } from 'vitest'
import { describeError } from '@/services/errors'

describe('describeError by status', () => {
  it.each([
    [400, 'validation'],
    [401, 'session-ended'],
    [403, 'forbidden'],
    [404, 'not-found'],
    [409, 'conflict'],
    [413, 'photo-too-large'],
    [415, 'photo-type'],
    [500, 'server'],
    [503, 'server'],
  ] as const)('maps %s to %s', (status, kind) => {
    expect(describeError({ status }).kind).toBe(kind)
  })

  it('maps no connection and timeouts to a network message', () => {
    expect(describeError({ status: 'FETCH_ERROR' }).kind).toBe('network')
    expect(describeError({ status: 'TIMEOUT_ERROR' }).kind).toBe('network')
    expect(describeError({ status: 'FETCH_ERROR' })).toMatchObject({
      title: "Can't reach EkoWatch right now.",
      detail: 'Check your connection, then try again.',
    })
  })

  it('falls back to a server message for anything else', () => {
    expect(describeError({ status: 'PARSING_ERROR' }).kind).toBe('server')
    expect(describeError({ status: 418 }).kind).toBe('server')
  })
})

describe('describeError by code', () => {
  it('uses the code before the status', () => {
    expect(describeError({ status: 409, code: 'SELF_CONFIRMATION_NOT_ALLOWED' }).title).toBe(
      "You can't confirm your own report",
    )
    expect(describeError({ status: 403, code: 'WARD_ASSIGNMENT_REQUIRED' }).title).toBe(
      'Choose your ward and street first',
    )
  })

  it('maps every stable code', () => {
    for (const code of [
      'VALIDATION_FAILED',
      'UNAUTHENTICATED',
      'FORBIDDEN',
      'RESOURCE_NOT_FOUND',
      'WARD_ASSIGNMENT_REQUIRED',
      'SELF_CONFIRMATION_NOT_ALLOWED',
      'IDEMPOTENCY_KEY_REQUIRED',
      'IDEMPOTENCY_KEY_REUSED',
      'PHOTO_TOO_LARGE',
      'UNSUPPORTED_PHOTO_TYPE',
      'INTERNAL_ERROR',
    ]) {
      expect(describeError({ status: 400, code }).title, code).toBeTruthy()
    }
  })

  it('falls back to the status for an unknown code', () => {
    expect(describeError({ status: 404, code: 'SOMETHING_NEW' }).kind).toBe('not-found')
  })
})

describe('describeError for report creation', () => {
  it('says the outcome is unknown when the response is lost, never "failed"', () => {
    for (const status of ['FETCH_ERROR', 'TIMEOUT_ERROR', 502, 504] as const) {
      const message = describeError({ status, operation: 'createReport' })
      expect(message.kind).toBe('outcome-unknown')
      expect(message.title).toBe('Outcome unknown, check or retry')
      expect(`${message.title} ${message.detail}`.toLowerCase()).not.toContain('failed')
    }
  })

  it('still reports a clear refusal as a refusal', () => {
    expect(describeError({ status: 400, operation: 'createReport' }).kind).toBe('validation')
  })
})
