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
- **`X-Request-ID`** is not documented. Each error body carries a `requestId`.
- **`CurrentUserView` includes `email`** and **`PhotoView` includes `contentType` and `sizeBytes`.** Extra fields, harmless; add them to the plan.
- **No `reportedByMe` on `ReportView`.** "You reported this" stays out of the interface.

### Demo accounts on the live backend (2026-11-02)

For the backend team (Adedayo). Password `DEMO@123` for all.
- Sign in: demo1, demo2 (RESIDENT, with ward and street), demo4, demo8 (OPERATOR), demo5 (AUTHORITY).
- **401 `UNAUTHENTICATED`: demo3, demo6 (RESIDENT) and demo7 (OPERATOR).** Left off the sign-in panel until they work.
- **demo8 has no assigned streets**, so its "Today's streets" is empty.
- **demo5 has `wardId: null`** (see the ward decision above).

## Open questions (need a decision before the related slice)

- **`reportedByMe` on `ReportView`:** add a boolean so the interface can show "You reported this" and hide Confirm, or drop the label from the design.
- **Note length:** the contract says 1 to 1000 characters; the design says 5 to 280. Pick one for both tiers.
- **Deploy gate on Qocent:** trigger the Qocent deploy from GitHub Actions after checks pass, or protect the deploy branch so only passing commits land.
