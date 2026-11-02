// /reports/new (ReportNew.dc.html): what, where, a note and an optional photo. The photo
// is uploaded first, then the report is created with its photoId and an Idempotency-Key.
// The key belongs to what the user is sending: a retry of the same report reuses it (and
// the same photoId), so the service can't save it twice; a changed report gets a new one.
// A lost reply is "not sure it was sent", never "failed". Entered values always stay.
import { useRef, useState } from 'react'
import { Form, Formik, useField, useFormikContext, type FormikHelpers } from 'formik'
import { Link, useNavigate } from 'react-router'
import { buttonStyles } from '@/components/common/buttonStyles'
import { ErrorState } from '@/components/common/ErrorState'
import { AlertCircleIcon, PhotoIcon, RefreshIcon } from '@/components/common/Icons'
import { ReportTypeIcon } from '@/components/common/ReportTypeIcon'
import { FocusFirstError } from '@/components/form/FocusFirstError'
import { FormSelect } from '@/components/form/FormSelect'
import { FormTextarea } from '@/components/form/FormTextarea'
import { useFieldError } from '@/components/form/useFieldError'
import { useToast } from '@/components/ui/toast'
import { ROUTES } from '@/constants/routes'
import { REPORT_TYPE_LABELS } from '@/constants/status'
import { useIdempotencyKey } from '@/hooks/useIdempotencyKey'
import { useNow } from '@/hooks/useNow'
import { cn } from '@/lib/cn'
import {
  buildCreateReportRequest,
  COLLECTION_DAYS_BACK,
  createReportInitialValues,
  pastCollectionDays,
  toFormField,
  type CreateReportFormValues,
} from '@/lib/createReport'
import { formatCollectionDate, lagosDate, shiftDate } from '@/lib/format'
import { createReportSchema, NOTE_MAX_LENGTH, PHOTO_TYPES } from '@/schema/createReport'
import { useListCollectionSchedulesQuery } from '@/services/collectionApi'
import { describeError, toErrorInput, type ErrorMessage } from '@/services/errors'
import { useUploadPhotoMutation } from '@/services/photoApi'
import { useCreateReportMutation } from '@/services/reportApi'
import { useListStreetsQuery } from '@/services/wardApi'
import { REPORT_TYPES, type ReportType } from '@/types/ekowatch'

const FIELD_ORDER = ['reportType', 'streetId', 'collectionDate', 'note', 'photo']

// The design's order: missed pickup first.
const TYPE_ORDER: ReportType[] = ['MISSED_PICKUP', 'ILLEGAL_DUMPING', 'BLOCKED_DRAIN', 'FLOODED_ROAD']

type Outcome = { kind: 'failed'; message: ErrorMessage } | { kind: 'unknown' } | null

function TypePicker() {
  const [field, , helpers] = useField<string>('reportType')
  const error = useFieldError('reportType')
  return (
    <fieldset aria-describedby={error ? 'reportType-error' : undefined} className="min-w-0">
      <legend className="mb-2 text-[15px] font-extrabold">What are you reporting?</legend>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-2">
        {TYPE_ORDER.map((type, index) => {
          const on = field.value === type
          return (
            <label
              key={type}
              className={cn(
                'relative flex min-h-13 cursor-pointer items-center gap-2.5 rounded-xl px-3 py-1.5 has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus',
                on ? 'border-2 border-primary bg-[#F0F6FD]' : 'border border-border bg-bg',
              )}
            >
              <input
                type="radio"
                name="reportType"
                value={type}
                checked={on}
                onChange={() => void helpers.setValue(type)}
                data-field={index === 0 ? 'reportType' : undefined}
                aria-invalid={error ? true : undefined}
                className="absolute size-px opacity-0"
              />
              <ReportTypeIcon reportType={type} size="sm" />
              <span className="text-[15px] font-extrabold">{REPORT_TYPE_LABELS[type]}</span>
            </label>
          )
        })}
      </div>
      {error && (
        <p id="reportType-error" className="mt-1.5 text-sm font-bold text-danger">
          <span aria-hidden="true">! </span>
          {error}
        </p>
      )}
    </fieldset>
  )
}

function PhotoField() {
  const [field, , helpers] = useField<File | null>('photo')
  const error = useFieldError('photo')
  const inputRef = useRef<HTMLInputElement>(null)
  const file = field.value
  return (
    <div className="flex flex-col gap-1.5">
      <span id="photo-label" className="text-[15px] font-extrabold">
        Photo <span className="font-semibold text-text-muted">(optional)</span>
      </span>
      <label className="relative flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-[#8A99AB] bg-[#F8FAFC] px-3 py-2.5 has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus">
        {/* capture is a hint only: phones may still offer the gallery, and that's fine. */}
        <input
          ref={inputRef}
          type="file"
          accept={PHOTO_TYPES.join(',')}
          capture="environment"
          data-field="photo"
          aria-labelledby="photo-label photo-action"
          aria-describedby={error ? 'photo-error photo-help' : 'photo-help'}
          aria-invalid={error ? true : undefined}
          onChange={(event) => {
            void helpers.setValue(event.target.files?.[0] ?? null)
            void helpers.setTouched(true)
          }}
          className="absolute size-px opacity-0"
        />
        <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary-light text-primary">
          <PhotoIcon size={22} />
        </span>
        <span className="flex min-w-0 flex-col">
          <span id="photo-action" className="font-extrabold text-primary wrap-anywhere">
            {file ? file.name : 'Take or add a photo'}
          </span>
          <span className="text-sm text-text-muted">JPG or PNG, up to 5 MB</span>
        </span>
      </label>
      {file && (
        <button
          type="button"
          onClick={() => {
            void helpers.setValue(null)
            if (inputRef.current) inputRef.current.value = ''
          }}
          className="self-start text-sm font-extrabold text-primary underline"
        >
          Remove photo
        </button>
      )}
      {error && (
        <p id="photo-error" className="text-sm font-bold text-danger">
          <span aria-hidden="true">! </span>
          {error}
        </p>
      )}
      <span id="photo-help" className="text-sm text-text-muted">
        We can't confirm where a photo was taken. Location details are removed when it's saved.
      </span>
    </div>
  )
}

// The missed collection day: past scheduled days for the chosen street.
function CollectionDayField({ wardId, today }: { wardId: string; today: string }) {
  const { values } = useFormikContext<CreateReportFormValues>()
  const schedules = useListCollectionSchedulesQuery(
    { wardId, streetId: values.streetId, fromDate: shiftDate(today, -COLLECTION_DAYS_BACK), toDate: today, size: 100 },
    { skip: !values.streetId },
  )
  const days = schedules.data ? pastCollectionDays(schedules.data.items.map((s) => s.collectionDate), today) : []
  let placeholder = 'Choose a day'
  if (!values.streetId) placeholder = 'Choose a street first'
  else if (schedules.isFetching) placeholder = 'Loading collection days'
  else if (schedules.isError) placeholder = "Couldn't load collection days"
  else if (days.length === 0) placeholder = 'No collection days in the last 30 days'
  return (
    <FormSelect
      name="collectionDate"
      label="Which collection day?"
      hint="Past collection days for this street."
      required
      placeholder={placeholder}
      disabled={!values.streetId || days.length === 0}
      options={days.map((day) => ({ value: day, label: formatCollectionDate(day) }))}
    />
  )
}

function OutcomeAlert({ outcome }: { outcome: Outcome }) {
  if (!outcome) return null
  if (outcome.kind === 'unknown') {
    return (
      <div role="alert" className="flex gap-2.5 rounded-xl bg-warning-light px-3.5 py-3 text-warning-dark">
        <AlertCircleIcon size={20} />
        <span className="flex flex-col gap-1">
          <strong>We're not sure your report was sent.</strong>
          <span>
            The connection dropped before EkoWatch replied. Check your reports first. If it isn't there, send it again. It
            won't be sent twice.
          </span>
        </span>
      </div>
    )
  }
  return (
    <div role="alert" className="flex gap-2.5 rounded-xl bg-danger-light px-3.5 py-3 text-danger">
      <AlertCircleIcon size={20} />
      <span>
        <strong>Your report wasn't sent. {outcome.message.title}</strong> {outcome.message.detail} What you typed is still
        here.
      </span>
    </div>
  )
}

export function CreateReportForm({ wardId, ownStreetId }: { wardId: string; ownStreetId: string | null }) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const today = lagosDate(useNow())
  const streets = useListStreetsQuery(wardId)
  const [uploadPhoto] = useUploadPhotoMutation()
  const [createReport] = useCreateReportMutation()
  const { getKey, startNewReport } = useIdempotencyKey()
  const [outcome, setOutcome] = useState<Outcome>(null)
  // The photo already uploaded for this file, so a retry reuses its photoId.
  const uploaded = useRef<{ file: File; photoId: string } | null>(null)
  // The body last sent, so a retry of the same report keeps its Idempotency-Key.
  const lastBody = useRef<string | null>(null)

  async function handleSubmit(values: CreateReportFormValues, helpers: FormikHelpers<CreateReportFormValues>) {
    setOutcome(null)
    const reportType = values.reportType
    if (!reportType || !REPORT_TYPES.includes(reportType)) return

    let photoId: string | null = null
    if (values.photo) {
      if (uploaded.current?.file === values.photo) photoId = uploaded.current.photoId
      else {
        try {
          const photo = await uploadPhoto(values.photo).unwrap()
          uploaded.current = { file: values.photo, photoId: photo.photoId }
          photoId = photo.photoId
        } catch (error) {
          const message = describeError(toErrorInput(error as Parameters<typeof toErrorInput>[0]))
          if (message.kind === 'photo-too-large' || message.kind === 'photo-type') {
            helpers.setFieldError('photo', `${message.title} ${message.detail}`)
          } else {
            setOutcome({
              kind: 'failed',
              message: {
                ...message,
                title: "The photo couldn't be uploaded.",
                detail: `${message.detail} You can also remove the photo and send the report without it.`,
              },
            })
          }
          return
        }
      }
    }

    const body = buildCreateReportRequest({ ...values, reportType }, photoId)
    const serialised = JSON.stringify(body)
    if (lastBody.current !== serialised) {
      startNewReport()
      lastBody.current = serialised
    }
    try {
      const report = await createReport({ body, idempotencyKey: getKey() }).unwrap()
      startNewReport()
      lastBody.current = null
      toast({ title: 'Report sent', description: 'Your neighbours can now confirm it.', variant: 'success' })
      void navigate(ROUTES.reportDetail(report.reportId))
    } catch (error) {
      const input = toErrorInput(error as Parameters<typeof toErrorInput>[0])
      const message = describeError({ ...input, operation: 'createReport' })
      if (message.kind === 'outcome-unknown') {
        setOutcome({ kind: 'unknown' })
        return
      }
      const fieldEntries = Object.entries(input.fieldErrors)
      if (fieldEntries.length > 0) {
        helpers.setErrors(Object.fromEntries(fieldEntries.map(([field, text]) => [toFormField(field), text])))
      }
      setOutcome({ kind: 'failed', message })
    }
  }

  if (streets.isError) {
    const message = describeError(toErrorInput(streets.error))
    return (
      <ErrorState
        title="We couldn't load the street list."
        description={`You need it to choose where the problem is. ${message.kind === 'network' ? message.detail : `${message.title} ${message.detail}`}`}
        onRetry={() => void streets.refetch()}
        retrying={streets.isFetching}
      />
    )
  }

  const loadingStreets = !streets.data
  return (
    <Formik
      initialValues={createReportInitialValues(ownStreetId)}
      validationSchema={createReportSchema}
      onSubmit={handleSubmit}
    >
      {({ values, isSubmitting }) => (
        <div className="flex flex-wrap items-start gap-6">
          <Form
            noValidate
            aria-label="Report a problem"
            aria-busy={isSubmitting || undefined}
            className="flex min-w-0 flex-[999_1_520px] flex-col gap-4.5 rounded-card border border-border bg-bg px-5 pt-4.5"
          >
            <FocusFirstError order={FIELD_ORDER} />
            <OutcomeAlert outcome={outcome} />
            <TypePicker />
            <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-3.5">
              {loadingStreets ? (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[15px] font-extrabold">Street</span>
                  <span aria-hidden="true" className="skeleton h-11.5 rounded-md" />
                </div>
              ) : (
                <FormSelect
                  name="streetId"
                  label="Street"
                  required
                  placeholder="Choose a street"
                  options={streets.data.map((street) => ({ value: street.streetId, label: street.streetName }))}
                />
              )}
              {values.reportType === 'MISSED_PICKUP' && <CollectionDayField wardId={wardId} today={today} />}
            </div>
            <FormTextarea
              name="note"
              label="What's happening?"
              hint="1 to 1000 characters. Say what you can see, not who caused it."
              required
              rows={3}
              maxLength={NOTE_MAX_LENGTH}
              showCount
            />
            <PhotoField />
            <div className="sticky bottom-0 z-5 -mx-5 flex flex-wrap items-center gap-2.5 rounded-b-card border-t border-skeleton bg-bg px-5 py-3">
              {outcome?.kind === 'unknown' ? (
                <>
                  <Link to={ROUTES.reports} className={buttonStyles.navy}>
                    Check my reports
                  </Link>
                  <button type="submit" disabled={isSubmitting} className={buttonStyles.line}>
                    {isSubmitting ? 'Sending…' : 'Send again'}
                  </button>
                </>
              ) : (
                <button type="submit" disabled={isSubmitting || loadingStreets} className={buttonStyles.green}>
                  {outcome?.kind === 'failed' && !isSubmitting && <RefreshIcon size={18} />}
                  {isSubmitting ? 'Sending…' : outcome?.kind === 'failed' ? 'Try again' : 'Send report'}
                </button>
              )}
              {loadingStreets ? (
                <span role="status" className="text-sm text-text-muted">
                  Loading the street list
                </span>
              ) : (
                outcome?.kind !== 'unknown' && (
                  <Link to={ROUTES.reports} className={cn(buttonStyles.line, 'border-transparent')}>
                    Cancel
                  </Link>
                )
              )}
            </div>
          </Form>
          <aside className="hidden flex-[1_1_240px] flex-col gap-3 md:flex">
            <h2 className="text-base font-extrabold">After you send it</h2>
            <ol className="flex flex-col gap-3">
              {[
                'It appears in Reports in your ward, marked as reported by a resident.',
                'Neighbours who see it confirm it, and it moves up the list.',
                'The ward office sees it on its dashboard.',
              ].map((step, index) => (
                <li key={step} className="flex gap-2.5">
                  <span
                    aria-hidden="true"
                    className="flex size-6.5 shrink-0 items-center justify-center rounded-full bg-text text-[13px] font-extrabold text-white"
                  >
                    {index + 1}
                  </span>
                  <span className="text-text-muted">{step}</span>
                </li>
              ))}
            </ol>
            <p className="rounded-xl bg-primary-light px-3.5 py-3 text-sm">
              <strong>Flooded roads</strong> stay current for 6 hours, then expire unless someone confirms them again.
            </p>
          </aside>
        </div>
      )}
    </Formik>
  )
}
