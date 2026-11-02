import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { documentTitle, useDocumentTitle } from '@/hooks/useDocumentTitle'

describe('useDocumentTitle', () => {
  it('formats "<Page> · EkoWatch"', () => {
    expect(documentTitle('Reports')).toBe('Reports · EkoWatch')
  })

  it('sets the tab title', () => {
    renderHook(() => useDocumentTitle('Sign in'))
    expect(document.title).toBe('Sign in · EkoWatch')
  })
})
