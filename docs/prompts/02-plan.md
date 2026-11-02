# Plan: shared building blocks with no backend (prompt 02)

Branch: `feat/shared-building-blocks`, from `main` at `54313ab` (foundation and footer notice merged). Written 2026-11-02 for an overnight run without approval stops.

The task, and the overnight rules from Muizz, are given in his message, with the prompt in `docs/prompts/02-claude-code-no-backend-pieces.md`. This task makes no API calls, adds no RTK Query endpoints and contains no mock data.

## Decisions already made (by Muizz)

- **Landing page:** no photo; use a plain brand-colour panel.
- **Sign-in:** no demo account buttons.
- **Map:** not in this task.
- **Demo notice:** it stays a footer (PR #4).

## Decisions I am making (and why)

1. **Error mapping lives in `src/services/errors.ts`, not `src/lib/`.** CLAUDE.md (Errors, Folder structure) names that path. The prompt lists it under "src/lib/ and src/constants/".
2. **The error mapper takes `{ status, code }`, not a whole RTK Query error.**
   - `describeError({ status, code, operation })` is pure, and tests pass literal statuses and codes, never a fabricated response body.
   - A small `toErrorInput(error)` reads status and code from an RTK Query error at runtime.
3. **Roles and routes live in `src/constants/roles.ts`.** It holds the menu per role, which roles may open each route, `canOpen(role, path)` and `homePathFor(role)`. `routes.tsx` reads the allowed roles from it, so guards and menus can't disagree. This replaces `src/components/layout/navItems.ts`.
4. **Menu order follows the design.** Residents get the green "Report a problem" button, then Reports, Hazards, My street. Operators get Today's streets, Reports, Hazards. Authorities get Dashboard, Reports, Hazards. `/collections` is still open to AUTHORITY (CLAUDE.md table), but it is not in their menu, as in the design.
5. **`DEV_ROLE` is removed.** `useRole` reads the session. The app frame is only rendered inside `RequireSession`, so a role is always present there.
6. **Session ended vs never signed in.**
   - The session slice gains `ended: boolean`. It is set when the stored session has expired on start-up, when `expiresAt` passes while the app is open (checked once a minute), and later on a 401 (slice 1).
   - `RequireSession` shows the "Your session has ended" view when `ended` is true. Otherwise it redirects to `/login?next=<path>`.
   - Signing out on purpose doesn't set `ended`, and sends the user to `/login` without `?next`.
7. **`/login` and `/` stay open when signed in.** Redirecting a signed-in user away belongs to slice 1, with `createSession`.
8. **The "wrong credentials" and "can't reach service" messages are built as a styled `FormAlert`.** Nothing shows them until slice 1 wires `createSession`. Submitting a valid form does nothing yet: `// TODO(slice-1): call createSession`.
9. **Relative ages:** "just now" (under a minute, or slightly in the future), "N min ago" (under an hour), "N h ago" (the same Lagos day), "yesterday" (the previous Lagos day), then "28 October".
10. **Flood countdown:** "Expires in 3 h 40 min", "Expires in 2 h", "Expires in 40 min", "Expired". It rounds up so it never says "0 min".
11. **`createReport` collectionDate:** required and `YYYY-MM-DD` for `MISSED_PICKUP`. For any other type a value is a validation error ("Only add a collection date for a missed pickup"); the form will clear it when the type changes.
12. **`LoadingState` says the service may be waking up** if loading takes more than 5 seconds (CLAUDE.md "Environment": free-tier backend). It never spins forever without words.
13. **Screenshot checks of the no-access and session-ended views need a session in the browser.** For the check only, my script writes a clearly fake session into the test browser's sessionStorage (token `layout-check-not-a-token`, name "Layout check"). Nothing is added to `src/`, and nothing is sent to the backend.

## Steps, in order

All paths are relative to the repo root `C:\Users\HP\Desktop\coding\capstone\eko-watch\`.

1. **Pure logic and tests**
   - `src/lib/format.ts`, `src/lib/format.test.ts`: Lagos dates, ages and the flood countdown, each taking `now`.
   - `src/hooks/useNow.ts`: ticks once a minute.
   - `src/hooks/useDocumentTitle.ts`, `src/hooks/useDocumentTitle.test.ts`.
   - `src/hooks/useIdempotencyKey.ts`, `src/hooks/useIdempotencyKey.test.ts`.
   - `src/constants/status.ts`: already has every label; its existing test checks every enum value.
   - `src/constants/roles.ts`, `src/constants/roles.test.ts`: menu, route access, `canOpen`, `homePathFor`.
   - `src/services/errors.ts`, `src/services/errors.test.ts`.
   - `src/schema/signIn.ts`, `src/schema/createReport.ts`, `src/schema/wardSetup.ts`, plus a `.test.ts` for each.
2. **Session**
   - `src/app/sessionSlice.ts`: add `ended` and `sessionExpired`; `loadStoredSession` reports an expired session.
   - `src/app/sessionSlice.test.ts`: update.
   - `src/app/store.ts`: use the new load result.
3. **Shared state components** in `src/components/common/`, styled from the design boards:
   - `LoadingState.tsx`
   - `EmptyState.tsx`
   - `ErrorState.tsx` (optional retry)
   - `PageHeader.tsx`
   - `StatusBadge.tsx` (FloodStatus and CollectionStatus, text plus colour)
   - `EvidenceAge.tsx`
   - `StateIcon.tsx` (the icon tile)

   They announce changes with `role="status"` or `role="alert"`.
4. **Form adapters** in `src/components/form/`:
   - `FormInput.tsx`
   - `FormPasswordInput.tsx` (show/hide)
   - `FormAlert.tsx`
   - `FocusFirstError.tsx`
   - `useFieldError.ts`
   - `focusField.ts`
   - `types.ts`
5. **Fixed pages**
   - `src/sections/landing/LandingPage.tsx` (and its parts) from `Main.dc.html`, with the corrections: no ward name, "one Lagos ward", no photo, no placeholder text.
   - `src/sections/access/NoAccessView.tsx` from `NoAccess.dc.html`. It must not say operators are refused Reports.
   - `src/sections/access/SessionEndedView.tsx`, with the Reports board wording.
   - `src/pages/LandingPage.tsx`: now the real page.
6. **Sign-in page**
   - `src/sections/sign-in/SignInPage.tsx`, `SignInForm.tsx`: Formik and Yup, show/hide password, field errors, and `FormAlert` styles. Submit is a TODO.
   - `src/pages/LoginPage.tsx`.
   - It must fit at 1536 × 730 with an error under each field.
7. **Guards and menus**
   - `src/components/layout/RequireSession.tsx`, `src/components/layout/RequireRole.tsx`.
   - `src/app/routes.tsx` uses them with roles from `roles.ts`.
   - `Sidebar.tsx`, `TabBar.tsx`, `AppLayout.tsx`, `TopBar.tsx` and `PhoneTopBar.tsx` use `roles.ts` and the session role.
   - Delete `src/components/layout/navItems.ts` and the `DEV_ROLE` constant in `src/hooks/useRole.ts`.
   - `src/components/common/PlaceholderPage.tsx` sets the document title.
8. **Docs**
   - `docs/ai-log.md`: an entry.
   - `docs/decisions.md`: Proposed entries for decisions that change behaviour (decision 6, session-ended handling).
9. **Checks**
   - Run lint, typecheck, test and build until they pass.
   - Screenshots and a scroll check of `/`, `/login` (empty and with errors), the no-access view and the session-ended view at 1536 × 730, 1366 × 650 and 390 × 760.

## Not in this task

API endpoints or calls, real data screens, the map, demo account buttons, package changes, commits, pushes and branch changes.
