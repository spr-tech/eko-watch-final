// Sign-in form: is it filled in, and does the email look like one. The service decides
// whether the details are right. Wording from SignIn.dc.html.
import * as Yup from 'yup'

export const signInSchema = Yup.object({
  email: Yup.string()
    .trim()
    .required('Enter your email address, like name@example.com')
    .email('Enter an email address like name@example.com'),
  password: Yup.string().required('Enter your password'),
})

export type SignInValues = Yup.InferType<typeof signInSchema>

export const signInInitialValues: SignInValues = { email: '', password: '' }
