Run this after the foundation (prompt 01) is merged. Start a new branch first:

```bash
git checkout main
git pull
git checkout -b feat/shared-building-blocks
```

Open Claude Code in the eko-watch folder, switch to plan mode (Shift+Tab), and paste the prompt below.

```
Read CLAUDE.md, docs/decisions.md and docs/design/README.md before anything else.
The foundation from prompt 01 is in place.

Task: build every piece of the EkoWatch frontend that does not need data from the
backend. Do not call the API in this task and do not add any RTK Query endpoints.
No mock data, fixtures or sample records anywhere in src/. Tests may pass literal
inputs to pure functions (for example an ISO date string or an error status), but
never a fabricated API response.

Scope, in this order:

1. Shared state components in src/components/common/:
   LoadingState, EmptyState, ErrorState (with an optional retry action),
   PageHeader, StatusBadge and EvidenceAge ("last confirmed 2 hours ago").
   - Take the look and wording from the loading, empty and error boards in
     docs/design/ekowatch/source/.
   - StatusBadge covers FloodStatus and CollectionStatus, always as text plus colour,
     never colour alone.
   - Status changes are announced to screen readers (role="status" or aria-live).

2. Fixed pages:
   - LandingPage at "/" from Main.dc.html, with the corrections in
     docs/design/README.md: no ward name in the header, "one Lagos ward" in the copy,
     no photo (plain brand-colour panel), never the word "placeholder", and no
     "[LOCATION]" or "[PHOTO CREDIT]".
   - A shared "You don't have access to this page" view from NoAccess.dc.html. Its
     wording must not say operators are refused Reports (we decided operators can
     read Reports; see docs/decisions.md).
   - A "Your session has ended" view, using the wording on the Reports board.

3. Sign-in page at /login, look and validation only:
   - From SignIn.dc.html: email and password fields, show/hide password, field
     errors, and the "wrong credentials" and "can't reach service" message styles.
   - Formik + Yup. Email required and valid; password required.
   - Do NOT wire submit to the API yet. Leave the submit handler as
     // TODO(slice-1): call createSession.
   - Leave out the demo account buttons. That decision is still open.
   - The whole card must fit at 1536 x 730 with an error under each field, with no
     page scroll (CLAUDE.md "Viewport and density").

4. Pure logic in src/lib/ and src/constants/, each with Vitest tests:
   - format.ts: Lagos dates and times using the Africa/Lagos timezone, never the
     computer's timezone. Formats: "Wednesday 28 October" for collection dates,
     relative ages ("just now", "12 min ago", "3 h ago", "yesterday"), and the flood
     countdown ("Expires in 3 h 40 min", "Expired"). Every function takes "now" as
     a parameter so tests don't depend on the real clock. Add a useNow hook that
     ticks once a minute for screens.
   - status.ts: label for every Role, ReportType, FloodStatus and CollectionStatus
     value. A test checks every enum value has a label.
   - roles.ts: which menu items and routes each role can open.
     Resident: Reports, Report a problem, My street, Hazards.
     Operator: Today's streets, Reports (read-only), Hazards.
     Authority: Dashboard, Reports (read-only), Hazards.
     Use it for the sidebar, the phone tab bar and the route guards (canOpen).
   - errors.ts: map an error to a message the user can act on. For now map by HTTP
     status: 400 field errors, 401 session ended, 403 no access, 404 not found,
     409 conflict, 413 photo too large, 415 photo type not supported, 5xx and
     network failure. Also map the stable codes listed in CLAUDE.md where the code
     is known. Mark the code mapping // TODO(contract): confirm codes with Esther.
     A lost response on report creation maps to "Outcome unknown, check or retry",
     never "failed".

5. Hooks in src/hooks/:
   - useIdempotencyKey: one UUID per user intent. It keeps the same key for
     retries of the same report and makes a new key only when the user starts a
     genuinely new report. Tested.
   - useDocumentTitle: "<Page> · EkoWatch".

6. Yup schemas in src/schema/, tested:
   - signIn: email and password required, email valid.
   - createReport:
     - reportType required, one of the four values.
     - streetId required.
     - note required, trimmed, 1 to 1000 characters.
     - collectionDate required only when reportType is MISSED_PICKUP, and must
       be absent otherwise.
     - photo optional: JPEG or PNG only, 5 MiB maximum, checked by file type and
       size before upload.
   - wardSetup: wardId and streetId required.

7. Route guards: RequireSession (redirect to /login when signed out) and
   RequireRole (show the shared no-access view), using roles.ts.
   The session comes from the sessionStorage-backed slice from the foundation.
   Update the sidebar and phone tab bar to use roles.ts, including Reports for
   operators.

Out of scope: any API endpoint or API call, real data screens (Reports, Report a
problem, Report detail, My street, Ward setup, Today's streets, Dashboard, Hazards),
the map, and the demo account buttons.

First, show me your plan: the steps in order, every file you will create or change
with its full path, and any decision I need to make. Wait for my approval.

When you finish:
- Run lint, typecheck, test and build, and report the results.
- Check /, /login, the no-access view and the session-ended view at 1536 x 730,
  1366 x 650 and 390 x 760 at 100% zoom.
- List every difference from the design files and every TODO you left.
```
