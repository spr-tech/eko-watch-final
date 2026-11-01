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

## Open questions (need a decision before the related slice)

- **`reportedByMe` on `ReportView`:** add a boolean so the interface can show "You reported this" and hide Confirm, or drop the label from the design.
- **Note length:** the contract says 1 to 1000 characters; the design says 5 to 280. Pick one for both tiers.
- **Session storage:** the build plan keeps the access token in memory (a reload means signing in again). The alternative is `sessionStorage`, as in FoodBridge.
- **Operators and Reports:** the design hides the Reports page from operators. The backend allows every signed-in role to read reports. Keep operators out of Reports in the interface, or give them read access.
- **Deploy gate on Qocent:** trigger the Qocent deploy from GitHub Actions after checks pass, or protect the deploy branch so only passing commits land.
