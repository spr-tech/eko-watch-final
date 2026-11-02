// Sets the browser tab title, e.g. "Reports · EkoWatch". Every page calls it.
import { useEffect } from 'react'

export function documentTitle(page: string): string {
  return `${page} · EkoWatch`
}

export function useDocumentTitle(page: string) {
  useEffect(() => {
    document.title = documentTitle(page)
  }, [page])
}
