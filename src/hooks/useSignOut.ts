// Signs out: clears the session (slice and sessionStorage) and every cached response,
// then goes to sign-in.
import { useCallback } from 'react'
import { useNavigate } from 'react-router'
import { sessionEnded } from '@/app/sessionSlice'
import { ROUTES } from '@/constants/routes'
import { useAppDispatch } from '@/hooks/useAppStore'
import { api } from '@/services/api'

export function useSignOut() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  return useCallback(() => {
    dispatch(sessionEnded())
    dispatch(api.util.resetApiState())
    navigate(ROUTES.login, { replace: true })
  }, [dispatch, navigate])
}
