import { describe, expect, it } from 'vitest'
import { parseApiBaseUrl } from '@/config/env'

describe('parseApiBaseUrl', () => {
  it('fails loudly when the value is missing', () => {
    expect(() => parseApiBaseUrl(undefined)).toThrow(/VITE_API_BASE_URL is not set/)
    expect(() => parseApiBaseUrl('')).toThrow(/VITE_API_BASE_URL is not set/)
  })

  it('removes a trailing slash', () => {
    expect(parseApiBaseUrl('https://example.test/api/v1/')).toBe('https://example.test/api/v1')
  })

  it('requires /api/v1 at the end', () => {
    expect(() => parseApiBaseUrl('https://example.test')).toThrow(/must end with \/api\/v1/)
  })
})
