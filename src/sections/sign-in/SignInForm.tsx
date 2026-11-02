// The sign-in card (SignIn.dc.html): email and password, field errors, show/hide
// password, and the "wrong credentials" / "can't reach the service" alerts.
// Look and validation only for now; the demo account buttons are left out until the
// demo accounts are settled.
import { Form, Formik } from 'formik'
import { FormAlert } from '@/components/form/FormAlert'
import { FocusFirstError } from '@/components/form/FocusFirstError'
import { FormInput } from '@/components/form/FormInput'
import { FormPasswordInput } from '@/components/form/FormPasswordInput'
import { signInInitialValues, signInSchema, type SignInValues } from '@/schema/signIn'

// What went wrong on the last attempt, set once createSession is wired (slice 1).
export type SignInProblem = 'wrong-credentials' | 'unreachable' | null

const FIELD_ORDER = ['email', 'password']

export function SignInForm({ problem = null }: { problem?: SignInProblem }) {
  // TODO(slice-1): call createSession with the values, store the session, then go to
  // ?next= (if the role may open it) or the role's home.
  function handleSubmit(values: SignInValues) {
    void values
  }

  return (
    <Formik initialValues={signInInitialValues} validationSchema={signInSchema} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <Form
          noValidate
          aria-labelledby="sign-in-heading"
          className="flex w-full max-w-110 flex-col gap-3.5 rounded-[20px] border border-border bg-bg px-6.5 py-6 shadow-[0_20px_48px_rgba(11,29,46,0.10)] short:gap-3 short:py-5"
        >
          <FocusFirstError order={FIELD_ORDER} />
          <div className="flex flex-col gap-0.5">
            <h1 id="sign-in-heading" className="text-[26px] font-extrabold tracking-[-0.6px]">
              Sign in
            </h1>
            <p className="text-text-muted">Use your EkoWatch account.</p>
          </div>
          {problem === 'wrong-credentials' && <FormAlert tone="error">That email or password isn't right.</FormAlert>}
          {problem === 'unreachable' && (
            <FormAlert tone="offline">We can't reach EkoWatch right now. Try again in a moment.</FormAlert>
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
            type="submit"
            disabled={isSubmitting}
            className="min-h-11.5 w-full rounded-md bg-action text-base font-extrabold text-text hover:bg-action-hover disabled:opacity-60"
          >
            Sign in
          </button>
        </Form>
      )}
    </Formik>
  )
}
