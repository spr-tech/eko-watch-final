# Decisions

Every change to the contract, the build plan or the agreed scope gets a dated entry: what changed, why, and who agreed. A decision is only agreed when both a service engineer and the interface engineer have signed it. Until then it stays under Proposed.

## Agreed

_None yet._

## Proposed (needs Adedayo and Esther)

### 2026-11-01 · Frontend stack: RTK Query instead of TanStack Query
- **Change:** use Redux Toolkit + RTK Query (Redux Toolkit Query) for server data and Formik + Yup for forms, instead of TanStack Query and plain component state (build plan section 11).
- **Why:** same stack as the FoodBridge frontend, so layout, form adapters, error handling and the idempotency hook can be reused. One interface engineer carries both products.
- **Unchanged:** every name in the build plan. RTK Query endpoint keys equal the OpenAPI operationIds, and API files are named after the plan's modules (`reportApi`, `collectionApi` and so on).
- **Proposed by:** Muizz · **Agreed by:** pending

### 2026-11-01 · No mock data in the frontend
- **Change:** no mock server, fixtures or fake data in the frontend. Every screen is built and tested against the deployed backend.
- **Cost:** each frontend slice waits for its endpoints to be deployed.
- **Proposed by:** Muizz · **Agreed by:** pending

### 2026-11-01 · Landing page at `/`
- **Change:** add a public landing route `/`, which is not in the build plan's route table.
- **Proposed by:** Muizz · **Agreed by:** pending

### 2026-11-01 · Viewport targets
- **Change:** screens must fit at 100% browser zoom at 1536 × 730 and 1366 × 650 CSS pixels and on phone. The design boards are drawn at 1440 × 900.
- **Proposed by:** Muizz · **Agreed by:** pending

### 2026-11-01 · Session kept in sessionStorage, not memory
- **Change:** the access token and current user are kept in `sessionStorage` (cleared when the tab closes) instead of memory only (build plan section 7).
- **Why:** with memory only, every page refresh signs the user out. That includes refreshes during a live demo and reloads while the free-tier backend wakes up.
- **Cost:** code running on the page could read the token from `sessionStorage`, which it could not do from memory alone. Accepted because all data is fictional and there are no real accounts.
- **Reverse if:** EkoWatch ever holds real residents' data, or the backend offers an httpOnly cookie session.
- **Proposed by:** Muizz · **Agreed by:** pending

### 2026-11-01 · Operators can see Reports, read-only
- **Change:** operators get Reports in their menu and can read the report list and details. They can't confirm or create reports. The design had hidden Reports from operators.
- **Why:** it matches the backend, where every signed-in role can read reports (build plan section 7). It also lets an operator see residents' complaints about their streets, which ties into disputed pickups.
- **Cost:** one more role variation to build and test, with no design of its own (it reuses the ward office's read-only view).
- **To confirm:** the deployed backend actually lets operators call `GET /reports` and `GET /reports/{reportId}`. If it returns 403 for operators, this decision has to change on one side or the other.
- **Proposed by:** Muizz · **Agreed by:** pending

### 2026-11-01 · Form control border darker than the design
- **Change:** input, select and outline-button borders use `#6B7B8D` (`--color-border-input` in `src/styles/tokens.css`) instead of the design's `#8A99AB`.
- **Why:** WCAG 2.2 (1.4.11 Non-text Contrast) needs 3:1 for the edge of a form control. Measured: `#8A99AB` is 2.91:1 on white (`#FFFFFF`) and 2.70:1 on the page background (`#F4F7FA`), so both fail. `#6B7B8D` is 4.34:1 on white and 4.03:1 on the page background.
- **Cost:** borders look slightly heavier than the design boards.
- **Reverse if:** the design is updated with a border colour that reaches 3:1 on both backgrounds.
- **Proposed by:** Muizz · **Agreed by:** pending

### 2026-11-01 · Demonstration banner wording
- **Change:** the banner reads "Demonstration data (simulated) · people and activity are fictional; place names are real", shortened on phones to "Demo data (simulated) · fictional people, real places". This is the design's wording. CLAUDE.md said "Demonstration data · names and activity are fictional" and now matches the design.
- **Why:** the brief requires real place names and fictional people and activity, and asks for anything simulated to be labelled beside it. The design's wording says all three; the old line didn't say the place names are real.
- **Cost:** a longer line; the phone version is shorter so it fits on one line at 390px.
- **Reverse if:** the backend seed data stops being simulated, in which case "(simulated)" comes out.
- **Proposed by:** Muizz · **Agreed by:** pending

### 2026-11-01 · Demo data notice moved from top banner to footer
- **Change:** the demonstration data notice is now a quiet footer below the page content (13px muted text, centred, a thin top border, no coloured strip) instead of a yellow banner across the top. On desktop it sits in the main column, not under the sidebar. On phones it sits above the bottom tab bar. The wording is unchanged (see "Demonstration banner wording" above).
- **Why:** the top banner pushed the app down and took attention from the content.
- **Cost:** on long pages the notice can be below the fold. Other in-place labels, such as "Operator names are fictional", stay where they are.
- **Reverse if:** an assessor or facilitator says the label isn't visible enough.
- **Proposed by:** Muizz · **Agreed by:** pending

### 2026-11-02 · Demo notice placement on the public pages
- **Change:** on `/` and `/login` the demo data notice is no longer a full-width footer strip. On `/login` it sits directly under the sign-in card; on `/` directly under the hero's right-hand panel, both in the right column (below the content on phones). Same wording, long on desktop and short on phones, as small text with `role="note"`. On the blue landing hero the text is `#E6EDF5` (5.8:1); elsewhere muted `#4A5A6B` (6.6:1). Signed-in pages keep the footer.
- **Why:** the sign-in page must fit on one screen with no scroll (CLAUDE.md "Viewport and density"), and a strip across the bottom took a row of height from it. Next to the content, the label is visible on load on both pages, instead of at the very end of the long landing page.
- **Cost:** the notice is in a different place on public and signed-in pages.
- **Reverse if:** an assessor or facilitator says the label isn't visible enough on the public pages.
- **Proposed by:** Muizz · **Agreed by:** pending

### 2026-11-02 · Landing page header fixed to the top
- **Change:** the landing page keeps all its sections and scrolls, but its header (logo and Sign in) stays fixed to the top of the screen while scrolling. The design's header scrolls away with the hero.
- **Why:** a visitor reading further down can still sign in or go home without scrolling back up.
- **Cost:** the header takes about 64px of height on every scroll position, which matters most on phones.
- **Reverse if:** testing on phones shows the fixed header crowds the content.
- **Proposed by:** Muizz · **Agreed by:** pending

### 2026-11-02 · "Your session has ended" instead of a silent redirect
- **Change:** when a session runs out (its `expiresAt` passes, checked on start-up and once a minute) or, from slice 1, the service answers 401, the frontend clears the session and shows "Your session has ended" with "Sign in again", which returns the user to the page they were on. A user who was never signed in goes straight to `/login`. Signing out on purpose goes to `/login` without the message. The design draws this as a dialog over the page; here it fills the page, because the session is already gone.
- **Why:** CLAUDE.md "Session" (expiry and 401 mean signing in again), and the design's session-ended state. Saying why the user is back at sign-in is clearer than an unexplained redirect.
- **Cost:** the page they were reading isn't shown behind the message.
- **Reverse if:** testing shows users would rather keep reading the page behind a dialog.
- **Proposed by:** Claude Code on Muizz's overnight instructions · **Agreed by:** pending

### 2026-11-02 · Landing page leaves out the sample activity
_The sample report card part is reversed; see "Sample report card back in the landing hero" below. The ticker stays out._
- **Change:** the landing page leaves out the design's "Sample activity (fictional)" ticker and the animated sample report card in the hero. The photo slot is a plain dark panel with the EkoWatch icon.
- **Why:** both are hard-coded made-up records, and CLAUDE.md allows no sample arrays or placeholder records in `src/`. The photos have no licence or credit yet (docs/design/README.md correction 5).
- **Cost:** the hero shows less of what the app does.
- **Reverse if:** the team agrees that clearly labelled illustrative copy on the landing page isn't "mock data", or the ticker can read real recent activity from a public endpoint.
- **Proposed by:** Claude Code on Muizz's overnight instructions · **Agreed by:** pending

### 2026-11-02 · Photos on the landing and sign-in pages, for the demo only
- **Change:** the landing hero, the "Refuse that isn't collected" section, the demo account card and the sign-in panel show photos (`public/flooded-road-traffic-1.webp`, `drain-clearing-crew-2.webp`, `flooded-market-street-3.webp`, `residents-wading-flood-4-1600.jpg`, `residents-wading-flood-5.jpg`) instead of plain panels. Photos used for the capstone demo; sources and credits pending; not cleared for public launch. No captions until the credits are confirmed, so no "[PHOTO CREDIT]", "[LOCATION]" or place names are shown. The sign-in panel alternates its two photos every 7 seconds, with a Pause/Play button, and shows only the first under reduced motion. `residents-wading-flood-4-1600.jpg` is a 1600px-wide copy of the 4895px original, made for page weight. That photo is not referred to as Lagos anywhere.
- **Why:** the design uses photos in these slots; the plain panels made the public pages read as unfinished.
- **Cost:** the photos must be replaced or credited before any public launch.
- **Reverse if:** a photo's source can't be confirmed or its owner objects.
- **Agreed by:** Muizz Jamiu

### 2026-11-02 · Sample report card back in the landing hero
- **Change:** the design's "Flooded road" sample report card returns to the hero photo, labelled "Sample report (fictional)", with its animation (pin drop, card slide-in, confirmation dots, expiry bar) after the hero's on-load entrance. It is fixed display copy written in `src/sections/landing/LandingHero.tsx`, not an array or anything a feature screen reads. Under reduced motion the finished card shows with no animation. The design's "Blocked drain reported" chip and Replay button are not built.
- **Why:** reverses the card part of "Landing page leaves out the sample activity" under its "Reverse if" condition: clearly labelled illustrative copy on the landing page isn't mock data. The ticker stays out.
- **Agreed by:** Muizz Jamiu

### 2026-11-02 · Ward office and operators get their ward from the data, not the user record
- **Change:** the ward office (demo5) has `wardId: null`, but the dashboard and report list need a ward. The frontend uses the ward from `GET /wards`; if more than one ward comes back, it shows a ward picker. Operators also have `wardId: null`; they use the `wardId` on their assigned streets (`GET /operators/me/streets`). Residents keep using `CurrentUserView.wardId`.
- **Why:** these are real records from the backend, not guesses, and the demo seeds have a single ward.
- **Follow-up:** Muizz is asking the backend team to set demo5's `wardId`. Once set, the user's own `wardId` wins.
- **Agreed by:** Muizz Jamiu

### 2026-11-02 · Demo accounts and their password in the frontend bundle
- **Change:** the sign-in page has a "Demo accounts" panel in three columns: Resident (Resident 1 = demo1, Resident 2 = demo2), Operator (Operator = demo4) and Ward office (demo5). Choosing one fills in the email and the shared password `DEMO@123` and moves focus to Sign in; it never signs in by itself. The accounts live only in `src/constants/demoAccounts.ts`.
- **Why:** assessors and the demo audience can try every role without typing credentials. The layout follows FoodBridge's panel, inside the card under a divider as in `SignIn.dc.html`, with EkoWatch's tokens.
- **Cost:** the demo emails and the shared password ship in the public JavaScript bundle. Acceptable only because the accounts are fictional demo accounts with no real data.
- **Differs from:** CLAUDE.md's "one line per account showing role and email". The buttons show the account name; the email is in each button's accessible name and fills in the field when chosen.
- **Left out:** demo3, demo6 and demo7 until their passwords work on the backend. demo8 is left out on purpose (2026-11-02, sign-in polish): it is the operator with no assigned streets that Esther keeps for testing 403 `WARD_ASSIGNMENT_REQUIRED`, so in a demo its home page would only show an error.
- **Reverse if:** any account ever holds real data, or the backend stops seeding the demo accounts.
- **Agreed by:** Muizz Jamiu

### 2026-11-02 · Sign-in gives up after 45 seconds
- **Change:** a sign-in still unanswered after 45 s is cancelled: the button reads "Sign in" again, the alert says "Can't reach EkoWatch right now. Check your connection, then try again." and the email and password stay filled in. The "may be waking up" note still appears after 5 s. Other requests keep the 90 s limit in `api.ts`.
- **Why:** 90 s felt like a hang on the sign-in page. A press of Sign in after a cancelled attempt usually lands, because the first request has woken the backend.
- **How a late answer is kept out:** the form aborts the RTK Query mutation. Aborting cancels the fetch and rejects at once, and RTK Query never delivers an answer that arrives afterwards, so the session is only stored from an answer received in time. Leaving the page also aborts a sign-in in flight.
- **Cost:** a backend that takes 45–60 s to wake needs a second press.
- **Agreed by:** Muizz Jamiu

### 2026-11-02 · Network error wording
- **Change:** the shared network message (`src/services/errors.ts`) is "Can't reach EkoWatch right now." with "Check your connection, then try again." The sign-in alert now uses the same message.
- **Differs from:** `SignIn.dc.html`, which says "We can't reach EkoWatch right now. Try again in a moment."
- **Agreed by:** Muizz Jamiu

### 2026-11-02 · Sign-in card tilt and a quieter slideshow button
- **Change:** the sign-in card tilts up to 3° towards the mouse pointer and eases back flat when the pointer leaves. Only with a mouse (`hover: hover` and `pointer: fine`), never under reduced motion, and never while a field has focus; when flat it has no transform at all, so text stays sharp. The Pause/Play button is 28 × 28 px (WCAG 2.5.8 needs 24) with a 12px icon on 45% navy and a thin half-white outline, instead of 44 × 44 px with a 20px icon on 70% navy.
- **Why:** a little life on the sign-in page; the old button competed with the photo.
- **Differs from:** `SignIn.dc.html`, which has no tilt.
- **Agreed by:** Muizz Jamiu

### 2026-11-02 · Shorter photo strip on phones
- **Change:** the sign-in photo strip on phones is 126px tall instead of 150px, and demo account buttons never wrap their label.
- **Why:** with both field errors showing, the page scrolled by 24px at 390 × 760.
- **Agreed by:** Muizz Jamiu

## Overnight run, 2026-11-02 to 11-03 (core loop steps 2 to 6)

Every entry here was proposed by Claude Code overnight, without a chance to ask. Each one is "Agreed by: pending" until reviewed.

### 2026-11-02 · `feat/core-loop-pages` starts from the sign-in work, not bare `main`
- **Change:** the branch was created from `main`, then moved (before any commit) to the tip of `feat/sign-in-polish`, because `main` has no sign-in, no `openapi.json` and no view types, so nothing could be tested on the live backend. `git merge` is on the deny list, so nothing was merged; the branch simply starts later in the same history.
- **Cost:** until `feat/core-loop` and `feat/sign-in-polish` are merged, the pull request for this branch also shows their commits.
- **Proposed by Claude Code overnight, Agreed by:** pending

### 2026-11-02 · Reports filters: "Waste" split into two chips
- **Change:** the chips are All, Flooding, Drains, Missed pickups and Dumping. The design's "Waste" chip covers two report types, but `GET /reports` takes one `reportType`. "Current floods only" selects Flooding and sends `reportType=FLOODED_ROAD&floodStatus=CURRENT`. Filters and page live in the address.
- **Proposed by Claude Code overnight, Agreed by:** pending

### 2026-11-02 · Reports header without "Newest report: 12 min ago"
- **Change:** left out. `GET /reports` sorted by confirmations gives no server timestamp for the newest report; showing one would need a second request or a time made in the browser.
- **Proposed by Claude Code overnight, Agreed by:** pending

### 2026-11-02 · Confirm only on report detail, and paging under the list
- **Change:** the list shows the count and "You confirmed this", but the Confirm button is on the report's page only (the design also has one on each row). Lists over 20 reports get Previous / Page x of y / Next; the design has no paging.
- **Proposed by Claude Code overnight, Agreed by:** pending

### 2026-11-02 · Wording added for states the design doesn't draw
- **Change:** ward office and operators with an empty list: "No reports in your ward yet. Reports from residents will show here as they come in." (no Report a problem button). Current floods only with no results: "No current flood reports. That does not mean the roads are clear, only that no one has reported flooding recently." Report page: a current flood says "Expires in 3 h unless someone confirms it again"; an expired one says "No recent confirmations. This doesn't mean the road is clear."; a missed pickup says "Collection day missed: Friday 30 October". Operators: "Operators see confirmations but do not confirm reports." A reply with an enum value the app doesn't know: "EkoWatch sent a reply this app doesn't recognise." A ward office that can see several wards gets a "Choose a ward" list (`?ward=` in the address).
- **Proposed by Claude Code overnight, Agreed by:** pending

### 2026-11-02 · Today's streets details
- **Change:** the page asks `GET /operators/me/streets?fromDate=today&toDate=today` and `GET /collection-schedules` for the operator's ward and today (size 100), and shows assigned streets that have a schedule today. A street that was marked earlier shows "Marked done at 09:58" (Lagos time). A disputed one says "Marked done at 09:58, but residents reported the pickup as missed." with a link to the missed-pickup reports. If the PUT answers 200 (already recorded), the row says "Already marked done today at 09:58. Refreshed." If the reply is lost, the page says it can't tell yet, re-reads the list, and says marking twice is safe.
- **Proposed by Claude Code overnight, Agreed by:** pending

### 2026-11-02 · Report a problem details
- **Change:** the form follows `ReportNew.dc.html` without "Use my location": the street is enough on its own, and asking for the browser's position adds a permission prompt and precise coordinates for no gain in the MVP. A resident with no ward gets "Choose your street first" with a link to `/setup` instead of the form. The collection-day list shows the street's scheduled days in the last 30 days up to today (Lagos), newest first. On success the user lands on the new report with a "Report sent" toast. If the photo upload fails, the message adds "You can also remove the photo and send the report without it."
- **Idempotency:** the key belongs to the request body. A retry of the same body (and the same photoId) reuses it; any change to the report makes a new one, so the service never sees a reused key with different details.
- **Proposed by Claude Code overnight, Agreed by:** pending

### 2026-11-02 · Confirm details
- **Change:** residents see "Confirm it's still there" until they have confirmed, then "You confirmed this". On an expired flood they confirmed before, the button reads "Confirm it again" (it refreshes the evidence; the count doesn't go up). Because `ReportView` has no `reportedByMe`, a resident also sees the button on their own report; pressing it gets the 409 and "You can't confirm your own report. Your neighbours can confirm it if they see it too." 400, 403, 404 and 409 undo the change; a lost reply or a 5xx keeps it and says "We can't tell yet if your confirmation was saved." with Check again, which reads the report from the service.
- **Proposed by Claude Code overnight, Agreed by:** pending

### 2026-11-02 · Step 5 built before steps 3 and 4
- **Change:** the operator's Today's streets (step 5) was built straight after step 2. The one allowed operator write is "today's Fictional Bamboo Street", and Bamboo Street is only scheduled on 2 November; after midnight in Lagos "today" would no longer include it. Commits stay one per step.
- **Proposed by Claude Code overnight, Agreed by:** pending

## Contract differences found in the deployed backend

### Checked again 2026-11-02 (openapi.json saved to the repo, plus live `curl`)

Fixed since 2026-11-01, now matching the build plan:
- Error responses are documented (400, 401, 403, 404, 409, 413, 415), and the `info.description` lists every stable `code`. Live 400, 401, 403 and 404 bodies are `application/problem+json` with `type`, `title`, `status`, `code`, `detail`, `instance`, `requestId`, and `fieldErrors` (`[{ field, message }]`) on validation failures.
- `POST /reports` documents 201; `PUT .../collections/{collectionDate}` documents 200 and 201.
- `Idempotency-Key` is marked required on `POST /reports`.
- Authentication is documented: bearer token on everything except `POST /auth/sessions` and `POST /auth/login`.

Still open, or new:
- **`WardView.wardName` and `StreetView.streetName`** instead of the plan's `name`. The frontend uses the deployed names.
- **`ProblemDetail` is referenced but not defined** in `components.schemas`, so the error body shape exists only in the description and in live responses.
- **No required or nullable fields marked** in any schema. The frontend types nullability from the plan and from live responses (`src/types/ekowatch.ts`).
- **`GET /collection-schedules` requires `wardId`** as well as `fromDate` and `toDate`. Without it the backend returns 400 `VALIDATION_FAILED`.
- **`GET /operators/me/streets?fromDate&toDate`** returns only the assigned streets that have a schedule in that range (without dates, all assigned streets). It returns `StreetView[]`, with no collection status, so "Today's streets" also reads `GET /collection-schedules` for today.
- **`ReportView.mapLocation`** is present. It is the street's point (`locationPrecision: 'STREET'`), not the reporter's position.
- **Extra endpoint `POST /auth/login`**, same body and response as `POST /auth/sessions`. The frontend uses `createSession` only.
- **CORS preflights sometimes hang.** On 2026-11-02, `OPTIONS /api/v1/auth/sessions` from `http://localhost:4173` got no answer within 40 s twice in a row, then took 22 s, then 0.8 s; the `POST` itself answered in 3 to 5 s. While a preflight hangs, the browser's sign-in waits with it (the form says EkoWatch may be waking up; the request gives up after 90 s). For Esther: check whether preflights reach the app while it is waking, and whether `Access-Control-Max-Age` (3600) is being honoured.
- **Allowed local origins:** `http://localhost:5173` and `http://localhost:4173` pass the preflight; `http://localhost:5174` gets 403. The Qocent address will need adding when it exists.
- **`X-Request-ID`** is not documented. Each error body carries a `requestId`.
- **`CurrentUserView` includes `email`** and **`PhotoView` includes `contentType` and `sizeBytes`.** Extra fields, harmless; add them to the plan.
- **No `reportedByMe` on `ReportView`.** "You reported this" stays out of the interface.

### Overnight contract checks (live `/v3/api-docs` against `openapi.json`)

- 2026-11-02 17:40 UTC, before step 2: identical.
- Found while wiring step 2 and 5 (live `curl`): `GET /operators/me/streets` for demo8, the operator with no streets, answers `200 []`, not 403 `WARD_ASSIGNMENT_REQUIRED`. `GET /collection-schedules` returns a `Page` (`items`, `page`, `size`, `totalElements`, `totalPages`), like `GET /reports`.

- 2026-11-02 22:12 UTC, before step 3: identical.
- 2026-11-02 22:38 UTC, before step 4: identical.
- **`POST /photos` answers 500 `INTERNAL_ERROR`** (2026-11-02, about 22:40 UTC) for a valid 272 KB JPEG, from the app and from plain `curl -F file=@photo.jpg;type=image/jpeg` alike. Request IDs `ba38cbf5-886a-44ca-aca7-8fe93dc1f51b` and `bb49584f-4098-4979-84a4-b3b82d2971c8`, for Esther and Adedayo. Reports without a photo work.

### Demo accounts on the live backend (2026-11-02)

For the backend team (Adedayo). Password `DEMO@123` for all.
- Sign in: demo1, demo2 (RESIDENT, with ward and street), demo4, demo8 (OPERATOR), demo5 (AUTHORITY).
- **401 `UNAUTHENTICATED`: demo3, demo6 (RESIDENT) and demo7 (OPERATOR).** Left off the sign-in panel until they work.
- **demo8 has no assigned streets**: deliberate, per Esther's notes, to test 403 `WARD_ASSIGNMENT_REQUIRED`. Not on the sign-in panel.
- **demo5 has `wardId: null`** (see the ward decision above).

## Open questions (need a decision before the related slice)

- **`reportedByMe` on `ReportView`:** add a boolean so the interface can show "You reported this" and hide Confirm, or drop the label from the design.
- **Note length:** the contract says 1 to 1000 characters; the design says 5 to 280. Pick one for both tiers.
- **Deploy gate on Qocent:** trigger the Qocent deploy from GitHub Actions after checks pass, or protect the deploy branch so only passing commits land.
