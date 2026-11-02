# EkoWatch frontend

EkoWatch gives one Lagos ward a shared picture of its streets: whether waste collection happened, where drains are blocked, and which roads residents report as flooded right now. It is a community reporting tool. It does not forecast floods, dispatch crews, replace any agency or certify that a road is safe.

This repository is the interface tier. The Java service lives in a separate repository owned by the service engineers (Adedayo: data and rules; Esther: API and access). Never edit the backend repository from here.

Built for the TeSA Cohort 6 capstone as Team 1's side project. FoodBridge is the main product. Keep EkoWatch to its MVP scope.

## Read these first

- `docs/build.pdf`: the EkoWatch build plan (implementation baseline v1). The source of truth for every name, path, payload, enum, status code and error code.
- `docs/intent/ekowatch.md`: the requirements from the capstone brief (pages 14 to 16).
- `openapi.json`: the frontend's copy of the deployed backend contract, saved from https://ekowatch-backend.onrender.com/v3/api-docs. Re-save it whenever the backend changes and commit the change with a note in `docs/decisions.md`.
- `docs/decisions.md`: agreed decisions and recorded deviations from `docs/build.pdf`. Check before changing anything structural.
- `docs/ai-log.md`: record of AI-assisted work and how it was checked.
- `docs/design/README.md`: which design file maps to which route, every state each file contains, and the corrections that win over the design.

Precedence: the deployed backend's OpenAPI contract wins over `docs/build.pdf` for what an endpoint actually does today. If they disagree, stop and report the mismatch. Do not work around it in the frontend.

## Design

- Build screens from `docs/design/ekowatch/source/`. Read the HTML for exact colours, spacing and wording; don't approximate.
- Desktop boards are drawn at 1536 × 730 and phone boards at 390 × 844. The viewport rules below still win where they disagree.
- Never show placeholder text from the design, such as "Yaba ward (placeholder)", "[LOCATION]" or "[PHOTO CREDIT]". See the corrections in `docs/design/README.md`.
- `docs/design/README.md` lists corrections where the design contradicts the backend contract. Those corrections win over the design files.
- Before finishing a screen, list every difference from its design.

## No mock data. Live backend only.

- There is no mock layer in this project. Do not create `src/mocks/`, a Prism mock server, MSW (Mock Service Worker) handlers, fixture files, seed data, sample arrays or placeholder records anywhere in `src/`.
- Do not add a mock or demo toggle. There is no `VITE_USE_MOCKS`.
- Never fall back to fake data when a request fails. A failed request shows the error state.
- Demo data lives only in the backend seeds, which Adedayo owns. If a screen needs data that does not exist in the backend, report it. Do not invent it.
- If an endpoint this task needs is not deployed yet, or its response differs from `docs/build.pdf` section 8, stop and tell me. Do not build the screen against a guessed shape.
- Exception: the open contract questions listed in `docs/decisions.md` ("Contract differences found in the deployed backend") do not block work. Build to what the deployed backend actually returns. Where the answer is still unknown (error codes, which fields can be null), handle it by HTTP status and treat the field as possibly `null`. Mark the spot with `// TODO(contract): <question>` and list every such TODO when you finish. Never fill the gap with invented data.

## Testing against the backend

Before wiring any endpoint:

1. Call it on the deployed backend with `curl`, signing in first with a demo account from the backend README. Send an `X-Request-ID` header.
2. Compare the real response with `openapi.json` and `docs/build.pdf` section 8: field names, casing, enums, required and nullable fields, status codes and error bodies.
3. List every difference before writing code.

After wiring a screen, walk its journey on the live backend and report what you saw: success, empty, validation error, wrong-role refusal (403), signed-out (401) and not-found (404) where they apply.

Rules:

- Never write to the database directly, never edit backend code and never run backend seed or reset commands.
- Write requests (`POST`, `PUT`) against the deployed backend create real records. Tell me before running them and say which demo account you will use.
- Never print or commit tokens or passwords. Demo credentials come from the backend README, not from this file.
- Vitest is for pure logic only: date and age formatting, status labels, the error-code-to-message mapping, role rules. No test may contain fabricated API responses.

## Naming: match the build plan exactly

The backend uses these names. Do not introduce synonyms or aliases. Never rename `reportType` to `category`, `collectionDate` to `pickupDate`, or `confirmationCount` to `votes`. JSON and TypeScript use lowerCamelCase. The database uses snake_case, but the frontend never sees it.

IDs are UUID (universally unique identifier) strings. Instants are ISO 8601 UTC strings set by the server. `collectionDate` is `YYYY-MM-DD` in Africa/Lagos time, never the browser's timezone.

### Enums (exact values, no extra values)

```ts
type Role = 'RESIDENT' | 'OPERATOR' | 'AUTHORITY';
type ReportType = 'MISSED_PICKUP' | 'ILLEGAL_DUMPING' | 'BLOCKED_DRAIN' | 'FLOODED_ROAD';
type FloodStatus = 'CURRENT' | 'EXPIRED';
type CollectionStatus = 'SCHEDULED' | 'DONE' | 'MISSED' | 'DISPUTED';
```

An unknown enum value from the server is an error to report, not something to map silently. There is no report status or resolution enum in the MVP.

### Types (in `src/types/ekowatch.ts`)

Use these names and fields exactly as in `docs/build.pdf` section 8:

- Auth and user: `CreateSessionRequest`, `SessionView`, `CurrentUserView` (`userId`, `email`, `displayName`, `role`, `wardId`, `streetId`; the last two may be null) and `UpdatePreferencesRequest`.
- Places: `WardView` (`wardId`, `wardName`) and `StreetView` (`streetId`, `wardId`, `streetName`, nullable `mapLocation`). The deployed backend uses `wardName` and `streetName`, not the build plan's `name`. Use the deployed names; the difference is logged in `docs/decisions.md`.
- Photos and reports: `PhotoView` (`photoId`, `photoUrl`, `contentType`, `sizeBytes`, `createdAt`), `CreateReportRequest` and `ReportView`. `ReportView` includes `confirmationCount`, `confirmedByMe`, `lastEvidenceAt`, `floodStatus`, `expiresAt` and `locationPrecision: 'STREET'`.
- Collections: `CollectionScheduleView` and `CollectionView`.
- Ward views: `WardHazardsView`, `WardDashboardView` and `OperatorPerformanceView`.
- Generic: `Page<T>` (`items`, zero-based `page`, `size`, `totalElements`, `totalPages`).

Nullable response fields are always present with `null`. Type them as `T | null`, not optional.

`ReportView` never contains reporter identity or precise coordinates. Do not add fields for them.

### API layer (RTK Query, endpoint keys equal the OpenAPI operationId)

One file per domain module named exactly as in `docs/build.pdf` section 7. Inside each file, the endpoint key is the operationId, so `reportApi.createReport` becomes the `createReport` endpoint in `src/services/reportApi.ts` with the hook `useCreateReportMutation`.

| File | Endpoints (operationId) | Method and path (prefix `/api/v1`) |
| --- | --- | --- |
| `src/services/authApi.ts` | `createSession` | POST `/auth/sessions` |
| `src/services/userApi.ts` | `getCurrentUser`, `updateMyPreferences` | GET `/users/me`, PUT `/users/me/preferences` |
| `src/services/wardApi.ts` | `listWards`, `listStreets` | GET `/wards`, GET `/wards/{wardId}/streets` |
| `src/services/collectionApi.ts` | `listCollectionSchedules`, `recordCollection` | GET `/collection-schedules`, PUT `/streets/{streetId}/collections/{collectionDate}` |
| `src/services/operatorApi.ts` | `listMyAssignedStreets` | GET `/operators/me/streets` |
| `src/services/photoApi.ts` | `uploadPhoto` | POST `/photos` (multipart, field `file`) |
| `src/services/reportApi.ts` | `createReport`, `listReports`, `getReport`, `confirmReport`, `listWardHazards` | POST `/reports`, GET `/reports`, GET `/reports/{reportId}`, PUT `/reports/{reportId}/confirmations/me`, GET `/wards/{wardId}/hazards` |
| `src/services/authorityApi.ts` | `getWardDashboard` | GET `/wards/{wardId}/dashboard` |

Photos are shown through the `photoUrl` the server returns. Do not build photo URLs by hand.

Query parameters and defaults follow `docs/build.pdf` section 8:

- `/reports`: requires `wardId`; sort is `CONFIRMATIONS` by default or `NEWEST`; `page` starts at 0; `size` defaults to 20.
- `/collection-schedules` and `/wards/{wardId}/dashboard`: require `fromDate` and `toDate`, inclusive, at most 31 days apart.
- `floodStatus` is only sent together with `reportType=FLOODED_ROAD`.

### Routes and pages

| Route | Page component | Roles |
| --- | --- | --- |
| `/login` | `LoginPage` | signed out |
| `/setup` | `WardSetupPage` | RESIDENT |
| `/collections` | `CollectionSchedulePage` | RESIDENT, AUTHORITY |
| `/reports` | `ReportListPage` | all signed in |
| `/reports/new` | `CreateReportPage` | RESIDENT |
| `/reports/:reportId` | `ReportDetailPage` | all signed in |
| `/hazards` | `HazardsPage` | all signed in |
| `/operator/collections` | `OperatorCollectionsPage` | OPERATOR |
| `/authority/dashboard` | `AuthorityDashboardPage` | AUTHORITY |

Browser routes are not API paths. Keep them separate.

Reports for each role: residents can browse, confirm and create. The ward office and operators see `/reports` and `/reports/:reportId` read-only, with no Confirm button and no way to create a report. Operators have Reports in their menu. See `docs/decisions.md`.

## Stack (same as FoodBridge; deviation from the build plan recorded in docs/decisions.md)

- Vite + React + TypeScript (strict). No `any`.
- React Router for navigation.
- Redux Toolkit + RTK Query (Redux Toolkit Query) for server data, `injectEndpoints` pattern. This replaces the TanStack Query choice in `docs/build.pdf` section 11; the names above are unchanged.
- Formik for forms, Yup for validation schemas.
- UI components from the shared component set (github.com/spr-tech/interface-eng-shared-components), copied into `src/components/ui/`.
- Tailwind CSS with tokens from `src/styles/tokens.css`. Use canonical Tailwind classes.
- Sidebar layout for signed-in screens.

## RTK Query rules

- Exactly one `createApi`, in `src/services/api.ts`, with `endpoints: () => ({})`. Every domain file uses `api.injectEndpoints`.
- `baseUrl` comes from `VITE_API_BASE_URL` via `src/config/env.ts`. The value includes `/api/v1` once; endpoint paths never repeat it.
- `prepareHeaders` adds:
  - `Authorization: Bearer <accessToken>` on every request except `createSession`;
  - `X-Request-ID` with a new UUID on every request (header spelled exactly like this).
- `createReport` sends `Idempotency-Key: <UUID>`. Generate one key per user intent, keep it with the pending payload, reuse it on retry, and generate a new key only for a genuinely new report.
- Photo flow: upload the photo first, then create the report with the returned `photoId`. A retry reuses the same `photoId`.
- `recordCollection` and `confirmReport` send an empty body.
- Never use `fetch` or Axios directly for API calls. Screens import hooks from `src/services/` only.
- Tags: `Report`, `Hazards`, `Dashboard`, `Schedule`, `CurrentUser`. Tag by ID plus a `LIST` tag where lists exist.

### Optimistic action: confirmation

`confirmReport` is the one optimistic update.

- In `onQueryStarted`, mark the report pending. Increment `confirmationCount` only if `confirmedByMe` was `false`. A reconfirmation of an expired flood refreshes evidence without incrementing.
- On an explicit refusal (403, 404, 409 `SELF_CONFIRMATION_NOT_ALLOWED`), call `patchResult.undo()` and explain in words the user can act on.
- On a lost connection or a lost response, do not roll back as fact and do not show success. Show "Unconfirmed save", then refetch or retry before deciding.
- On success, replace the cached report with the server's `ReportView` and invalidate the report list, hazards and dashboard.

## Errors

Errors are meant to arrive as `application/problem+json` with `type`, `title`, `status`, `code`, `detail`, `instance`, `requestId` and optional `fieldErrors`.

- The Swagger page documents no error responses, so confirm the real error shape with `curl` (a bad login, a wrong role, a missing report) before writing `src/services/errors.ts`, and report any difference from this section.
- Map by `code` first, then by status, in `src/services/errors.ts`.
- Show `fieldErrors` against their fields.
- On 401, send the user to sign in. On 403, show a permission message.
- On a lost response to `createReport`, say "Outcome unknown, check or retry", never "failed".

Stable codes: `VALIDATION_FAILED`, `UNAUTHENTICATED`, `FORBIDDEN`, `RESOURCE_NOT_FOUND`, `WARD_ASSIGNMENT_REQUIRED`, `SELF_CONFIRMATION_NOT_ALLOWED`, `IDEMPOTENCY_KEY_REQUIRED`, `IDEMPOTENCY_KEY_REUSED`, `PHOTO_TOO_LARGE`, `UNSUPPORTED_PHOTO_TYPE`, `INTERNAL_ERROR`.

## Session

- The session response is `{ accessToken, tokenType: 'Bearer', expiresAt, user }`.
- Keep the session (token, `expiresAt` and user) in `sessionStorage` and mirror it in the Redux session slice, as in FoodBridge. It survives a page refresh and is cleared when the tab closes. This overrides the build plan's in-memory choice; see `docs/decisions.md` (2026-11-01, session storage).
- Read it back on start-up, and treat it as signed out if `expiresAt` has passed.
- On sign-out, a 401, or expiry, clear both `sessionStorage` and the slice, then send the user to `/login`.
- Never put the token in `localStorage`, a cookie, the URL or a log. Do not invent refresh endpoints.

## Interface rules

- Every MVP journey screen has loading, empty, error, success and confirmation states. Empty means first use with no data.
- Forms keep entered values after a failed save. Disable double submit while a request is in flight; the server still protects against repeats.
- No reporter name or identity anywhere in the interface. Explain that reports are community evidence.
- Age labels use server timestamps (`lastEvidenceAt`, `generatedAt`, `newestReportAt`), never browser-made times. For example: "Community report · last confirmed 2 hours ago".
- Show flood `CURRENT` and `EXPIRED` clearly. "No current flood reports" never means "roads are safe"; never say so.
- Dashboard labels follow `docs/build.pdf` section 8: "Blocked-drain reports", not "unresolved drains". The current flood count counts reports, not roads. Show disputed pickups separately from missed pickups.
- `DISPUTED` shows both the completion time and the missed-pickup report.
- The hazard list must work when the map fails or is offline. The map never hides the list.
- Every status shows text as well as colour. Use semantic headings, labelled inputs, visible focus, keyboard-operable map and list controls, and announced success and error messages.
- Layouts must work on a phone, a tablet and a desktop.
- The photo input uses `capture="environment"` as a hint only. Never claim gallery uploads are blocked.
- Operator names in the data are fictional. Show the "Demonstration data (simulated) · people and activity are fictional; place names are real" banner ("Demo data (simulated) · fictional people, real places" on phones). See `docs/decisions.md` (2026-11-01, banner wording).

## Viewport and density

EkoWatch must look right at 100% browser zoom on an ordinary laptop. Users should never need to zoom out to see a screen.

- Target viewports (CSS pixels, after browser chrome): 1536 × 730 (a 1920 × 1080 screen at 125% Windows scaling), 1366 × 650 (a 1366 × 768 laptop), and 390 × 760 (phone).
- The sign-in page fits on one screen with no vertical scroll at all three target sizes. That includes the heading, both fields, an error message under each field, the Sign in button, the demo accounts and the demo notice. The landing page scrolls, with its header (logo and Sign in) fixed to the top; the hero headline, text and Sign in button fit above the fold. On every app screen, the page heading and its primary action are visible on load.
- Never fake a smaller zoom. No CSS `zoom`, no `transform: scale()` on a page wrapper, and no `html { font-size }` below 100%. These break users who set larger text in their browser and fail WCAG (Web Content Accessibility Guidelines) 1.4.4 Resize Text and 1.4.10 Reflow.
- Get the density from the design tokens instead:
  - Body text is 15–16px, and inputs are at least 16px on phones so iOS does not auto-zoom.
  - App page headings are 28–32px. The landing headline uses `clamp()` so it shrinks on shorter and narrower screens.
  - Card padding is 24–32px.
  - Form gaps are 16–20px.
- Shorter screens get tighter spacing through height media queries, for example `[@media(max-height:800px)]:`. Use `min-h-dvh` (dynamic viewport height), not `h-screen`, for full-height layouts.
- Keep the demo accounts on the sign-in card compact: one line per account showing role and email, never a tall card per account.
- Before saying a screen is done, check it in browser developer tools with the device toolbar set to each target size at 100% zoom, and report anything that needs scrolling.

## Folder structure

```text
src/
├── app/         # routes.tsx (route table, allowed roles, canOpen), router.tsx, store.ts, providers.tsx, session slice
├── components/
│   ├── ui/      # shared components copied from the shared repo
│   ├── form/    # Formik adapters
│   ├── common/  # StatusBadge, PageHeader, LoadingState, EvidenceAge and similar
│   └── layout/  # RequireSession, RequireRole, AppLayout, Sidebar, TopBar, DemoBanner
├── config/      # env.ts (reads VITE_API_BASE_URL)
├── constants/   # routes.ts, roles.ts, status.ts (enum → label)
├── hooks/       # useIdempotencyKey, useDocumentTitle, useRole, useNow
├── lib/         # cn.ts, format.ts (Africa/Lagos dates, relative ages)
├── pages/       # one thin file per route, named as in the routes table
├── schema/      # Yup schemas, one per form
├── sections/    # page-level blocks, one folder per screen
├── services/    # api.ts plus the domain files in the API table, errors.ts
├── styles/      # tokens.css
├── test/        # Vitest setup for pure-logic tests
└── types/       # ekowatch.ts
```

There is no `mocks/` folder.

## Commands

Run from the repository root.

```bash
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
```

Before saying a task is done, all four checks (lint, typecheck, test, build) must pass, and you must report what you saw on the live backend.

## Environment

- `VITE_API_BASE_URL`: `https://ekowatch-backend.onrender.com/api/v1`.
- Backend Swagger UI: https://ekowatch-backend.onrender.com/swagger-ui/index.html. OpenAPI JSON: https://ekowatch-backend.onrender.com/v3/api-docs.
- In local development, if the browser blocks requests because of CORS (Cross-Origin Resource Sharing), use a Vite dev proxy (`server.proxy` in `vite.config.ts`) that forwards `/api` to the backend. This only changes where requests go in development; it is not mock data. Production still needs the backend to allow the Qocent address, so report it.
- The backend runs on Render's free tier, which sleeps when idle. The first request after a quiet spell can take up to a minute. Loading states must cope with that (say it's waking up after a few seconds, never spin forever), and a slow first `curl` is not a failure.
- Never commit `.env`. Keep `.env.example` with variable names only.

## Deployment (Qocent Deploy, apps.qocent.com)

- The frontend deploys to Qocent Deploy, the same as FoodBridge. Do not add Vercel, Netlify or Render config.
- `VITE_API_BASE_URL` is baked into the bundle when Vite builds. It must be set wherever the production build runs: in Qocent's build settings if Qocent builds, or in GitHub Actions if Actions builds. Changing it needs a rebuild, not just a restart.
- Deep links must work. Refreshing `/reports/<id>` or `/authority/dashboard` on the deployed address must load the app, not a 404. Configure Qocent to serve `index.html` for unknown paths, and check it on the live address after the first deploy.
- The brief requires tests, type checking and linting to block a deploy. If Qocent deploys automatically on push, it must only see commits that passed CI (continuous integration). Either trigger the Qocent deploy from the GitHub Actions workflow after the checks pass, or protect the deploy branch so only checked commits can land on it. Ask me which one before writing the workflow.
- The backend must allow the Qocent frontend address in its CORS (Cross-Origin Resource Sharing) settings. If live requests fail with a CORS error, report it to me for Esther. Do not work around it in the frontend.
- Deployed frontend address: TODO.

## How we work

- Work in the slice order from `docs/build.pdf` section 13: identity and setup → report journey → collection journey → freshness and dispute → delivery evidence. Do not start a slice until its backend endpoints are deployed.
- Start every task in plan mode. Show the steps in order, every file you will create or change with its full path, and every decision I need to make. Wait for my approval.
- Any naming or contract difference goes to me first, then into `docs/decisions.md` as a dated line naming who agreed it. Never fix it silently on one side.
