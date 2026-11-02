// Ward and street set-up, matching UpdatePreferencesRequest (wardId and streetId required).
import * as Yup from 'yup'

export const wardSetupSchema = Yup.object({
  wardId: Yup.string().required('Choose your ward'),
  streetId: Yup.string().required('Choose your street'),
})

export type WardSetupValues = Yup.InferType<typeof wardSetupSchema>
