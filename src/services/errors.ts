// Turns a failed request into words the user can act on (CLAUDE.md "Errors").
// Mapped by the stable error code first, then by HTTP status. Pure: it takes the status
// and code, never a whole response, so it can be tested with plain values.
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { SerializedError } from '@reduxjs/toolkit'

// HTTP status, or how the request failed without one: no connection or no response
// (FETCH_ERROR), took too long (TIMEOUT_ERROR), or the reply couldn't be read (PARSING_ERROR).
export type ErrorStatus = number | 'FETCH_ERROR' | 'TIMEOUT_ERROR' | 'PARSING_ERROR' | 'UNKNOWN'

export type ErrorInput = {
  status: ErrorStatus
  code?: string | null
  // createReport: a lost response means the report may have been saved.
  operation?: 'createReport'
}

export type ErrorKind =
  | 'validation'
  | 'session-ended'
  | 'forbidden'
  | 'not-found'
  | 'conflict'
  | 'photo-too-large'
  | 'photo-type'
  | 'server'
  | 'network'
  | 'outcome-unknown'

export type ErrorMessage = { kind: ErrorKind; title: string; detail: string }

const NETWORK: ErrorMessage = {
  kind: 'network',
  title: "We can't reach EkoWatch right now.",
  detail: 'Check your connection, then try again.',
}

const OUTCOME_UNKNOWN: ErrorMessage = {
  kind: 'outcome-unknown',
  title: 'Outcome unknown, check or retry',
  detail:
    "We didn't hear back, so your report may or may not have been saved. Check Reports, or send it again: it won't be added twice.",
}

const BY_STATUS: Record<number, ErrorMessage> = {
  400: { kind: 'validation', title: 'Check the highlighted fields.', detail: 'Some details need changing before this can be saved.' },
  401: { kind: 'session-ended', title: 'Your session has ended', detail: "For your security you've been signed out. Sign in again to carry on." },
  403: { kind: 'forbidden', title: "You don't have access to this", detail: 'Your account is not set up for this. If you think this is wrong, ask the ward office to check your access.' },
  404: { kind: 'not-found', title: "This doesn't exist.", detail: 'It may be a wrong or old link.' },
  409: { kind: 'conflict', title: "This couldn't be saved as it is.", detail: 'Something changed since you started. Reload, then try again.' },
  413: { kind: 'photo-too-large', title: 'That photo is too large.', detail: 'Choose a photo under 5 MB, or send the report without one.' },
  415: { kind: 'photo-type', title: "That photo type isn't supported.", detail: 'Choose a JPEG or PNG photo, or send the report without one.' },
}

// The stable codes listed in openapi.json (info.description) and build plan section 9.
// 400, 401, 403 and 404 bodies were checked on the live backend on 2026-11-02.
const BY_CODE: Record<string, ErrorMessage> = {
  VALIDATION_FAILED: BY_STATUS[400],
  UNAUTHENTICATED: BY_STATUS[401],
  FORBIDDEN: BY_STATUS[403],
  RESOURCE_NOT_FOUND: BY_STATUS[404],
  WARD_ASSIGNMENT_REQUIRED: {
    kind: 'forbidden',
    title: 'Choose your ward and street first',
    detail: 'Set your street, then try again.',
  },
  SELF_CONFIRMATION_NOT_ALLOWED: {
    kind: 'conflict',
    title: "You can't confirm your own report",
    detail: 'Another resident needs to confirm it.',
  },
  IDEMPOTENCY_KEY_REQUIRED: {
    kind: 'server',
    title: "This couldn't be sent.",
    detail: 'Something went wrong on our side. Try again.',
  },
  IDEMPOTENCY_KEY_REUSED: {
    kind: 'conflict',
    title: 'This report was already sent with different details.',
    detail: 'Check Reports to see what was saved, then start a new report if you need to.',
  },
  PHOTO_TOO_LARGE: BY_STATUS[413],
  UNSUPPORTED_PHOTO_TYPE: BY_STATUS[415],
  INTERNAL_ERROR: {
    kind: 'server',
    title: 'Something went wrong on our side.',
    detail: 'Try again in a moment.',
  },
}

export function describeError({ status, code, operation }: ErrorInput): ErrorMessage {
  // No response at all: for a report, it may have been saved, so never say "failed".
  const noResponse = status === 'FETCH_ERROR' || status === 'TIMEOUT_ERROR'
  if (noResponse) return operation === 'createReport' ? OUTCOME_UNKNOWN : NETWORK
  if (code && BY_CODE[code]) return BY_CODE[code]
  if (typeof status === 'number') {
    if (BY_STATUS[status]) return BY_STATUS[status]
    if (status >= 500) {
      // A gateway error can come back after the server already saved the report.
      if (operation === 'createReport' && (status === 502 || status === 504)) return OUTCOME_UNKNOWN
      return BY_CODE.INTERNAL_ERROR
    }
  }
  return BY_CODE.INTERNAL_ERROR
}

// Field messages from a problem+json body, keyed by field name, for Formik's setErrors.
export type FieldErrors = Record<string, string>

function readProblem(data: unknown): { code: string | null; fieldErrors: FieldErrors } {
  if (typeof data !== 'object' || data === null) return { code: null, fieldErrors: {} }
  const body = data as { code?: unknown; fieldErrors?: unknown }
  const fieldErrors: FieldErrors = {}
  if (Array.isArray(body.fieldErrors)) {
    for (const item of body.fieldErrors) {
      const { field, message } = (item ?? {}) as { field?: unknown; message?: unknown }
      if (typeof field === 'string' && typeof message === 'string') fieldErrors[field] = message
    }
  }
  return { code: typeof body.code === 'string' ? body.code : null, fieldErrors }
}

// Reads the status, code and field errors from an RTK Query error.
export function toErrorInput(
  error: FetchBaseQueryError | SerializedError | undefined,
): ErrorInput & { fieldErrors: FieldErrors } {
  if (!error || !('status' in error)) return { status: 'UNKNOWN', fieldErrors: {} }
  if (error.status === 'CUSTOM_ERROR') return { status: 'UNKNOWN', fieldErrors: {} }
  const { code, fieldErrors } = readProblem('data' in error ? error.data : undefined)
  return { status: error.status, code, fieldErrors }
}
