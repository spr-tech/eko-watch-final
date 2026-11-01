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

## Contract differences found in the deployed backend (2026-11-01)

Compared https://ekowatch-backend.onrender.com/v3/api-docs with the build plan. Needs Esther's answer; the frontend follows the deployed backend until then.

- **`WardView.wardName` and `StreetView.streetName`** instead of the plan's `name`. Rename in the backend, or accept the deployed names in the plan.
- **No error responses documented.** No 400, 401, 403, 404 or 409, and no `application/problem+json` shape. Check the real errors match plan section 9 and add them to the OpenAPI document.
- **Status codes.** `POST /reports` shows 200; the plan says 201 with a `Location` header. `PUT .../collections/{collectionDate}` shows only 200; the plan says 201 for a first insert and 200 for a repeat.
- **`Idempotency-Key` is not marked required** on `POST /reports`. The plan requires it and returns `IDEMPOTENCY_KEY_REQUIRED` without it.
- **No authentication scheme documented.** Which endpoints need `Authorization: Bearer`?
- **No required or nullable fields marked** in responses. The plan says nullable fields are always present with `null`.
- **`X-Request-ID`** is not documented. Is it echoed back?
- **`GET /operators/me/streets` takes optional `fromDate` and `toDate`.** These are not in the plan. What do they filter?
- **`CurrentUserView` includes `email`** and **`PhotoView` includes `contentType` and `sizeBytes`.** These are extra fields, harmless; add them to the plan.
- **No `reportedByMe` on `ReportView`.** "You reported this" stays out of the interface.

## Open questions (need a decision before the related slice)

- **`reportedByMe` on `ReportView`:** add a boolean so the interface can show "You reported this" and hide Confirm, or drop the label from the design.
- **Note length:** the contract says 1 to 1000 characters; the design says 5 to 280. Pick one for both tiers.
- **Deploy gate on Qocent:** trigger the Qocent deploy from GitHub Actions after checks pass, or protect the deploy branch so only passing commits land.
