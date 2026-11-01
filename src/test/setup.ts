// Runs before every test file: adds DOM matchers (toBeInTheDocument and so on) and
// starts each test with nothing rendered and nothing in sessionStorage.
// Vitest here is for pure logic only; no test may contain a fabricated API response.
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
  sessionStorage.clear()
})
