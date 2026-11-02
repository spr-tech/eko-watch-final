// The sign-in card (SignIn.dc.html): email and password, field errors, show/hide
// password, the "wrong credentials" / "can't reach the service" alerts, and the demo
// accounts. Signing in calls createSession and stores the session; SignInPage then sends
// the user on (to ?next= if their role may open it, otherwise their home).
import { useEffect, useRef, useState } from 'react'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { Form, Formik, type FormikHelpers } from 'formik'
import { sessionStarted } from '@/app/sessionSlice'
import { WAKING_UP_AFTER_MS } from '@/components/common/LoadingState'
import { FormAlert } from '@/components/form/FormAlert'
import { FocusFirstError } from '@/components/form/FocusFirstError'
import { FormInput } from '@/components/form/FormInput'
import { FormPasswordInput } from '@/components/form/FormPasswordInput'
import type { DemoAccount } from '@/constants/demoAccounts'
import { useAppDispatch } from '@/hooks/useAppStore'
import { signInInitialValues, signInSchema, type SignInValues } from '@/schema/signIn'
import { DemoAccounts } from '@/sections/sign-in/DemoAccounts'
import { api } from '@/services/api'
import { useCreateSessionMutation } from '@/services/authApi'
import { toErrorInput } from '@/services/errors'
import { ROLES } from '@/types/ekowatch'

// What went wrong on the last attempt.
// unexpected: the service answered with something the app doesn't know, such as a new role.
export type SignInProblem = 'wrong-credentials' | 'unreachable' | 'unexpected' | null

const FIELD_ORDER = ['email', 'password']

// True once `active` has stayed true for WAKING_UP_AFTER_MS.
function useSlowFlag(active: boolean): boolean {
  const [slow, setSlow] = useState(false)
  useEffect(() => {
    if (!active) return
    const timer = window.setTimeout(() => setSlow(true), WAKING_UP_AFTER_MS)
    return () => {
      window.clearTimeout(timer)
      setSlow(false)
    }
  }, [active])
  return slow
}

export function SignInForm() {
  const dispatch = useAppDispatch()
  const [createSession, { isLoading }] = useCreateSessionMutation()
  const [problem, setProblem] = useState<SignInProblem>(null)
  const submitRef = useRef<HTMLButtonElement>(null)
  const slow = useSlowFlag(isLoading)

  async function handleSubmit(values: SignInValues, helpers: FormikHelpers<SignInValues>) {
    setProblem(null)
    try {
      const session = await createSession({ email: values.email.trim(), password: values.password }).unwrap()
      if (!(ROLES as readonly string[]).includes(session.user.role)) {
        // An unknown enum value is an error to report, never something to guess at.
        setProblem('unexpected')
        return
      }
      // Nothing cached for a previous account may show for this one.
      dispatch(api.util.resetApiState())
      dispatch(sessionStarted(session))
    } catch (error) {
      const { status, fieldErrors } = toErrorInput(error as FetchBaseQueryError)
      if (status === 401) setProblem('wrong-credentials')
      else if (status === 400 && Object.keys(fieldErrors).length > 0) helpers.setErrors(fieldErrors)
      else if (status === 400) setProblem('wrong-credentials')
      else setProblem('unreachable')
    }
  }

  return (
    <Formik initialValues={signInInitialValues} validationSchema={signInSchema} onSubmit={handleSubmit}>
      {({ isSubmitting, setValues, setTouched }) => {
        function pickAccount(account: DemoAccount) {
          setProblem(null)
          void setTouched({}, false)
          void setValues({ email: account.email, password: account.password }, false)
          submitRef.current?.focus()
        }

        return (
          <Form
            noValidate
            aria-labelledby="sign-in-heading"
            className="flex w-full max-w-110 flex-col gap-3.5 rounded-[20px] border border-border bg-bg px-6.5 py-6 shadow-[0_20px_48px_rgba(11,29,46,0.10)] short:gap-2.5 short:py-4.5"
          >
            <FocusFirstError order={FIELD_ORDER} />
            <div className="flex flex-col gap-0.5">
              <h1 id="sign-in-heading" className="text-[26px] font-extrabold tracking-[-0.6px]">
                Sign in
              </h1>
              <p className="text-text-muted">Use your EkoWatch account, or pick a demo account.</p>
            </div>
            {problem === 'wrong-credentials' && <FormAlert tone="error">That email or password isn't right.</FormAlert>}
            {problem === 'unreachable' && (
              <FormAlert tone="offline">We can't reach EkoWatch right now. Try again in a moment.</FormAlert>
            )}
            {problem === 'unexpected' && (
              <FormAlert tone="error">EkoWatch sent a reply this app doesn't recognise. Try again later.</FormAlert>
            )}
            <FormInput
              name="email"
              label="Email address"
              type="email"
              autoComplete="username"
              placeholder="name@example.com"
            />
            <FormPasswordInput name="password" label="Password" autoComplete="current-password" />
            <button
              ref={submitRef}
              type="submit"
              disabled={isSubmitting}
              className="min-h-11.5 w-full rounded-md bg-action text-base font-extrabold text-text hover:bg-action-hover disabled:opacity-60"
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>
            <p role="status" className={slow ? 'text-sm font-bold text-text-muted' : 'sr-only'}>
              {slow ? 'EkoWatch may be waking up, which can take up to a minute.' : ''}
            </p>
            <DemoAccounts onPick={pickAccount} />
          </Form>
        )
      }}
    </Formik>
  )
}
